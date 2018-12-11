var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './upload' })
var mongo = require('mongodb');
const db=require('monk')('localhost/BlogSystem');


/* GET users listing. */
router.get('/add', function(req, res, next) {
  var db=req.db;
  var categories=db.get('category');
  categories.find({},{},function(err,categories){
    res.render('addpost',{title:'Add Post',categories:categories  
  })
  })

});
router.get('/show/:_id', function (req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.findOne({ _id: req.params._id }, {}, function (err, post) {
    res.render('show', {
      title: 'ok', post: post
    })
  })
});


router.post('/add',upload.single('mainimage'),function(req,res,next){
  var title=req.body.title;
  var author=req.body.author;
  var category=req.body.category;
  var body=req.body.body;
  var date=new Date()
  if(req.file){
    var mainimage=req.file.filename
  }else{
    var mainimage='no-image.png'
  }
  
  req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

  var err=req.validationErrors();
  if(err){
    throw err;
  }else {
    var posts=db.get('posts');
    posts.insert({
      'title':title,
      'body':body,
      'author':author,
      'category':category,
      'date':date,
      'mainimage':mainimage
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
 
  router.post('/addComment',function(req,res,next){
    var name=req.body.name;
    var email=req.body.email;
    var body=req.body.body;
    var postid=req.body.postid;
    var commentDate=new Date();
    
    req.checkBody('name','name field can not be empty').notEmpty();
    req.checkBody('email','email is empty').notEmpty();
    req.checkBody('email','email is not in format').isEmail();
    var errors=req.validationErrors();
    if(errors){
      var post=db.get('posts');
      post.findOne(postid,function(err,post){
        res.render('show',{
          "errors": errors,
          "post": post
        });
      });
    }else{
      var comment={
        "name":name,
        "email":email,
        "commentDate":commentDate,
        "body":body
      }
      var post = db.get('posts');
      post.update({
        "_id":postid
      },{
        $push:{
          "comments":comment
        }
      },function(err,doc){
        if(err){
          throw err;
        }else {
          req.flash('success','comment has been posted');
          res.location('/posts/show/'+postid);
          res.redirect('/posts/show/'+postid);        }
      })
    }
  })

module.exports = router;
