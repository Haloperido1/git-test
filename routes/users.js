const express = require('express');
const  bodyParser = require('body-parser');
let User = require('../models/user');
let passport = require('passport');
let authenticate = require('../authenticate');


let router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function (req, res, next){
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) =>{
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else{
            if (req.body.firstname){
                user.fistname = req.body.fistname;
            }
            if (req.body.lastname){
                user.lastname = req.body.lastname;
            }
            user.save((err, user) => {
                if(err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration successful'});
                });
            });
        }
      });
});

router.post('/login', passport.authenticate('local'), (req,res) => {

    let token = authenticate.getToken({_id: req.user._id});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true, token: token, status: 'Login successful'});
});

router.get('/logout', (req,res,next) =>{
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else{
        let err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }
})

module.exports = router;
