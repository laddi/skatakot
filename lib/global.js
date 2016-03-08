Schemas = {};

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
		allowedValues: [ 'status-in-use', 'status-needs-repair', 'status-destroyed' ],
		autoform: {
			options: [
				{ label: 'In use', value: 'status-in-use' },
				{ label: 'Needs repair', value: 'status-needs-repair' },
				{ label: 'Destroyed', value: 'status-destroyed' }
			]
		}
	},
	sleeps: {
		type: Number,
		optional: true
	},
	size: {
		type: Number,
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
			]
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
