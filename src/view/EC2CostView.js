var EC2CostView = Backbone.View.extend({
    className: 'EC2CostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new CostModel();
        }
        this.model.getEC2Cost();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var date = new Date(hourlyCostCollection.at(0).get('date'));
            $(function() {
                $('#ec2CostContainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Amazon Elastic Compute Cloud Cost Per Hour'
                    },
                    xAxis: {
                        title: {
                            text: "Time"
                        },
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Price (USD)'
                        },
                        min: 0,
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null,
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                new Date(this.x) + ', ' + this.y.toFixed(4) + ' $/Hour';
                        },
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date.getYear(), date.getMonth(), date.getDate()),
                        data: hourlyCostCollection.pluck('cost')

                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType: 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.EC2CostView({
            product: hourlyCostCollection.toJSON(),
        });
        this.$el.html(html);
    }


});