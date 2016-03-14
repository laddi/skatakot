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
	Meteor.publishTransformed('huts', function(id) {
		if (id) {
			let hut = Huts.findOne(id);
			let array = [
				Huts.find({ _id: id })
			];

			if (hut.owner) {
				array.push(Groups.find({
					$query: { _id: hut.owner },
				}));
			}

			if (hut.images) {
				array.push(Images.find({
					$query: { _id: { $in: Huts.findOne(id).images } },
					$orderby: { uploadedAt: -1 }
				}));
			}

			return array;
		}

		return Huts.find().serverTransform(function(doc) {
			doc.cleanName = convertString(doc.name).toLowerCase();

			return doc;
		});
	});

	Meteor.publish('groups', function() {
		return Groups.find();
	});
});
