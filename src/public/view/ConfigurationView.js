/*Logic for Settings Modal*/

var ConfigurationView = Backbone.View.extend({
    className: 'ConfigurationView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new ConfigurationModel();
        }
        this.data = {
            credits: null,
            expiration: null,
            creditsUsed: null
        };
        this.isValid = {
            credits: null,
            expiration: null,
            creditsUsed: null
        };
        this.bindings();
        this.render();
        this.$('#CreditExpWarning').hide();
        this.$('#CreditExpRequest').hide();
        this.$('#CreditsUsedRequest').hide();
        this.$('#CreditsUsedWarning').hide();
        this.$('#CreditsWarning').hide();
        this.$('#CreditsRequest').hide();
    },

    bindings: function() {
        var self = this;
        this.model.change('openConfig', function(model, val) {
            this.render();
        }.bind(this));

        this.$el.on('click', '#saveConfig', function(e) {
            if (this.data.expiration == null) {
                $('#CreditExpRequest').show();
            }
            if (this.data.creditsUsed == null) {
                $('#CreditsUsedRequest').show();
            }
            if (this.data.credits == null) {
                $('#CreditsRequest').show();
            }
            if(this.data.creditsUsed != null && this.data.creditsUsed != null &&  this.data.expiration != null){
                this.model.setExpiration(this.data.expiration);
                this.model.setCreditsUsed(this.data.creditsUsed);
                this.model.setBalance(this.data.credits);
            }
        }.bind(this));

        this.$el.on('focusin', '#expDate', function(e) {
            $("#expDate").datepicker({
                onSelect: function(selected) {
                    ndtFormatted = new Date();
                    $('#expDate').datepicker("option", "minDate", ndtFormatted);
                },
                onClose: function(selected) {
                    console.log("date", selected);
                    $('#CreditExpRequest').hide();
                    $('#CreditExpWarning').hide();
                    self.data.expiration = selected;
                    self.isValid.expiration = true;
                }
            });

        }.bind(this));

        this.$el.on('focusout', '#CreditsField', function(e) {
            if (/^\d+(\.\d{1,2})?$/.test($('#CreditsField').val()) && ($('#CreditsField').val() > +0)) {
                this.data.credits = $('#CreditsField').val();
                $('#CreditsWarning').hide();
                $('#CreditsRequest').hide();
                self.isValid.credits = true;
            } else {
                $('#CreditsWarning').show();
                $('#CreditsRequest').hide();
            }
        }.bind(this));


        this.$el.on('focusout', '#CreditsUsedField', function(e) {
            if (/^\d+(\.\d{1,2})?$/.test($('#CreditsUsedField').val()) && ($('#CreditsUsedField').val() >= 0)) {
                self.data.creditsUsed = $('#CreditsUsedField').val();
                $('#CreditsUsedWarning').hide();
                $('#CreditsUsedRequest').hide();
                this.isValid.creditsUsed = true;
            } else {
                $('#CreditsUsedWarning').show();
                $('#CreditsUsedRequest').hide();
            }
        }.bind(this));

        this.$el.on('click', '#closebtn', function(e) {
            self.$('#CreditExpWarning').hide();
            self.$('#CreditExpRequest').hide();
            self.$('#CreditsUsedRequest').hide();
            self.$('#CreditsUsedWarning').hide();
            self.$('#CreditsWarning').hide();
            self.$('#CreditsRequest').hide();
            this.data.used = null;
            $('#CreditsUsedField').prop('value', '');
            this.data.credits = null;
            $('#CreditsField').prop('value', '');
            this.data.expiration = null;
            $('#expDate').prop('value', '');

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.ConfigurationView({
            pages: ConfigurationCollection.toJSON(),
            aws: JSON.stringify(ConfigurationCollection.pluck('aws'))

        });
        this.$el.html(html);


    }
});