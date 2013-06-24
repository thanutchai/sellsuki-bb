
(function() {
	
	$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, "fast", easing, callback);
	};
	$("#contact").live('click', function() {
        
            $(".pop").slideFadeToggle(function() { });
    });

var orderstate= true;

window.App = {
	Models: {},
	Collections: {},
	Views: {}
};
	
window.template = function(id) {
	return _.template( $('#' + id).html() );
};

App.Models.Order = Backbone.Model.extend({
	defaults:{
		orderid:'001',
		orderstate:0
	}
});
App.Models.Product = Backbone.Model.extend({
	defaults: {
		name: 'ProductA',
		img: 'https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/1012188_144246855767777_53246278_n.jpg',
		price: 100
	}
});

App.Models.ProductCart = Backbone.Model.extend({
	defaults: {
		name: 'ProductA',
		img: 'https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/1012188_144246855767777_53246278_n.jpg',
		price: 100,
		quantity:1
	},
	validate: function(attrs) {
		console.log(attrs);
		if ( attrs.quantity < 0)  {
			return 'that is less than 0';
		}
	}
});

App.Collections.Products = Backbone.Collection.extend({
	model: App.Models.Product
});

App.Collections.ProductCarts = Backbone.Collection.extend({
	model: App.Models.ProductCart
});

App.Views.Orderdetail = Backbone.View.extend({
	el: '#orderdetail',

	events: {
		'dblclick #trans': 'editTran',
		'dblclick #dis': 'editDis',
		'click #orderstate': 'editStat',
		'click #link': 'sendLink',
		'click #newOrder': 'newOrder'

	},

	editDis: function(e)
	{
		if(orderstate)
		{
		var newTaskTitle = prompt('What would you like to change the text to?', $('#dis').html());

		if ( !newTaskTitle ) return;

		var total = parseInt($('#total').html());
		total  = total + parseInt($('#dis').html()) ;

		$('#dis').html(newTaskTitle);
		$('#total').html(total-parseInt(newTaskTitle));
		}
	},
	editTran:function(e)
	{
		if(orderstate)
		{
		var newTaskTitle = prompt('What would you like to change the text to?', $('#trans').html());

		if ( !newTaskTitle ) return;

		var total = parseInt($('#total').html());
		total  = total - parseInt($('#trans').html()) ;

		$('#trans').html(newTaskTitle);	

		
		$('#total').html(total+parseInt(newTaskTitle));		
		}
	},
	editStat: function()
	{
		console.log($('#orderstate').html());

		if(orderstate)
		{
			$('#orderstate').html("แก้ไขออเดอร์");
			$('#link').show();
			orderstate= false;
			orderModel.set('orderstate',1);
			console.log(orderModel.get('orderstate'));

		}
		else
		{
			$('#orderstate').html('ยืนยันออเดอร์');
			$('#link').hide();
			orderstate= true;
			orderModel.set('orderstate',2);
			console.log(orderModel.get('orderstate'));

		}
	},
	sendLink: function()
	{
		$('#orderstate').hide();
		$('#newOrder').show();

	},
	newOrder: function()
	{
		while(productcartsCollection.models.length > 0) 
		{
    		 productcartsCollection.models[0].destroy();
  		}

		$('#orderstate').show();
		$('#newOrder').hide();
		$('#orderstate').html('ยืนยันออเดอร์');

		$('#link').hide();
		orderstate= true;

		$('#trans').html('0');	
		$('#dis').html('0');
		$('#total').html('0');
	}


});
App.Views.Search = Backbone.View.extend({
	el: ".search",
	events: {     
        'keypress #searchP' : 'updateOnEnter'
      },
    updateOnEnter: function(e)
    {
    	 if(e.which == 13)
        {
        	var re = new RegExp($('#searchP'),"g");

			var found = allproductsCollection.filter(function(anyModel) 
			{
				// /var filter = new RegExp(baz + "d");
    			var startsWithA = new RegExp($('#searchP').val(),"g");
    			return startsWithA.test(anyModel.get('name'));
			});
			productsCollection.reset();
    		//console.log(found);
    		for(i=0;i<found.length;i++) {
				var task = new App.Models.Product({ name: found[i].get('name') ,img:found[i].get('img'), price: found[i].get('price') });
				productsCollection.add(task);
				
			}

    		//productsCollection = found;
    		//productsView.set({ collection: productsCollection });
    		console.log(productsCollection);

    		//productsView.setNew(productsCollection);
    		console.log(productsView.render().el);

    		allproductsCollection = allproductsCollection2;
    		console.log(allproductsCollection);
    		
    		

			

		}   
          
    }
});
App.Views.Products = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.$el.html("");
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(product) {
		console.log('each');
		var productView = new App.Views.Product({ model: product });

		this.$el.append(productView.render().el);
	}
});

App.Views.Product = Backbone.View.extend({
	tagName: 'li',

	template: template('productTemplate'),

	initialize: function() {
	},
	events: {
		
		'click button' : 'addToCart'
	},
	addToCart: function(){

		if(orderstate)
		{
		console.log(this.model.get('name'));

		var count = productcartsCollection.where({name: this.model.get('name')});

		console.log(count.length);
		$(".pop").slideFadeToggle(function() { });
		if(count.length>0)
		{
			console.log('if');
			var task = new App.Models.ProductCart();
			task = count[0];

			var q = task.get('quantity');
		
			task.set('quantity',q+1);
			productcartsView.render();

		}
		else
		{
			console.log('else');
			var task = new App.Models.ProductCart({ name: this.model.get('name') ,img:this.model.get('img'), price: this.model.get('price') });
			productcartsCollection.add(task);
		}
		}

	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});


App.Views.ProductCarts = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		console.log('init add');
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.$el.html("");
		$('#total').html("0");
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(task) {

		console.log('add to cart.');
		var productcartView = new App.Views.ProductCart({ model: task });

		this.$el.append(productcartView.render().el);
	}
});

App.Views.ProductCart = Backbone.View.extend({
	tagName: 'li',

	template: template('cartTemplate'),

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {

		'click .add1' : 'add',
		'click .minus1' : 'minus',
		

		'dblclick .pname' : 'editName',
		'dblclick .pprice' : 'editPrice'
	
	},
	editName: function() {

		if(orderstate)
		{
			var newTaskTitle = prompt('What would you like to change the text to?', this.model.get('name'));

			if ( !newTaskTitle ) return;
		

			var count = productsCollection.where({name: this.model.get('name')});
			var task = new App.Models.Product();
			task = count[0];

			task.set('name',newTaskTitle);
			productsView.render();

			this.model.set('name', newTaskTitle);
		}


	},
	editPrice: function() {
		if(orderstate)
		{
		var newTaskTitle = prompt('What would you like to change the text to?', this.model.get('price'));

		if ( !newTaskTitle ) return;
		this.model.set('price', newTaskTitle);
		}
	},
	deleteproduct:function(){
		if(orderstate)
		{

		var total = parseInt($('#total').html());
		total  = total - ( this.model.get('quantity') * this.model.get('price') );
		$('#total').html(total);

		this.model.destroy();
		}

	},
	remove: function() {
		this.$el.remove();
	},
	add:function(){
		if(orderstate)
		{
		console.log('add.');
		var q = this.model.get('quantity');

		var total = parseInt($('#total').html());
		total  = total - ( this.model.get('quantity') * this.model.get('price') );
		$('#total').html(total);

		this.model.set('quantity',q+1);
		//this.render();
		}
	},
	minus:function(){

		if(orderstate)
		{

		console.log('minus.');

		var q = this.model.get('quantity');

		var total = parseInt($('#total').html());
		total  = total -( this.model.get('quantity') * this.model.get('price') );
		$('#total').html(total);
		
		this.model.set('quantity',q-1);
		//this.render();
		}
		
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);


		var total = parseInt($('#total').html());

		console.log(total);
		console.log(( this.model.get('quantity') * this.model.get('price') ));
		total  = total + ( this.model.get('quantity') * this.model.get('price') );

		
		$('#total').html(total);

		return this;
	}
});

var productcartsCollection = new App.Collections.ProductCarts();
var allproductsCollection2 = new App.Collections.Products([
	{
		name: 'Case iPhone',
		price: 1400
	},
	{
		name: 'macbook',
		price: 30000
	},
	{
		name: 'iPad',
		price: 15000
	},
	{
		name: 'iPod',
		price: 15000
	},
	{
		name: 'nokia',
		price: 15000
	}
]);
var allproductsCollection = new App.Collections.Products([
	{
		name: 'Case iPhone',
		price: 1400
	},
	{
		name: 'macbook',
		price: 30000
	},
	{
		name: 'iPad',
		price: 15000
	},
	{
		name: 'iPod',
		price: 15000
	},
	{
		name: 'nokia',
		price: 15000
	}
]);

var orderModel = new App.Models.Order();
var productsCollection = allproductsCollection;
console.log(productsCollection);
var search = new App.Views.Search();
var orderdetail = new App.Views.Orderdetail();

var productsView = new App.Views.Products({ collection: productsCollection });
var productcartsView = new App.Views.ProductCarts({collection:productcartsCollection});
$('.products').html(productsView.render().el);
$('.productcarts').html(productcartsView.render().el);



})();