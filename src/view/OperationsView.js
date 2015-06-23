var OperationsView = Backbone.View.extend({
    className: 'OperationsView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.bindings();
        this.render();
    },

    bindings: function() {
        var self=this;
        this.model.change('dataReady', function(model, val) {
            self.render();
            var dataOperations = [];
            for (var i = 0; i < operationsCollection.length; i++) {
                dataOperations.push([operationsCollection.at(i).get('operation'), operationsCollection.at(i).get('percentage')]);
            }
            $(function() {
                $('#operationscontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                    },
                    title: {
                        text: 'Instance Operations Percentage'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>USD{point.y:.4f}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Operations',
                        data: dataOperations
                    }]
                });
            });
        });
    },

    render: function() {
        var html = Handlebars.templates.OperationsView({
            metrics: operationsCollection.toJSON()
        });
        this.$el.html(html);
    }
});