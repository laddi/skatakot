Router.map(function() {
	this.route('map', {
		path: '/',
		layoutTemplate: 'layout',
		template: 'map',
		title: 'Map',
		waitOn: function() {
			return Meteor.subscribe('huts');
		}
	});

	this.route('huts', {
		path: '/huts',
		layoutTemplate: 'layout',
		template: 'huts',
		title: 'Huts',
		waitOn: function() {
			return Meteor.subscribe('huts');
		}
	});

	this.route('hut', {
		path: '/huts/:hutId',
		layoutTemplate: 'layout',
		template: 'hut',
		title: 'Hut',
		waitOn: function() {
			// returning a subscription handle or an array of subscription handles
			// adds them to the wait list.
			return Meteor.subscribe('huts', this.params.hutId);
		},
		data: function() {
			return {
				hutId: this.params.hutId
			};
		}
	});

	this.route('image', {
		path: 'huts/:hutId/:imageId',
		layoutTemplate: 'layout',
		template: 'image',
		title: 'Image',
		waitOn: function() {
			// returning a subscription handle or an array of subscription handles
			// adds them to the wait list.
			return Meteor.subscribe('huts', this.params.hutId);
		},
		data: function() {
			return {
				hutId: this.params.hutId,
				imageId: this.params.imageId
			};
		}
	});
});
