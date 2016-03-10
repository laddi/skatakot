Template.hut.onCreated(function() {
	this.subscribe('huts', this.data.hutId);

	GoogleMaps.load();

	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('hutMap', function(map) {
		var image = {
			size: new google.maps.Size(40, 40),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(20, 40),
			scaledSize: new google.maps.Size(40, 40)
		};

		// Add markers for all the huts
		let hut = Huts.findOne();
		var url = '/in-use.svg';
		if (hut.status === 'status-needs-repair') {
			url = '/needs-repair.svg';
		} else if (hut.status === 'status-destroyed') {
			url = '/destroyed.svg';
		}

		new google.maps.Marker({
			position: new google.maps.LatLng(hut.latitude, hut.longitude),
			animation: google.maps.Animation.DROP,
			map: map.instance,
			title: hut.name,
			icon: _.extend(image, { url })
		});
	});
});

Template.hut.helpers({
	hut: () => Huts.findOne(),
	images: () => Images.find(),
	addBreaks(text) {
		return text.replace(/(\r\n|\n|\r)/gm, '<br />');
	},
	mapOptions: function() {
		let hut = Huts.findOne();
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
