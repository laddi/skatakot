Template.map.helpers({
	mapOptions: function() {
		// Make sure the maps API has loaded
		let position = mapData.position.get();
		if (GoogleMaps.loaded() && position) {
			// Map initialization options
			return {
				center: new google.maps.LatLng(position.latitude, position.longitude),
				zoom: mapData.zoom.get(),
				mapTypeId: mapData.type.get() || google.maps.MapTypeId.HYBRID
			};
		}
	},

	isReady: function() {
		return GoogleMaps.loaded();
	}
});

Template.map.onCreated(function() {
	this.position = new ReactiveVar(null);
	let markers = {};

	this.subscribe('huts');

	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('hutsMap', function(map) {
		if (!mapData.type.get()) {
			mapData.type.set(google.maps.MapTypeId.HYBRID);
		}

		// Add markers for all the huts
		Huts.find({}, { sort: { status: -1, name: 1 }}).observe({
			added: hut => {
				if (!markers[hut._id]) {
					let marker = createMarker(map, hut);

					google.maps.event.addListener(marker, 'click', function() {
						Router.go('hut', { hutId: hut._id });
					});

					markers[hut._id] = marker;
				}
			},

			changed: (hut, oldHut) => {
				if (hut.latitude !== oldHut.latitude || hut.longitude !== oldHut.longitude) {
					markers[hut._id].setPosition(new google.maps.LatLng(hut.latitude, hut.longitude));
				}
				if (hut.name !== oldHut.name) {
					markers[hut._id].setTitle(hut.name);
				}
				if (hut.status !== oldHut.status) {
					markers[hut._id].setIcon(getIconImage(hut.status));
				}
			},

			removed: hut => {
				// Remove the marker from the map
				markers[hut._id].setMap(null);

				// Clear the event listener
				google.maps.event.clearInstanceListeners(markers[hut._id]);

				// Remove the reference to this marker instance
				delete markers[hut._id];
			}
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
