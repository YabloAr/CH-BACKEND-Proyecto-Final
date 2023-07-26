CODERHOUSE - BACKEND #43360
Tutora: Noelia.

Nuevo repositorio para alojar el progreso del proyecto final del curso.
Las entregas iran siendo alojadas en nuevas ramas.

A continuacion, products.router.

Consultas:

#1- En cartsManager.emptyCart: 

            //la primer idea fue la siguiente, para no tener codigo de mas
            //await cartsModel.findByIdAndUpdate(cartId, { $set: { products: [] } });
            //pero me devolvia 'products: [ { } ]', ese objeto vacio no me sirve ahi.

            1.Se puede hacer como pense? Como?
            2.Si en el modelo esta definido el esquema, porque me deja actualizar un documento que es distinto al esquema? (digo por el obj vacio)

