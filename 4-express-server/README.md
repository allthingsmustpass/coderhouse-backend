# Servidor con express

Esta server corresponde al tercer desafío entregable del curso de Programación Backend en Coderhouse, se trata de un server basado en Express donde se puede hacer consultas a una persistencia de archivos.

#### Los aspectos a incluir son:

- [x] Se deberá utilizar la clase ProductManager que actualmente utilizamos con la persistencia de archivos.

- [x] Desarrollar un servidor Express que, en su archivo app.js importe al archivo de ProductManager.

Debe contar con los endpoints: 
- [x] La ruta `/products` que lee el archivo de productos y los devuelve dentro de un objeto con el soporte `?limit=` que recibe un límite de productos y si no recibe una query de límite, se devuelven todos los productos.

- [x] La ruta `/products/:pid` que reciba por req.params el pid (product id) y devolver solo el producto solicitado, en lugar de todos los productos.

- [x] Debe estar presente una carpeta `src` con `app.js` dentro.

## Uso
Instalar las dependencias con:
```
npm install
```
Ejecutar desde http://localhost:8080/ o cualquier herramienta para testear API's con una GET request.
Se permite:

1. `/products`, que devuelve todos los productos dentro del json.
2. `/products?limit=N`, donde N es el límite de productos a visualizar.
3. `/products/id`, donde id es el número identificador del producto a visualizar.

## Testing

1. Se instalarán las dependencias a partir del comando `npm install`.

2. Se echará a andar el servidor. 

3. Se revisará que el archivo ya cuente con al menos diez productos creados al momento de su entrega, es importante para que los tutores no tengan que crear los productos por sí mismos, y así agilizar el proceso de tu evaluación.

4. Se corroborará que el servidor esté corriendo en el puerto 8080.

5. Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.

6. Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.

7. Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.

8. Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)