mapData = {
	position: new ReactiveVar(null),
	zoom: new ReactiveVar(10),
	type: new ReactiveVar(null)
};

// Getting initial position
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		mapData.position.set({ latitude: position.coords.latitude, longitude: position.coords.longitude });
	}, () => {
		mapData.position.set({ latitude: '64.997277', longitude: '-18.606130' });
		mapData.zoom.set(7);
	});
} else {
	mapData.position.set({ latitude: '64.997277', longitude: '-18.606130' });
	mapData.zoom.set(7);
}

Meteor.startup(function() {
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
			placeholder: 'Jón Jónsson',				 // A placeholder for the field
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
