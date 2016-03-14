Template.layout.events({
	'click .nav a': function() {
		$('.navbar-toggle').click();
	}
});

mapData = {
	position: new ReactiveVar(null),
	zoom: new ReactiveVar(10),
	type: new ReactiveVar(null)
};

Blaze.registerHelper('or', function(p, q) {
	return p || q;
});

Blaze.registerHelper('convertToDegrees', function(latitude, longitude) {
	// got dashes?
	var latitudeHemisphere = 'N';
	if (latitude.substr(0, 1) === '-') {
		latitudeHemisphere = 'S';
		latitude = latitude.substr(1, latitude.length - 1);
	}

	var longitudeDirection = 'E';
	if (longitude.substr(0, 1) === '-') {
		longitudeDirection = 'W';
		longitude = longitude.substr(1, longitude.length - 1);
	}

	// degrees = degrees
	latitutes = latitude.split('.');
	longitudes = longitude.split('.');

	// * 60 = mins
	latitudeMinutes = (('0.' + latitutes[1]) * 60).toFixed(3);
	longitudeMinutes = (('0.' + longitudes[1]) * 60).toFixed(3);

	return `${latitutes[0]}°${latitudeMinutes}′${latitudeHemisphere} ${longitudes[0]}°${longitudeMinutes}′${longitudeDirection}`;
});

createMarker = function(map, hut) {
	let marker = new google.maps.Marker({
		position: new google.maps.LatLng(hut.latitude, hut.longitude),
		animation: google.maps.Animation.DROP,
		map: map.instance,
		title: hut.name,
		icon: getIconImage(hut.status),
		// optimized: false,
		zIndex: hut.status === 'status-in-use' ? 1000 : 999
	});

	return marker;
};

getIconUrl = function(status) {
	var url = '/in-use.svg';
	if (status === 'status-needs-repair' || status === 'status-privately-owned') {
		url = '/needs-repair.svg';
	} else if (status === 'status-destroyed' || status === 'status-burnt') {
		url = '/destroyed.svg';
	} else if (status === 'status-rebuilt') {
		url = '/rebuilt.svg';
	}

	return url;
};

getIconImage = function(status) {
	let image = {
		size: new google.maps.Size(512, 512),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(20, 40),
		scaledSize: new google.maps.Size(40, 40),
		url: getIconUrl(status)
	};

	return image;
};

// Getting initial position
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		mapData.position.set({ latitude: position.coords.latitude, longitude: position.coords.longitude });
	}, () => {
		mapData.position.set(Meteor.settings.public.map.position);
		mapData.zoom.set(Meteor.settings.public.map.zoom);
	});
} else {
	mapData.position.set(Meteor.settings.public.map.position);
	mapData.zoom.set(Meteor.settings.public.map.zoom);
}

Meteor.startup(function() {
	GoogleMaps.load();
	i18n.showMissing(true);
	i18n.setDefaultLanguage('is_IS');

	document.title = i18n('title');

	AccountsEntry.config({
		homeRoute: '/',				   // mandatory - path to redirect to after sign-out
		dashboardRoute: '/admin',		 // mandatory - path to redirect to after successful sign-in
		showOtherLoginServices: true,	 // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using something like accounts-meld or want to oauth for api access
		extraSignUpFields: [{			 // Add extra signup fields on the signup page
			field: 'name',						   // The database property you want to store the data in
			label: 'Full Name',					  // The html lable for the field
			placeholder: 'John Doe',				 // A placeholder for the field
			type: 'text',							// The type of field you want
			required: true						   // Adds html 5 required property if true
		}],
		fluidLayout: false,			  // Set to true to use bootstrap3 container-fluid and row-fluid classes.
		useContainer: true,			  // Set to false to use an unstyled 'accounts-entry-container' class instead of a bootstrap3 'container' or 'container-fluid' class.
		signInAfterRegistration: true,   // Set to false to avoid prevent users being automatically signed up upon sign-up e.g. to wait until their email has been verified.
		emailVerificationPendingRoute: '/verification-pending',// The route to which users should be directed after sign-up. Only relevant if signInAfterRegistration is false.
		showSpinner: true,			   // Show the spinner when the client is talking to the server (spin.js)
		spinnerOptions: { color: '#000', top: '80%' } // options as per [spin.js](http://fgnass.github.io/spin.js/)
	});
});

$.fn.serializeJSON = function() {
	// Use with forms of 'application/json' encoding.
	// http://www.w3.org/TR/html-json-forms/
	var arr = this.serializeArray();

	var retObj = {};
	$.each(arr, function() {
		mergeObjFields(retObj, this.value, this.name, []);
	});
	return retObj;
};

function mergeObjFields(obj, value, field, keys) {
	// Merge together fields of nested JSON keys. For example with the
	// object `{foo: {bar: 0}}`, the value `1`, and the field
	// `'foo[baz]'` the object will become `{foo: {bar: 0, baz: 1}}`.
	//
	// Note: This method takes only a single name-value pair. And
	// recursively breaks the name down into nested fields. It is
	// designed to be called iteratively over all key-value pairs of a
	// "flat" object.
	//
	// Note: This method mutates the object rather then return a new
	// one.
	//
	// Reference: http://www.w3.org/TR/html-json-forms/

	var match = field.match(/\[([_A-Za-z]+[_\-\w\d]*|\d+|)\]\s*$/);
	// Use this to traverse the tree by reference.
	var node = obj;

	if (!match) {
		keys.push(field);
		// Traverse to the desired leaf.
		$.each(keys.reverse(), function(i) {
			var attr = this.length === 0 ? node.length : this;
			if (i + 1 === keys.length) {
				// We are at the leaf.
				if (typeof node[attr] !== 'undefined') {
					// Node exits, hence it's an array. Turn it into
					// one if it isn't already.
					if (!Array.isArray(node[attr])) {
						let temp = node[attr];
						node[attr] = [temp];
					}
					node[attr].push(value);
				} else {
					node[attr] = value;
				}
			} else {
				if (typeof node[attr] === 'undefined') {
					node[attr] =
						// Is the next branch an object or an array?
						(typeof keys[i + 1] === 'number' || keys[i + 1] === '') ? [] : {};
				}
				// Move one more branch down the tree.
				node = node[attr];
			}
		});

		return;
	}

	var name = match[1];
	var n = parseInt(name, 10);
	keys.push(isNaN(n) ? name : n);

	mergeObjFields(obj, value, field.slice(0, -match[0].length), keys);
}
