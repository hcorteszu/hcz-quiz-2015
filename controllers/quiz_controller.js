var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		      where: { id: Number(quizId) },
		      include :[{ model: models.Comment }]
	}).then(
		function(quiz) {
		  if (quiz) {
		  	 req.quiz = quiz;
		  	 next();		  	 
		  }   else {next (new Error("No existe quizId = " + quizId));}
     }
    ).catch(function(error) { next(error);});
};

// GET /quizes

exports.index = function(req, res) {
var mi_busqueda = req.query.search;
var condicion = ('%' + mi_busqueda+ '%').replace(/ /g,'%');
 if (req.query.search) {
	models.Quiz.findAll({
		 where: ["pregunta like ?", condicion],
		 order: [['pregunta', 'ASC']]}
		 ).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});
	}).catch(function(error) {next(error);});
}else{
	models.Quiz.findAll({order:[['pregunta', 'ASC']]}).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});	
}).catch(function(error) {next(error);});
}
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(   // crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
		);
	   res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create -->  esto no funciona
/*   exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	    quiz
	    .validate()
	    .then(
	    function(err) {
	  if (err) {
	 	res.render('/quizes/new', {quiz: quiz, errors: errors});
	 } else	{
	// guarda en DB los campos pregunta y respuesta de quiz
	quiz
	.save({fields: ["pregunta", "respuesta"]}).then(function()
		{ res.redirect('/quizes')})
	} // Redireccion HTTP (URL relativo)  lista de preguntas
}
);
};    */

// POST /quizes/create  esto si funciona
   exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );	
	    var errors=quiz.validate();
	  if (errors) 
	   {
	 	var i=0; var errores=new Array();
	 	for (var prop in errors) {
	 		errores[i++]={message:errors[prop]};
	 	}
	 	res.render('quizes/new', {quiz: quiz, errors: errores});
	 } else	{
	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function()
		{ res.redirect('/quizes') 
	}) // Redireccion HTTP (URL relativo)  lista de preguntas
}
};  

// GET /quizes/:id/edit 
   exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz
	
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id   
   exports.update = function(req, res) {
	 req.quiz.pregunta  = req.body.quiz.pregunta;
	 req.quiz.respuesta = req.body.quiz.respuesta;	
	 req.quiz.tema = req.body.quiz.tema;
	 var quiz = models.Quiz.build( req.body.quiz);
	  var errors=quiz.validate();
	  if (errors) 
	   {
	 	var i=0; var errores=new Array();
	 	for (var prop in errors) {
	 		errores[i++]={message:errors[prop]};
	 	}
	 	res.render('quizes/edit', {quiz: quiz, errors: errores});
	 } else	{
	// save: guarda en DB los campos pregunta y respuesta de quiz
	req.quiz
	.save({fields: ["pregunta", "respuesta", "tema"]}).then(function()
		{ res.redirect('/quizes') 
	}) // Redireccion HTTP (URL relativo)  lista de preguntas
}
};
// GET /quizes/:id
exports.show = function(req, res) { 
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
        resultado='Correcto';
	   }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};
   exports.busquedas = function(req,res) {
   res.render('quizes/busquedas');
 };

// DELETE  /quizes/:id 
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
  	res.redirect('/quizes');
   }).catch(function(error){next(error)});
};
// exports.author = function(req,res) {
//	res.render('quizes/author',{errors: []});
// };