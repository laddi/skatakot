Meteor.startup(function() {
	// code to run on server at startup
	Meteor.publish('Huts', function(id) {
		if (id) {
			return Huts.find({ _id: id });
		}
		return Huts.find();
	});

	Meteor.publish('Groups', function(id) {
		if (id) {
			return Groups.find({ _id: id });
		}
		return Groups.find();
	});
});
