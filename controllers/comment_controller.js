var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {
			  id: Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			 req.comment = comment;
			 next();
		}else{next(new Error('No existe commentId=' + commentId))}
}
).catch(function(error){next(error)});
};
// GET /quizes/:qui)zId/comments/new
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

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	.then( function(){ res.redirect('/quizes/'+req.params.quizId);})
	.catch(function(error){next(error)});
	
};