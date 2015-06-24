exports.calcFreeTierCost = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            ItemDescription: {
                $regex: /free tier/
            }
        }
    }, {
        $project: {
            _id: 1,
            UsageQuantity: 1,
            ResourceId: 1,
            NonFreeCost: 1
        }
    }]).exec(function(e, d) {
        for (var i in d) {
            // console.log(d[i]._id + "\t" + d[i].Cost + "\t" + d[i].Rate);
            var conditions = {
                _id: {
                    $eq: d[i]._id
                }
            };
            var update = {}
            var options = {
                multi: true
            };
            mongoose.model('Billings').update(conditions, update, options, callback);

            function callback(err, numAffected) {
                console.log(numAffected)
            };
        }
        res.send(d);
    });
};
exports.totalCostProduct = function(req, res) {
    var totalCostProduct = {};
    mongoose.model('Billings').aggregate([{
        $match: {
            NonFreeCost: {
                $gt: 0
            }
        }
    }, {
        $project: {
            _id: 1,
            ResourceId: 1,
            NonFreeCost: 1,
            ProductName: 1,
            UsageStartDate: 1
        }
    }, {
        $group: {
            _id: "$ProductName",
            Total: {
                $sum: "$NonFreeCost"
            }
        }
    }]).exec(function(e, d) {
        var totalCostProduct = {};
        totalCostProduct = {
            data: d,
            month: currentBillingCollection.substring(9,11),
            year: currentBillingCollection.substring(5,9) 
        }
        // console.log(totalCostProduct);
        res.send(totalCostProduct);
    });
};


exports.hourlyCostProduct = function(req, res) {
    var productName = req.query.productName;
    var productName = 'Amazon Elastic Compute Cloud' //Is this variable override intended??
    mongoose.model('Billings').aggregate([{
        $match: {
            NonFreeCost: {
                $gt: 0
            },
            ProductName: {
                $eq: productName
            }
        }
    }, {
        $group: {
            _id: "$UsageStartDate",
            Total: {
                $sum: "$NonFreeCost"
            }
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
};

exports.instanceCostAll = function(req, res) {
        // console.log("Cost request",req.query.instance);
        var instanceId = req.query.instance;
        var volumeId;
        //instances hashmap
        var instances = {};

        // Query instances collection to associate volumeIds to instanceIds. 
        mongoose.model('ec2Instances').aggregate([{
            $match: {
                Id: {
                    $eq: instanceId
                }
            }
        }, {
            $project: {
                _id: 0,
                VolumeId: 1
            }
        }]).exec(function(err, result) {
            console.log("result",result);
            // console.log(result[0].VolumeId[0]);
            // console.log(instanceId);

            volumeId = result[0].VolumeId[0]

            //query billing collection for cost on EC2 resourceId's
            mongoose.model('Billings').aggregate([{
                $match: {
                    ResourceId: {
                        $eq: instanceId
                    }
                }
            }, {
                $project: {
                    _id: 0,
                    ResourceId: 1,
                    NonFreeCost: 1,
                    UsageStartDate: 1
                }
            }, {
                $group: {
                    _id: "$UsageStartDate",
                    ResourceId: {
                        $addToSet: "$ResourceId"
                    },
                    VolumeId: {
                        $addToSet: volumeId
                    },
                    Total: {
                        $sum: "$NonFreeCost"
                    }
                }
            }, {
                $sort: {
                    _id: 1 // Need to sort by date.
                }
            }]).exec(function(e, d) {
                // Create a hashmap of instances
                for (var r in d) {
                    instances[d[r]._id] = {
                        resourceId: d[r].ResourceId[0],
                        volumeId: d[r].VolumeId[0],
                        cost: d[r].Total,
                        date: d[r]._id
                    };
                }
                // Query billings collection for volumeId costs.
                mongoose.model('Billings').aggregate({
                    $match: {
                        ResourceId: {
                            $eq: volumeId
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        ResourceId: 1,
                        NonFreeCost: 1,
                        UsageStartDate: 1
                    }
                }, {
                    $group: {
                        _id: "$UsageStartDate",
                        VolumeId: {
                            $addToSet: "$ResourceId"
                        },
                        Total: {
                            $sum: "$NonFreeCost"
                        }
                    }
                }, {
                    $sort: {
                        _id: 1 // Need to sort by date.
                    }
                }).exec(function(e, d) {
                    // Total up the costs of volumeId with respective instanceId's or that hour.
                    for (var r in d) {
                        if (d[r]._id in instances) {
                            instances[d[r]._id].cost += d[r].Total;
                        }
                    }
                    // Send to endpoint.
                    // console.log(instances);
                    res.send(instances);
                });
            });
        });
};
