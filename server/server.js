Images.allow({
	insert: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	update: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	remove: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	}
});

Groups.allow({
	insert: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	update: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	remove: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	}
});

Huts.allow({
	insert: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	update: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	},
	remove: function(userId) {
		return userId && Roles.userIsInRole(userId, 'admin');
	}
});

Meteor.startup(function() {
	// code to run on server at startup
	Meteor.publish('huts', function(id) {
		if (id) {
			return [
				Huts.find({ _id: id }),
				Groups.find({
					$query: { _id: Huts.findOne(id).owner },
				}),
				Images.find({
					$query: { _id: { $in: Huts.findOne(id).images } },
					$orderby: { uploadedAt: -1 }
				})
			];
		}
		return Huts.find();
	});

	Meteor.publish('groups', function(id) {
		if (id) {
			return Groups.find({ _id: id });
		}
		return Groups.find();
	});
});
