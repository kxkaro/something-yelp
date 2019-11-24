var express = require('express');
var router = express.Router();
var Something = require('../models/somethings');
var Comment = require('../models/comments');
var User = require("../models/user");
var middleware = require("../middleware");

// INDEX route
router.get("/", function(req, res) {
	// var somethings = [];
	// res.render("somethings", {somethings: somethings}); // <- without a db
	
	// Get all somethings from db and render if no error
	Something.find({}, function(err, allSomethings) {
		if(err) {
			console.log("Error getting all somethings from the db: " + err);
		} else {
			res.render("somethings/index", {
				somethings: allSomethings
				// ,
				// currentUser: req.user	// Not needed now because it's defined after deserialize()
			});
		}
	});
});


// REST - new should show the form which will send the data
// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("somethings/new");
});


// Convention is to name the routes in get and post the same (REST)
// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from the form and add to somethings array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newSomething = {
		
		name: name, 
		price: price,
		image: image,
		description: description,
		author: author};
	
	// somethings.push(newSomething); // <- without a DB
	
	// Create a new something and save it to DB
	Something.create(newSomething, function(err, something){
		if(err || !something) {
			req.flash("error", "Something went wrong");
			console.log("Error creating a new something: " + error);
		} else {
			
			// // add username and id to comment
			// // user must be logged in (middleware isLoggedIn) - this is assured
			// something.author.id = req.user._id;
			// something.author.username = req.user.username;
			// // Save comment	
			// something.save(); // not needed - see variables above
			console.log("New something created:");
			console.log(something);
		}
	});
	
	// redirect
	req.flash("success", "Something successfully created");
	res.redirect("/somethings");
});


// Show blog post
router.get("/:id", function(req, res){
	// find the something with provided :id and render a page
	// var somethingId = req.params.id;
	Something.findById(req.params.id).populate("comments").exec(function(err, something) {
		if (err || !something) {
			console.log(err);
			req.flash("error", "Sorry, this something does not exist");
			res.redirect("/somethings");
			console.log("Could not find id error: " + err);
		} else {
			res.render("somethings/show", {something: something});
		}
	});
	
});


// EDIT
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkSomethingOwnership, function(req, res) {
	res.render("somethings/edit", {something: req.something});
	// if(req.isAuthenticated()) {
		// Something.findById(req.params.id, function(err, something) {
			
			// all below commented code is executed in function checkSomethingOwnership
			
			// if(err) {
			// 	res.redirect("/somethings");
			// } else {
				// if (something.author.id === req.user._id) 	// this wont work, first one is a mongoose object, second is a string
				// if(something.author.id.equals(req.user._id)) {
					// res.render("somethings/edit", {something: something});
				// } else {
				// 	res.send("You do not have permission");
				// }
			// }
		// });
	// }
	// else {
	// 	console.log("You need to be logged in");
	// 	res.send("You need to be logged in");
	// }
	// Something.findById(req.params.id, function(err, something) {
	// 	if (err) {
	// 		res.redirect("/somethings");
	// 	} else {
	// 		res.render("somethings/edit", {something: something});
	// 	}
	// });
	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkSomethingOwnership, function(req, res){
    // find and update the correct campground
    Something.findByIdAndUpdate(req.params.id, req.body.something, function(err, updatedSomething){
       if(err || !updatedSomething){
		   req.flash("error", "Sorry, this something does not exist!");
           res.redirect("/somethings");
       } else {
           //redirect somewhere(show page)
		   req.flash("success", "Something successfully updated");
           res.redirect("/somethings/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkSomethingOwnership, function(req, res){
   Something.findByIdAndRemove(req.params.id, function(err, something){
      if(err || !something){
		  req.flash("error", "Sorry, this something does not exist!");
          res.redirect("/somethings");
      } else {
		  req.flash("success", "Something successfully deleted");
          res.redirect("/somethings");
      }
   });
});



// // Check authentication - middleware
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login"); // no need to add 'else' because of return
// }

// function checkSomethingOwnership(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		Something.findById(req.params.id, function(err, something) {
// 			if(err) {
// 				res.redirect("back");
// 			} else {
// 				// if (something.author.id === req.user._id) 	// this wont work, first one is a mongoose object, second is a string
// 				if(something.author.id.equals(req.user._id)) {
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