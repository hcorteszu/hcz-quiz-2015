var path = require('path');
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6] || null);
var user      = (url[2] || null);
var pwd       = (url[3] || null);
var protocol  = (url[1] || null);
var dialect   = (url[1] || null);
var port      = (url[5] || null);
var host      = (url[4] || null);
var storage   = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres

var sequelize = new Sequelize(DB_name, user, pwd,
	               {dialect: protocol, 
	               	port:    port,
	               	host:    host,
	               	storage: storage, // Solo SQlite (.env)
	                omitNull: true}   // Solo Postgres
	               );

// Importar la definicion de la tabla Quiz en quiz.js
// var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Agregado para Modulo 9
// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importat definicion de la Tabla Commnent 
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz
exports.Comment = Comment; // exportar definicion de la tabla Comment


// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count ===0) {  // la tabla se inicializa solo si esta vacia
           Quiz.create({ pregunta: 'Capital de Italia',
                         respuesta: 'Roma',
                         tema: 'Otro'
                     });
           Quiz.create({ pregunta: 'Capital de Portugal',
                         respuesta: 'Lisboa',
                         tema:  'Otro'
                     })    
           .then(function(){console.log('Base de datos inicializada')});
		};
	}); 
});