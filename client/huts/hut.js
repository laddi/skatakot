Template.hut.onCreated(function() {
	this.subscribe('Huts', this.data.hutId);
});

Template.hut.helpers({
	hut: () => Huts.findOne()
});
