let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('./models/user');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken');
let Dishes = require('./models/dishes');
let config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user){
    return jwt.sign(user, config.secretKey,
        {expiresIn: 36000000});
};

let opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
     (jwt_payload, done) => {
      //  console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err,user) =>{
            if(err) {
                return done(err, false);
            }
            else if (user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }

        });
     }));
exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin === true){
      //  console.log("admin");
        return next();
    }
    else {
        //console.log("not admin");
        return res.status(403);
    }
};

exports.verifyOrdynaryUser = async (req, res, next) => {

    const { commentId } = req.params;
    const { _id: userId, admin } = req.user;


    const dish = await Dishes.findOne({ 'comments._id': commentId });
  //  console.log(dish?.toJSON?.());
    // console.log(comment.author);
    if( userId === dish.comments.author || admin === true){
       // console.log("You have access");
        return next();
    }
    else {
       // console.log("This is not your comment");
        return res.status(403).end("This is not your comment");
    }
    return next();
};



