var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    cookieParser        = require('cookie-parser'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    chalk               = require('chalk'), // Colors in console
    methodOverride      = require('method-override'),
    Campground          = require('./models/campground'),
    Comment             = require('./models/comment'),
    User                = require('./models/user'),
    seedDB              = require('./seed'),

    // Routes
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

const   error = chalk.bold.red,
        warning = chalk.keyword('orange');


/************************ Setting up Database *************************/
mongoose.connect('mongodb://localhost/CampDB');
let db = mongoose.connection; // variable for the connection

// If connected successfully print:
db.once('open', function(){
    console.log('Connected to ' + chalk.cyan('MongoDB'));
});

// Check for DB Errors
db.on('error', function (err) {
    console.log(error('Error!\n'));
    console.log(err);
});
/************************************************************************/

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// view engine setup
app.use(express.static(__dirname + '/public/css/'));    // dirname is a safe way to look the location, then inside there, look for /public/css/
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use(express.static(__dirname + '/public/images/'));
app.use(express.static(__dirname + '/public/javascripts/'));
app.use(methodOverride('_method')); // we use and tell methodOverride what to look for
app.set('view engine', 'ejs');

// ERROR DRIVEN DEVELOPMENT
// Create new data manually in DB => seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "S@p3F^M%*ZK9f* S@p3F^M%*ZK9f* S@p3F^M%*ZK9f* S@p3F^M%*ZK9f*",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// use the model User to authenticate, if I didn't have on the model:
// UserSchema.plugin(passportLocalMongoose); I would have to write my own method
passport.use(new LocalStrategy(User.authenticate()));   // middleware to use in app.post(...)
passport.serializeUser(User.serializeUser()); // Needed to encrypt/decript the secret phrase when login in
passport.deserializeUser(User.deserializeUser()); // Needed to encrypt/decript the secret phrase when login in

// include currentUser: req.user on every request so it can know who's logged in
app.use(function (req, res, next) { // needs to go below the initializations of passport or won't work
    // pass the request to every template
    res.locals.currentUser = req.user;
    next(); // if we don't have this, it'll stop, so it won't do the next action
});


// Use routes in the routes folder
app.use('/', indexRoutes);
// This is saying: use what's inside the campgroundRoutes and in every route, append /campgrounds in front
// for example: inside the route, instead of /campgrounds/new, it would be /new, because I'm already saying here that /campgrounds goes at front
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// port to listen
app.listen(3000, () => {
    console.log('Listening on port: ' + chalk.green(3000));
});