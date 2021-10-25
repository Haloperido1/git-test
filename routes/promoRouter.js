const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const cors = require('./cors');

const Promotions = require('../models/promotions')

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) =>
    {
        res.sendStatus(200);
    })
    .get((req, res, next) =>{
       Promotions.find({})
           .then((promos) => {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json(promos);
           }, (err) => next(err))
           .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next)=>{
        Promotions.create(req.body)
            .then((promo) => {
                console.log("Promotion created:", promo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next)=>{
        res.statusCode = 403
        res.end('Put operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser, (req, res, next) =>{
        Promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
///

///
promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) =>
    {
        res.sendStatus(200);
    })
    .get(cors.cors,  (req, res, next) =>{
        Promotions.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
        res.statusCode = 403
        res.end('Post operation not supported on /promotions/' + req.params.promoId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next)=>{
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {new: true})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) =>{
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader( 'Content-Type', 'applications/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = promoRouter;