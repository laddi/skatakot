Template.map.helpers({
	mapOptions: function() {
		// Make sure the maps API has loaded
		let position = mapData.position.get();
		if (GoogleMaps.loaded() && position) {
			// Map initialization options
			return {
				center: new google.maps.LatLng(position.latitude, position.longitude),
				zoom: mapData.zoom.get(),
				scaleControl: true,
				mapTypeId: mapData.type.get() || google.maps.MapTypeId.TERRAIN
			};
		}
	},

	isReady: function() {
		return GoogleMaps.loaded();
	}
});

Template.map.onCreated(function() {
	this.position = new ReactiveVar(null);
	this.subscribe('huts');

	// Load google maps
	GoogleMaps.load();

	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('hutMap', function(map) {
		if (!mapData.type.get()) {
			mapData.type.set(google.maps.MapTypeId.TERRAIN);
		}

		// Add markers for all the huts
		let huts = Huts.find().fetch();
		_.each(huts, function(hut) {
			let marker = new google.maps.Marker({
				position: new google.maps.LatLng(hut.latitude, hut.longitude),
				animation: google.maps.Animation.DROP,
				map: map.instance,
				title: hut.name
			});

			google.maps.event.addListener(marker, 'click', function() {
				Router.go('hut', { hutId: hut._id });
			});
		});

		// Handling changes to map to retain state
		google.maps.event.addListener(map.instance, 'dragend', function() {
			mapData.position.set({ latitude: this.center.lat(), longitude: this.center.lng() });
		});
		google.maps.event.addListener(map.instance, 'zoom_changed', function() {
			mapData.zoom.set(this.zoom);
		});
		google.maps.event.addListener(map.instance, 'dblclick', function() {
			mapData.position.set({ latitude: this.center.lat(), longitude: this.center.lng() });
			mapData.zoom.set(this.zoom);
		});
		google.maps.event.addListener(map.instance, 'maptypeid_changed', function() {
			mapData.type.set(this.mapTypeId);
		});
	});
});
