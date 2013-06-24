(function() {


window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};


App.Models.Chatitem = Backbone.Model.extend({
	defaults: {
		img:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/275677_1180593467_323447311_q.jpg',
		chattime:'23:59',
		chattext:'fakkkkkkkkkkkkkkkk'
	}
});

App.Models.Chatlist = Backbone.Model.extend({
	defaults: {
		img:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/275677_1180593467_323447311_q.jpg',
		cusname:'username',
		orderstate:0
	}
});

App.Collections.Chatlists = Backbone.Collection.extend({model: App.Models.Chatlist});
App.Collections.Chatitems = Backbone.Collection.extend({model: App.Models.Chatitem});

App.Views.Chatlist = Backbone.View.extend({
	tagName: 'li',

	template: template('chatlistTemplate'),
	initialize: function() {
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});
App.Views.Chatlists = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.$el.html("");
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(chatlist) {
		console.log('each');
		var chatlistView = new App.Views.Chatlist({ model: chatlist });

		this.$el.append(chatlistView.render().el);
	}

});
App.Views.Chatitem = Backbone.View.extend({
	tagName: 'li',

	template: template('chatitemTemplate'),
	initialize: function() {
	},
	render: function() {
		var template = this.template( this.model.toJSON() );

		this.$el.html(template);

		return this;
	}
});

App.Views.Chatlog = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.$el.html("");
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(chatitem) {
		console.log('each');
		var chatitemView = new App.Views.Chatitem({ model: chatitem });

		this.$el.append(chatitemView.render().el);
	}
});
App.Views.Chatcontrol = Backbone.View.extend({
	el: '#chatcontrol',
	events: {     
        'keypress #chatBox' : 'chatPress'
      },
      chatPress : function(e)
      {
      	if(e.which == 13)
      	{
      		
      		var today=new Date();
			var h=today.getHours();
			var m=today.getMinutes();
          	var itemchat = new App.Models.Chatitem({ chattext:$('#chatBox').val(),chattime:h+':'+m });
			itemlogCollection.add(itemchat);
			var itemchat2 = new App.Models.Chatitem({ chattext:'this is call back test',chattime:h+':'+m,img:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/s32x32/260656_1447517355_1273269866_q.jpg' });
			itemlogCollection.add(itemchat2);
        }

      }
});
App.Views.Chatfilter = Backbone.View.extend({
	el: '#chatfilter',
	events: {     
        'click #filall' : 'filall',
        'click #filask' : 'filask',
        'click #filorder' : 'filorder',
        'click #filapprove' : 'filapprove',
        'click #filwait' : 'filwait',
        'click #filsend' : 'filsend',
        'keypress #searchchat' : 'searchchat'
      },
      searchchat:function(e)
      {
      	 if(e.which == 13)
      	{
      		this.filall();

			var found = chatlistCollection.filter(function(anyModel) 
			{
				// /var filter = new RegExp(baz + "d");
    			var startsWithA = new RegExp($('#searchchat').val(),"g");
    			return startsWithA.test(anyModel.get('cusname'));
			});
			chatlistCollection.reset();
			chatlistCollection.add(found);
			chatlistsView.render();
      	}

      },
      filall : function(e)
      {
      		chatlistCollection.reset();
			chatlistCollection.add([
				{
					cusname: 'a',
					orderstate: 2
				},
				{
					cusname: 'b',
					orderstate: 1
				},
				{
					cusname: 'c',
					orderstate: 2
				},
				{
					cusname: 'd',
					orderstate: 3
				},
				{
					cusname: 'e',
					orderstate: 4
				},
				{
					cusname: 'f',
					orderstate: 5
				},
				{
					cusname: 'g',
					orderstate: 4
				},
				{
					cusname: 'h',
					orderstate: 1
				},
				{
					cusname: 'i',
					orderstate: 2
				},

			]);
			chatlistsView.render();

      },
      filask : function(e)
      {
      		this.filall();
      		var musketeers = chatlistCollection.where({orderstate: 1});

			console.log(musketeers);
			chatlistCollection.reset();
			chatlistCollection.add(musketeers);
			chatlistsView.render();
      },
      filorder : function(e)
      {
      		this.filall();
      		var musketeers = chatlistCollection.where({orderstate: 2});

			console.log(musketeers);
			chatlistCollection.reset();
			chatlistCollection.add(musketeers);
			chatlistsView.render();

      },
      filapprove : function(e)
      {	
      		this.filall();
      		var musketeers = chatlistCollection.where({orderstate: 3});

			console.log(musketeers);
			chatlistCollection.reset();
			chatlistCollection.add(musketeers);
			chatlistsView.render();

      },
      filwait : function(e)
      {
      		this.filall();
      		var musketeers = chatlistCollection.where({orderstate: 4});

			console.log(musketeers);
			chatlistCollection.reset();
			chatlistCollection.add(musketeers);
			chatlistsView.render();

      },
      filsend : function(e)
      {
      		this.filall();
      		var musketeers = chatlistCollection.where({orderstate: 5});

			console.log(musketeers);
			chatlistCollection.reset();
			chatlistCollection.add(musketeers);
			chatlistsView.render();

      }
});



var itemcontrolView = new App.Views.Chatcontrol();
var itemfilterView = new App.Views.Chatfilter();

var itemlogCollection = new App.Collections.Chatitems();
var itemlogView = new App.Views.Chatlog({ collection: itemlogCollection });

var chatlistCollection = new App.Collections.Chatlists([
	
	{
		cusname: 'a',
		orderstate: 2
	},
	{
		cusname: 'b',
		orderstate: 1
	},
	{
		cusname: 'c',
		orderstate: 2
	},
	{
		cusname: 'd',
		orderstate: 3
	},
	{
		cusname: 'e',
		orderstate: 4
	},
	{
		cusname: 'f',
		orderstate: 5
	},
	{
		cusname: 'g',
		orderstate: 4
	},
	{
		cusname: 'h',
		orderstate: 1
	},
	{
		cusname: 'i',
		orderstate: 2
	},

]);
var chatlistsView = new App.Views.Chatlists({collection:chatlistCollection});

$('.chatlog').html(itemlogView.render().el);

$('.chatlist').html(chatlistsView.render().el);


/*
var down = [];
$(document).keydown(function(e) {
    down[e.keyCode] = true;
}).keyup(function(e) {
    if (down[68] && down[69] && down[86]) {
        alert('oh hai');
    }
    down[e.keyCode] = false;
});​*/

})();