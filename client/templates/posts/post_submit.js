Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      title: $(e.target).find('[name=title]').val(),
      price: $(e.target).find('[name=price]').val(),
      description: $(e.target).find('[name=description]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.price || errors.description)
    	return Session.set('postSubmitErrors', errors)

    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
         return throwError(error.reason);
      Router.go('postPage', {_id: result._id});  
    });
  }
});

//picture stuff here
var getPicture = function(opts){
	MeteorCamera.getPicture(opts, function(err, data){
		if (err)
			console.log('error', err)
		if (data)
			Session.set('img', data)
	});
};

Template.cameraEvent.events({
	'click button': function(){
		getPicture({
			width:350,
			height: 350,
			quality: 80
		});
	}
});

Template.img.helpers({
	img: function(){
		return Session.get('img')
	}
})