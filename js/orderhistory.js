(function() {


window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};


App.Models.Orderitem = Backbone.Model.extend({
	defaults: {
		oid:'1',
		date:'1',
		address:'1',
		product:'1',
		quantity:'1',
		price:'1',
		dis:'1',
		tran:'1',
		amount:'1',
		state:'1'
	}
});

App.Collections.Orderitems = Backbone.Collection.extend({model: App.Models.Orderitem});

App.Views.Orderitem = Backbone.View.extend({
	tagName: 'tr',

	template: template('orderTemplate'),
	initialize: function() {
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});
App.Views.Orderitems = Backbone.View.extend({
	el: '#orderhistory',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		//this.$el.html("");
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(orderitem) {
		console.log('each');
		var orderitemView = new App.Views.Orderitem({ model: orderitem });

		this.$el.append(orderitemView.render().el);
	}

});


var ordersCollection = new App.Collections.Orderitems([
	
	{
		oid: 'a'
	},
	{
		oid: 'b'
	}

]);

var ordersView = new App.Views.Orderitems({collection:ordersCollection});

ordersView.render();


})();