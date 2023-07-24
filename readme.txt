Update chat:

CONSULTA A TUTOR
FileManagement, la verdad no tengo idea de como manejar los archivos con respecto al codigo referido a los mensajes.
Por un lado interactua el socket desde app.js hacia views.router.js (que es donde se levanta el index.js del cliente),
toda la data va y viene entre esos tres archivos, y en app me queda un choclaso de codigo muy desprolijo, siento que
deberia delegarle ese rollo a message.router, pero nose como migrar el manejo con los sockets de app.js...
o bien separarlo (porque la data de los mensajes existe dentro de la comunicacion dentro de los sockets.)
La pregunta es, como puedo mejorar el manejo de archivos en mi proyecto, actualmente la estructura es esta:

app.js (aplica conexion http, y gestiona la data de input de los usuarios, al mismo tiempo que escribe en la db. )
views.router (dispara el index.js que representa al cliente para el chat)
index.js (codigo del cliente y gestion de la data de los input)

message.router (se la pasa comiendo chipa sin saber que hacer mientras app esta por tirar todas las estanterias del deposito)

Gracias de antemano.