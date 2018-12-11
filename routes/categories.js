var express = require('express');
var router = express.Router();
const mongo=require('mongodb');
const db=require('monk')('localhost/BlogSystem');

/* GET users listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory',{title:'Add Collection' 
  })

});
router.get('/show/:category', function (req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({ category: req.params.category }, {}, function (err, posts) {
    res.render('index', {
      title: req.params.category, posts: posts
    })
  })
});

router.post('/add',function(req,res,next){
  var name=req.body.name;
 
  
  req.checkBody('name','Name field is required').notEmpty();

  var err=req.validationErrors();
  if(err){
    throw err;
  }else {
    var category=db.get('category');
    category.insert({
      'name':name,
    },function(err,posts){
      if(err){
        res.send(err);
      }else{
        req.flash('success','you have posted the data');
        res.location('/');
        res.redirect('/');
      }
    })
  }});
  

module.exports = router;
