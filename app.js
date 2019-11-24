var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	mongoose 			= require('mongoose'),
	flash 				= require('connect-flash'),
	passport 			= require('passport'),
	LocalStrategy 		= require('passport-local'),
	methodOverride 		= require('method-override'),
	Comment 			= require('./models/comments'),
	Something 			= require('./models/somethings'),
	User 				= require('./models/user'),
	seedDB				= require('./seeds');

var commentsRoutes 		= require("./routes/comments"),
	somethingsRoutes 	= require("./routes/somethings"),
	indexRoutes			= require("./routes/index");
// also need to write app.use.... below after deserialize


// seedDB(); // this is not needed anumore, it was populating dummy data
// mongoose.connect('mongodb://localhost:27017/yelp', { 
mongoose.connect('mongodb+srv://globalUser:TestUser1234@somethingcluster-zo5fb.mongodb.net/test?retryWrites=true&w=majority', { 
	useNewUrlParser: true, 
	useUnifiedTopology: true
});

// app.use(express.static('public'));
app.use(express.static(__dirname + "/public")); 	// __dirname is the directory where this script is located
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// Compile to a model


// // Add a smomething
// Something.create({
// 	name: "Some other Zebra", 
// 	image: "https://mobirise.com/bootstrap-gallery/assets1/images/photo-1461744498292-5df270c6ba06-1350x900.jpg",
// 	description: "This is a wild zebra in black and white blablabla. Blabla lalallall trolo"
// }, function(err, something) {
// 	if(err) {
// 		console.log("Error: " + err);
// 	} else {
// 		console.log("Newly created something: " + something);
// 	}
// }); // <- we don't want to create it each time

// // Should be in a data base
// var somethings = [
// 		{name: "Mr. Fox", image: "https://mobirise.com/bootstrap-gallery/assets1/images/photo-1440658172029-9d9e5cdc127c-1426x863.jpg"},
// 		{name: "Some other Zebra", image: "https://mobirise.com/bootstrap-gallery/assets1/images/photo-1461744498292-5df270c6ba06-1350x900.jpg"}
// 	]; // <- without a db



// RESTful routes:
// INDEX 	/somethings			GET		Displays a list of all somethings
// NEW 		/somethings/new 	GET		Displays a form to add a something
// CREATE 	/somethings			POST	Add a new something to DB
// SHOW		/somethings/:id		GET		Shows info about selected something

// PAssport config
app.use(require('express-session')({
	secret: "Blabla bla bla",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // this one comes from plugin passport-local-mongoose in user.js
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to pass user variable to all routes
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error"); // needed because message is used in the header but only selected pages use flash
	next();
});

// routes
// app.use(authRoutes);
// app.use(somethingsRoutes);
// app.use(commentsRoutes);

// To reduce the paths 
app.use(indexRoutes);
app.use("/somethings/", somethingsRoutes);
app.use("/somethings/:id/comments", commentsRoutes);



// Server check
// app.listen(3000, function(){
// 	console.log("YelpCamp server has started");
// });
app.listen(process.env.PORT || 3000, () => {
    console.log("Something server has started");
})