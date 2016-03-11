Schemas = {};

var createThumb = function(fileObj, readStream, writeStream) {
	// Transform the image into a 100x100px thumbnail
	gm(readStream, fileObj
		.name())
		.resize('175', '175', '^')
		.gravity('Center')
		.crop('175', '175')
		.quality('92')
		.stream()
		.pipe(writeStream);
};

Images = new FS.Collection('images', {
	stores: [
		new FS.Store.GridFS('images', {}),
		new FS.Store.GridFS('thumbs', { transformWrite: createThumb })
	],
	filter: {
		maxSize: 1048576, // in bytes
		allow: {
			contentTypes: ['image/*'] // allow only images in this FS.Collection
		}
	}
});

Schemas.Groups = new SimpleSchema({
	name: {
		type: String,
		max: 128
	},
	shortName: {
		type: String,
		max: 128
	},
	status: {
		type: String,
		allowedValues: [ 'active', 'inactive' ],
		autoform: {
			options: [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' }
			]
		}
	},
	createdAt: {
		type: Date,
		label: 'Date',
		autoValue: function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	}
});

Groups = new Meteor.Collection('groups');
Groups.attachSchema(Schemas.Groups);

Schemas.Huts = new SimpleSchema({
	name: {
		type: String,
		max: 128
	},
	description: {
		type: String,
		autoform: {
			rows: 5
		},
		optional: true
	},
	latitude: {
		type: String
	},
	longitude: {
		type: String
	},
	status: {
		type: String,
		allowedValues: [ 'status-in-use', 'status-needs-repair', 'status-privately-owned', 'status-destroyed', 'status-burnt', 'status-rebuilt' ],
		autoform: {
			options: [
				{ label: 'In use', value: 'status-in-use' },
				{ label: 'Needs repair', value: 'status-needs-repair' },
				{ label: 'Privately owned', value: 'status-privately-owned' },
				{ label: 'Destroyed', value: 'status-destroyed' },
				{ label: 'Burnt', value: 'status-burnt' },
				{ label: 'Rebuilt', value: 'status-rebuilt' }
			]
		}
	},
	currentLocation: {
		type: String,
		optional: true
	},
	sleeps: {
		type: Number,
		optional: true
	},
	size: {
		type: Number,
		optional: true
	},
	year: {
		type: Number,
		optional: true
	},
	electricity: {
		type: Boolean,
		optional: true
	},
	runningWater: {
		type: Boolean,
		optional: true
	},
	owner: {
		type: String,
		optional: true,
		autoform: {
			options: function() {
				return _.map(Groups.find().fetch(), function(group) {
					return {
						label: group.name,
						value: group._id
					};
				});
			}
		}
	},
	images: {
		type: [String],
		optional: true
	},
	'images.$': {
		autoform: {
			afFieldInput: {
				type: 'fileUpload',
				collection: 'images'
			}
		}
	},
	createdAt: {
		type: Date,
		label: 'Date',
		autoValue: function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	}
});

Huts = new Meteor.Collection('huts');
Huts.attachSchema(Schemas.Huts);

Huts.helpers({
	group() {
		return Groups.findOne(this.owner);
	}
});

AdminConfig = {
	adminEmails: [ 'laddih@gmail.com' ],
	collections: {
		Huts: {
			omitFields: ['createdAt'],
			tableColumns: [
				{ label: 'Name', name: 'name' },
				{ label: 'Status', name: 'status' },
				{ label: 'Sleeps', name: 'sleeps' },
				{ label: 'Size', name: 'size' }
			],
			routes: {
				new: {
					waitOn: function() { return Meteor.subscribe('groups'); }
				},
				view: {
					waitOn: function() { return Meteor.subscribe('groups'); }
				},
				edit: {
					waitOn: function() { return Meteor.subscribe('groups'); }
				}
			}
		},

		Groups: {
			omitFields: ['createdAt'],
			tableColumns: [
				{ label: 'Name', name: 'name' },
				{ label: 'Short name', name: 'shortName' },
				{ label: 'Status', name: 'status' }
			]
		}
	}
};
