<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"><title>Quiz</title>
    <link rel='stylesheet' href='/stylesheet/style.css' />
  </head>
  <body>
    <h2>Quiz: El juego de las preguntas</h2>

    <form method="get" action="/quizes/answer">
      Pregunta: <%= pregunta %> <p>
      <input type="text" name="respuesta" value="Responda aqui" />
      <input type="submit" value="Enviar">
    </form>
  </body>
 </html>
