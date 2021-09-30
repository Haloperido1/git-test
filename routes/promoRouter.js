const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) =>{
        res.end('Here you can find all promotions');
    })
    .post((req,res,next)=>{
        res.end('Will add the promo: ' + req.body.name
            + ' with details: ' + req.body.description);
    })
    .put((req,res,next)=>{
        res.statusCode = 403
        res.end('Put operation not supported on /promotions');
    })
    .delete((req, res, next) =>{
        res.end('Deleting all promo');
    })
///

///
dishRouter.route('/:promoId')
    .get( (req, res, next) =>{
        res.end('You chose promo: ' + req.params.promoId );
    })
    .post((req,res,next)=>{
        res.statusCode = 403
        res.end('Post operation not supported on /promotions/' + req.params.dishId);
    })
    .put( (req,res,next)=>{
        res.write('Updating the promo: ' + req.params.dishId + '\n')
        res.end('Will update the promo: ' + req.body.name + ' with details: ' + req.body.description)
    })
    .delete( (req, res, next) =>{
        res.end('Deleting promo' + req.params.dishId);
    })

module.exports = dishRouter;