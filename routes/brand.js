var express = require('express');
var router = express.Router();
var brand = require('../model/brand');
var event = require('../model/event');



/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('brand', {  user: sess.usuarioDatos });
});





router.get('/read', function (req, res, next) {
  brand.read(function (error, datos) {
    if (error) {
   
    } else {
      res.send(datos);
    }
  })
});

router.post('/update',isLoggedIn, function (req,res,next) {
   var data= req.body;
   brand.update(data,function(error, datos){
    if (error) {
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
       
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})

router.post('/delete', isLoggedIn, function (req,res,next) {
   var data= req.body;
   brand.delete(data,function(error, datos){
    if (error) {
  
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
   
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})


router.post('/create', function (req,res,next) {
   var data= req.body;
   brand.create(data,function(error, datos){
    if (error) {
    
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
    
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})

function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}






module.exports = router;
