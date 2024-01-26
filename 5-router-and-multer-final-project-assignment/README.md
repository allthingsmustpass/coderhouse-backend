# Servidor con express

Esta server corresponde al tercer desafío entregable del curso de Programación Backend en Coderhouse, se trata de un server basado en Express donde se puede hacer consultas a una persistencia de archivos.

#### TODO:

- Agregar carrito.
- La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
- La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el
siguiente formato:
1.  product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
2. quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.

- Persistencia de la información se implementará utilizando el file system, donde los archivos “productos,json” y “carrito.json”, respaldan la información.
- Intentar que se reste 'stock' según cantidad de productos agregados al carrito. 
- Resolver que no puedan coexistir dos 'code' idénticos una vez que se edita el producto.

## Uso
Instalar las dependencias con:
```
npm install
```
Y ejecutar
```
node app.js
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