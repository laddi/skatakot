Schemas = {};

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

AdminConfig = {
	adminEmails: [ 'laddih@gmail.com' ],
	collections: {
		Huts: {
			omitFields: ['createdAt'],
			tableColumns: [
				{ label: 'Name', name: 'name' },
				{ label: 'Description', name: 'description' },
				{ label: 'Latitude', name: 'latitude' },
				{ label: 'Longitude', name: 'longitude' }
			]
		}
	}
};
