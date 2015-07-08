// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var InstancesView = Backbone.View.extend({
    className: 'InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.billingActivity = new BillingView();
        this.nonFreeBillingActivity = new NonFreeBillingView();
        // this.operationsActivity = new OperationsView();
        this.metricsActivity = new MetricsView();
        this.bindings();
    },

    updateViews: function(selected, vselected) {
            this.billingActivity.model.getCombindedCost(selected, vselected);
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getEC2Metrics(selected);

            // this.operationsActivity.model.getEC2Operations(selected);
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            $('#InstanceTable').DataTable({
                "iDisplayLength": 25,
                "paging":   false,
                "info":     false,
                "bFilter": false
            });
        }.bind(this));

        this.$el.on("change", '.instanceDropDown', function(e) {
            var selected = $('.instanceDropDown').val();
            console.log(selected);
            totalCostInstancesCollection.reset();
            this.billingActivity.model.getBilling(selected); 
            this.billingActivity.model.getCombindedCost(selected);
            this.metricsActivity.model.getEC2Metrics(selected);
            // this.operationsActivity.model.getEC2Operations(selected);
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: ec2InstanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.nonFreeBillingActivity.el);
        this.$el.append(this.billingActivity.el);
        // this.$el.append(this.operationsActivity.el);
        this.$el.append(this.metricsActivity.el);      
    }
});