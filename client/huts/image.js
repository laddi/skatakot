Template.image.onCreated(function() {
	this.subscribe('huts', this.data.hutId);
});

Template.image.helpers({
	hut: () => Huts.findOne(Template.instance().data.hutId),
	image: () => Images.findOne(Template.instance().data.imageId),
});
