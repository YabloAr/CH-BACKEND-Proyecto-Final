CODERHOUSE - BACKEND #43360
Tutora: Noelia Cossio.

Nuevo repositorio para alojar el progreso del proyecto final del curso.
Las entregas iran siendo alojadas en nuevas ramas.

Desafio Clase 19 - Login por Formulario: Entrega Finalizada

Consultas: None.

En realidad, en la entrega 19, el sistema de sesion esta mal pensado. Ahora funciona por login, en el login se crea un doc en la db con los
datos de la sesion, y con la misma accion de login se crea una req.session.user con los datos y el tiempo de vida de esa sesion local.
La navegacion de la pagina valida la req.session local, cuando deberia validar el doc en la db. Podria hacerlo ahora, aunque nose
si academicamente deberia. Consultar.