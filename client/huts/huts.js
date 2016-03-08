Template.huts.onCreated(function() {
	this.subscribe('huts');
});

Template.huts.helpers({
	huts: () => Huts.find({}, { sort: { name: 1 } })
});
