var Something = require('../models/somethings');
var Comment = require('../models/comments');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	
	req.flash("error", "You need to be logged in to do that"); // flash displays on the next page, therefore needs to go before res.redirect
	res.redirect("/login"); // no need to add 'else' because of return
}

middlewareObj.checkSomethingOwnership =	function(req, res, next) {
	if(req.isAuthenticated()) {
		Something.findById(req.params.id, function(err, something) {
			if(err || !something) {
				console.log("err");
				req.flash("error", "Something not found");
				res.redirect("/somethings");
			} else {
				
				// if (something.author.id === req.user._id) 	// this wont work, first one is a mongoose object, second is a string
				if(something.author.id.equals(req.user._id)) {
					req.something = something;
					next();
				} else {
					req.flash("error", "You do not have permission to edit this something");
					res.redirect("/somethings");
				}
			}
		});
	}
	else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if(err || !comment) {
				console.log(err);
				req.flash("error", "Comment not found");
				res.redirect("/somethings");
			} else {
				
				// if (something.author.id === req.user._id) 	// this wont work, first one is a mongoose object, second is a string
				if(comment.author.id.equals(req.user._id)) {
					req.comment = comment;
					next();
				} else {
					req.flash("error", "You do not have permission to edit this comment");
					res.redirect("/somethings");
				}
			}
		});
	}
	else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj;

// could also write functions separately and export an object this way {}