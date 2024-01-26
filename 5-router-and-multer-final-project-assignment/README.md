# Servidor con endpoints y servicios

Esta server corresponde a la primera entrega del proyecto final de Coderhouse, se desarrollará un servidor que contenga los endpoints y
servicios necesarios para gestionar los productos y carritos de compra en el e-commerce.

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
Y ejecutar:
```
node app.js
```

Ejecutar desde http://localhost:8080/ o cualquier herramienta para testear API's como Postman.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)