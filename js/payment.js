(function() {

window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};

App.Models.ProductCart = Backbone.Model.extend({
	defaults: {
		name: 'ProductA',
		img: 'https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/1012188_144246855767777_53246278_n.jpg',
		price: 100,
		quantity:1
	}
});

App.Models.Bank = Backbone.Model.extend({
	defaults: {
		id: 0,
		img: 'https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/1012188_144246855767777_53246278_n.jpg',
		desc:'ไทยพานิยช์ ที่อยู่ 123 ถนน 123456 ฯลฯ'
	}
});

App.Collections.ProductCarts = Backbone.Collection.extend({
	model: App.Models.ProductCart
});

App.Collections.Banks = Backbone.Collection.extend({
	model: App.Models.Bank
});


App.Views.PaymentDetail = Backbone.View.extend({
	el: '#paymentDetail',
	initialize: function() {
		console.log('x');
		
	},
	events: {
		'click .del' : 'deleteproduct'
	},
	deleteproduct: function() {
		console.log( $('#acc_id').val()+' '+$('#s_date').val() );
		
	}
});
App.Views.ProductCarts = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		console.log('a');
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(task) {
		var taskView = new App.Views.Task({ model: task });

		var total = parseInt($('#total').html());
		
		$('#total').html(total+(task.get('price')*task.get('quantity')));

		this.$el.append(taskView.render().el);
	}
});
App.Views.Banks = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		console.log('c');
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(task) {
		var taskView = new App.Views.Bank({ model: task });

		this.$el.append(taskView.render().el);
	}
});

App.Views.Task = Backbone.View.extend({
	tagName: 'li',

	template: template('paymentcartTemplate'),

	initialize: function() {
		
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});
App.Views.Bank = Backbone.View.extend({
	tagName: 'li',

	template: template('bankTemplate'),

	initialize: function() {
		
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});

var productCartsCollection = new App.Collections.ProductCarts([
	{
		name: 'Case iPhone',
		price: 1400
	},
	{
		name: 'macbook',
		price: 30000
	}
]);

var bankCollection = new App.Collections.Banks([
	{
		id:1
	},
	{
		id:2
	}
]);

// Homework #4
// It's too bad that we have to inject the collection into the AddTask type.
// Can you find a way to remove this need?

var paymentView = new App.Views.PaymentDetail();

var tasksView = new App.Views.ProductCarts({ collection: productCartsCollection });
$('.paymentcarts').html(tasksView.render().el);

var banksView = new App.Views.Banks({ collection: bankCollection });
$('.banklist').html(banksView.render().el);


})();

$(function(){  
    // แทรกโค้ต jquery  
    $("#s_date").datepicker();  
}); 