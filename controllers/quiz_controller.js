var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
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


// GET /quizes/:id
exports.show = function(req, res) { 
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
        resultado='Correcto';
	   }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
 // exports.busquedas = function(req,res) {
//	res.render('quizes/busquedas');
// };

exports.author = function(req,res) {
	res.render('quizes/author');
};