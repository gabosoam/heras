var express = require('express');
var router = express.Router();
var model = require('../model/model');
var event = require('../model/event');

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('model', {  user: sess.usuarioDatos });
});

router.get('/read', function (req, res, next) {
  model.read(function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});

router.get('/readBuy', function (req, res, next) {
  model.readBuy(function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});

router.get('/readsell', function (req, res, next) {
  model.readSell(function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});

router.get('/readsell/:id', function (req, res, next) {

  var id = req.params.id;
  model.readSellOne(id,function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});


  router.get('/:code', function (req, res, next) {
    var code = req.params.code;
    model.readOne(code,function (error, datos) {
      if (error) {
      } else {
        res.send(datos);
      }
    })
  });


router.get('/readBill', function (req, res, next) {
 
  model.readBil(function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});

router.get('/read2', function (req, res, next) {
  model.read2(function (error, datos) {
    if (error) {
    } else {
      res.send(datos);
    }
  })
});

router.post('/update',isLoggedIn, function (req,res,next) {
 
   var data= req.body;
   model.update(data,function(error, datos){
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

router.post('/delete', function (req,res,next) {
   var data= req.body;
   model.delete(data,function(error, datos){
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
   model.create(data,function(error, datos){
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
