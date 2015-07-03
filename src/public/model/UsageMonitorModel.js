var UsageMonitorModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('dataReady');
	},
	groups_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/usage/groups',
			success: function(data) {
				result = data;
			}
		});
	},
	users_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/usage/users',
			success: function(data) {
				result = data;
			}
		});
	},

	getGroups: function() {
		var self = this;
		GroupCollection.reset();
		this.groups_result().done(function(result) {
			for (var r in result) {
				var data = new ec2InstanceModel({
					groupName: result[r].GroupName,
					groupId: result[r].GroupId,
					arn: result[r].Arn,
					createDate: result[r].CreateDate,
					amount: result[r].Amount
				});
				GroupCollection.add(data);
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getUsers: function() {
		var self = this;
		UserCollection.reset();
		this.users_result().done(function(result) {
			for (var r in result) {
				var data = new ec2InstanceModel({
					userName: result[r].UserName,
					userId: result[r].UserId,
					arn: result[r].Arn,
					createDate: result[r].CreateDate,
					amount: result[r].Amount
				});
				UserCollection.add(data);
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	}
});

var iamGroupsModel = Backbone.Model.extend({
	defaults: {
		GroupName: null,
		GroupId: null,
		Arn: null,
		CreateDate: null,
		Amount: 0
	}
});

var GroupsCollection = Backbone.Collection.extend({
	model: iamGroupsModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var iamUsersModel = Backbone.Model.extend({
	defaults: {
		UserName: null,
		UserId: null,
		Arn: null,
		CreateDate: null,
		Amount: 0
	}
});

var UsersCollection = Backbone.Collection.extend({
	model: iamUsersModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var GroupCollection = new GroupsCollection();
var UserCollection = new UsersCollection();