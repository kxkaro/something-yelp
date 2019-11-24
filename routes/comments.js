var express = require('express');
// mergeParams is necessary to find the Id of a something when posting a new comment 
var router = express.Router({mergeParams: true});
var Something = require('../models/somethings');
var Comment = require('../models/comments');
var User = require("../models/user");
var middleware = require("../middleware");


// Nested routes for COMMENTS
// NEW 		somethings/:id/comments/new		GET
// CREATE 	somethings/:id/comments			POST
// EDIT		somethings/:id/comments/edit	POST / use PUT

router.get("/new", middleware.isLoggedIn, function(req, res){
	// find the something with provided :id and render a page
	// var somethingId = req.params.id;
	Something.findById(req.params.id, function(err, something) {
		if (err || !something) {
			req.flash("error", "Sorry, this something does not exist!");
			res.redirect("/somethings");
		} else {
			res.render("comments/new", {something: something});
		}
	});
	
});


// Post comment and get back to the something page
router.post("/", middleware.isLoggedIn, function(req, res){
	// find the something with provided :id and render a page
	// var somethingId = req.params.id;
	Something.findById(req.params.id, function(err, something) {
		if (err || !something) {
			req.flash("error", "Sorry, this something does not exist!");
			res.redirect("/somethings");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// add username and id to comment
					// user must be logged in (middleware isLoggedIn) - this is assured
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment	
					comment.save();
								
					something.comments.push(comment);
					something.save();
					req.flash("success", "Comment added successfully");
					res.redirect("/somethings/" + something._id);
				}
			});
			
		}
	});
	
});

router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req,res) {
	res.render("comments/edit", {
				something_id: req.params.id,
				comment: req.comment
			});
	
	// Comment.findById(req.params.comment_id, function(err, comment){
	// 	if(err || !comment) {
	// 		req.flash("error", "Sorry, this comment does not exist!");
	// 		res.redirect("back")
	// 	} else {
	// 		res.render("comments/edit", {
	// 			something_id: req.params.id,
	// 			comment: comment
	// 		});
	// 	}
	// });	
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfully updated");
			res.redirect("/somethings/" + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
		if (err || !comment) {
			req.flash("error", "Sorry, this comment does not exist");
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfully deleted");
			res.redirect("/somethings/" + req.params.id);
		}
	});
});

// // Check authentication middleware
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login"); // no need to add 'else' because of return
// }

// function checkCommentOwnership(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		Comment.findById(req.params.comment_id, function(err, comment) {
// 			if(err) {
// 				res.redirect("back");
// 			} else {
// 				// if (something.author.id === req.user._id) 	// this wont work, first one is a mongoose object, second is a string
// 				if(comment.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	}
// 	else {
// 		res.redirect("back");
// 	}
// }

module.exports = router;