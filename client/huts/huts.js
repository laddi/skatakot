Template.huts.onCreated(function() {
	this.subscribe('huts');
	this.subscribe('groups');
});

Template.huts.helpers({
	huts: () => Huts.find({}, { sort: { name: 1 } })
});
