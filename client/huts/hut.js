Template.hut.onCreated(function() {
	this.subscribe('huts', this.data.hutId);
});

Template.hut.helpers({
	hut: () => Huts.findOne(),
	images: () => Images.find(),
	addBreaks(text) {
		return text.replace(/(\r\n|\n|\r)/gm, '<br />');
	}
});
