CODERHOUSE - BACKEND #43360
Tutora: Noelia.

Nuevo repositorio para alojar el progreso del proyecto final del curso.
Las entregas iran siendo alojadas en nuevas ramas.

A continuacion, products.router.

Consultas:

#1 - En cartsManager.emptyCart: 

            //la primer idea fue la siguiente, para no tener codigo de mas
            //await cartsModel.findByIdAndUpdate(cartId, { $set: { products: [] } });
            //pero me devolvia 'products: [ { } ]', ese objeto vacio no me sirve ahi.

            1.Se puede hacer como pense? Como?
            2.Si en el modelo esta definido el esquema, porque me deja actualizar un documento que es distinto al esquema? (digo por el obj vacio)

#2 - En cartsManager.addProductToCart.

            //Despues de aplicar el populate estoy teniendo un problema.
            //el cart creado de manera previa con productos dentro, funciona perfecto, y cuando
            //lo consulto me lo devuelve con el populate funcionando.
            //Pero despues de aplicar añadir la funcionalidad de populate, el metodo crea un producto 'null'
            //dentro del cart elegido. Probe con .toString() antes de pushear el nuevo valor, pero no 
            //se resuelve...que estoy haciendo mal?