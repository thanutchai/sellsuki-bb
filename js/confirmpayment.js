(function() {

window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};

App.Models.Payment = Backbone.Model.extend({
	defaults: {
		date:'1-11-1111',
		time:'23:59',
		bank:'j-bank bangsue',
		amount:'9999',
		address:'1522 pracharajuthit banksue bangkok 18000'
	}
});

App.Collections.Payments = Backbone.Collection.extend({model: App.Models.Payment})

App.Views.ConfirmDetail = Backbone.View.extend({
	el: '.confirmDetail',
	events: {
		'click #unconfirm' : 'Sendlink',
		'click #confirm' : 'Confirm',
		'click #ems':'AddEmsTrack'
	},
	Sendlink:function()
	{
		if($("#orderState").html()=="รอการตรวจสอบ")
			alert('link for customer');
	},
	Confirm: function()
	{
		$("#orderState").html("ชำระเงินแล้ว");

		$("#confirm").hide();

	},
	AddEmsTrack: function()
	{
		if($("#orderState").html()=="ชำระเงินแล้ว")
		{
			var newTaskTitle = prompt('กรอกเลข EMS (หากจัดส่งด้วย ems)');

			if ( newTaskTitle=="" )
				newTaskTitle = "-"; 

			
			$("#orderState").html("จัดส่งแล้ว");

			var d = new Date();

			var month = d.getMonth()+1;
			var day = d.getDate();

			var output = d.getFullYear() + '/' +
    			(month<10 ? '0' : '') + month + '/' +
    			(day<10 ? '0' : '') + day;

    		$("#emstrack").html(newTaskTitle+' '+output);
		}

	}

});

App.Views.Payments = Backbone.View.extend({

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
		var taskView = new App.Views.Payment({ model: task });

		if($('#address').html()=='')
		{	$('#address').html(task.get('address'));	 }

		this.$el.append(taskView.render().el);
	}
});

App.Views.Payment = Backbone.View.extend({
	tagName: 'li',

	template: template('paymentTemplate'),

	initialize: function() {
		
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);


		return this;
	}
});



var paymentsCollection = new App.Collections.Payments([
	{
		date: '10-10-2013',
		
	},
	{
		date: '11-10-2013',
		
	}
]);

var confirmdetail = new  App.Views.ConfirmDetail();
var paymentsView = new App.Views.Payments({ collection: paymentsCollection });
$('.paymentlist').html(paymentsView.render().el);

})();