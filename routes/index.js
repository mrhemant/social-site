 var express = require('express');
var router = express.Router();
var http=require('http');
var Post = require('../models/post');
var Report = require('../models/report');
var session = require('client-sessions');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/loginapp';



// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){

Post.find({}).sort('-date').exec(function(err, allPosts){
    res.render('index.ejs', {allPosts: allPosts, username: session.user});

})
});
router.get('/flagged', ensureAuthenticated, function(req, res){
    Post.find({flag: true}, function(err, flaggedPost){
          res.render("report.ejs", {flaggedPost: flaggedPost});
    });
});


router.get('/profile', ensureAuthenticated, function(req, res){
var username = session.user;
Post.find({username : username}).sort('-date').exec(function(err, myPosts){
    res.render('profile.ejs',{myPosts: myPosts});

})
});

router.get('/wpost',ensureAuthenticated, function(req, res){
res.render('post');
});



router.get('/report/:id', function(req, res){

  var id = req.params.id;
  var errors = req.validationErrors();


  // if(errors){
	// 	res.render('report',{
	// 		errors:errors
	// 	});
	// } else {
	// 	var newReport = new Report({
	// 		id: id
	// 	});
  //
  //   Report.createReport(newReport, function(err, Report){
	// 		if(err) throw err;
  //   });
  Post.update({ _id: id }, { $set: { flag: true }}, function(err, post){
    console.log(post);
  });
  // console.log(id);


    req.flash('success_msg', 'Post Reported');
    res.redirect('/');

});

router.get('/delete/:id', function(req, res){
  var id= req.params.id;
   Post.findByIdAndRemove(id, function(err, post){
     console.log(post);
     res.redirect("/profile")
   });
  // Post.deleteone({_id : id});
});

router.post('/wpost', function(req, res){
	var post = req.body.post;
	var title = req.body.title;
  console.log(post,title);

	var username = session.user;

	// Validation
	req.checkBody('post', 'post is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('post',{
			errors:errors
		});
	} else {
		var newPost = new Post({
			username: username,
			post: post,
      title: title
		});

		Post.createPost(newPost, function(err, Post){
			if(err) throw err;
			console.log(newPost);
		});

		req.flash('success_msg', 'You are posted a new post');

		res.redirect('/');
	}
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;
