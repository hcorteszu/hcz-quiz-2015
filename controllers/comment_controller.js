var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req,res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments  Esta no funcion
/* exports.create = function(req, res) {
	var comment = models.Comment.build(
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId
		});

	comment.
	validate()
	.then(
	  function(err){
	  	if (err) {
	  		res.render('comment/new.ejs', {comment: comment, errors: err.erorrs});
	  } else {
	  	comment // save: guarda en DB campo texto de comment
	  	.save()
	  	.then( function() { res.redirect('/quizes/'+req.params.quizId)})
	  }
   }
   ).catch(function(error){next(error)});
};          */

// POST /quizes/:quizId/comments  Esta si funciona 
exports.create = function(req, res) {
	var comment = models.Comment.build(
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId
		});
    var errors = comment.validate();
     if (errors) {
       var i=0; var errores= new Array();
	   for (var prop in errors) {
	 		errores[i++]={message:errors[prop]};
	 	}
	 	res.render('comment/new', {comment: comment, errors: errores});
	  } else {
	  	comment // save: guarda en DB campo texto de comment
	  	.save()
	  	.then( function() {res.redirect('/quizes/'+req.params.quizId)})
	  }
};