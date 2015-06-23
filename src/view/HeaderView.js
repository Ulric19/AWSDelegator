var HeaderView = Backbone.View.extend({

    className: 'HeaderView',

    initialize: function(options) {
        this.bindings();
        this.render();

    },

    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.HeaderView;
        this.$el.html(html);

       
    }
});