Template.image.onCreated(function() {
	this.subscribe('huts', this.data.hutId);
});

Template.image.helpers({
	hut: () => Huts.findOne(Template.instance().data.hutId),
	image: () => Images.findOne(Template.instance().data.imageId),
	images: () => Images.find({}, { sort: { uploadedAt: 1 } }),
	isAdmin: () => Roles.userIsInRole(Meteor.userId(), 'admin'),
	caption: function(image) {
		if (image.metadata.caption) {
			let caption = image.metadata.caption;

			if (image.metadata.takenBy || image.metadata.yearTaken) {
				caption += ' [<em>';
				if (image.metadata.takenBy) {
					caption += image.metadata.takenBy;
					if (image.metadata.yearTaken) {
						caption += ', ' + image.metadata.yearTaken;
					}
				} else {
					caption += image.metadata.yearTaken;
				}
				caption += '</em>]';
			}

			return new Spacebars.SafeString(caption);
		}

		return null;
	}
});

Template.image.events({
	'click .saveChanges': function() {
		Images.update(Template.instance().data.imageId, { $set: $('#imageForm').serializeJSON() });
	}
});
