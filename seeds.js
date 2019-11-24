var mongoose = require('mongoose');
var Something = require('./models/somethings');
var Comment = require('./models/comments');

// var data = [
// 	{
// 		name: "Name 1",
// 		image: "https://mobirise.com/bootstrap-gallery/assets1/images/photo-1440658172029-9d9e5cdc127c-1426x863.jpg",
// 		description: "Description 1"
// 	},
// 	{
// 		name: "Name 2",
// 		image: "https://mobirise.com/bootstrap-gallery/assets1/images/photo-1461744498292-5df270c6ba06-1350x900.jpg",
// 		description: "Description 2"
// 	},
// 	{
// 		name: "Name 3",
// 		image: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
// 		description: "Description 3"
// 	}
// ];

function seedDB() {
	
	// Remove all somethings
	Something.remove({}, function(err) {
		if(err) {
			console.log(err);
		}

		console.log("Removed somethings");
		
		// // Add new somethings -- needs to be in the call back function of remove to make sure it is executed after data is removed
		// data.forEach(function(seed){
		// 	Something.create(seed, function(err, something) {
		// 		if(err) {
		// 			console.log("Error when creating something: " + err);
		// 		} else {
		// 			console.log("Added a something: " + something);
					
		// 			Comment.create({
		// 				text: "Comment 1",
		// 				author: "Homer"
		// 			}, function(err, comment){
		// 				if(err) {
		// 					console.log("Error when adding a comment: " + err);
		// 				} else {
		// 					something.comments.push(comment);
		// 					something.save();
		// 					console.log("created new comment in somethings");
		// 				}
						
		// 			});
		// 		}
		// 	});
		// });
	});	

	
	
	// add a few comments
}

module.exports = seedDB;