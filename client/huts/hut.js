Template.hut.onCreated(function() {
	let markers = {};
	this.subscribe('huts', this.data.hutId);

	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('hutMap', map => {
		Huts.find({ _id: this.data.hutId }).observe({
			added: hut => {
				let marker = createMarker(map, hut);
				markers[hut._id] = marker;
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
			}
		});
	});
});

Template.hut.helpers({
	hut: () => Huts.findOne(Template.instance().data.hutId),
	images: () => Images.find(),
	addBreaks(text) {
		return text && text.replace(/(\r\n|\n|\r)/gm, '<br />');
	},
	mapOptions: function() {
		let hut = Huts.findOne(Template.instance().data.hutId);
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded() && hut) {
			// Map initialization options
			return {
				center: new google.maps.LatLng(hut.latitude, hut.longitude),
				zoom: 14,
				scaleControl: false,
				mapTypeId: google.maps.MapTypeId.HYBRID
			};
		}
	},
	isReady: function() {
		return GoogleMaps.loaded();
	}
});
