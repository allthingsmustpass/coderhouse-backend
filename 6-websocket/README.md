# Servidor con endpoints y servicios

Esta server corresponde a la primera entrega del proyecto final de Coderhouse, se desarrollará un servidor que contenga los endpoints y
servicios necesarios para gestionar los productos y carritos de compra en el e-commerce.

#### Los aspectos a incluir son:

- Desarrollar un servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts.

#### Para el manejo de productos, el cual tendrá su router en /api/products/, configurar las siguientes rutas:

1. La ruta raíz GET / deberá listar todos los productos de la base, incluyendo la limitación ?limit.
2. La ruta GET /:pid deberá traer sólo el producto con el id proporcionado. 
3. La ruta raíz POST / deberá agregar un nuevo producto con los campos:
- id: Number/String
- title: String
- description: String
- code: String
- price: Number
- status: Boolean
- stock: Number
- category: String
- thumbnails: Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto.
- Status es true por defecto.
- Todos los campos son obligatorios, a excepción de thumbnails.

4. La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. Nunca se debe actualizar o eliminar el id al momento de hacer dicha actualización.
5. La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.

#### Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas:

1. La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
- Id:Number/String (Autogenerable).
- products: Array que contendrá objetos que representen cada producto.
2. La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
3. La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el
siguiente formato:

- product: Sólo debe contener el id del producto.
- quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
- Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.

La persistencia de la información se implementará utilizando el file system, donde los archivos “productos,json” y “carrito.json”, respaldan la información.

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
