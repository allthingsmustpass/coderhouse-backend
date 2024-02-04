# Product Manager con handlebars + websocket

Esta entrega se trata de integrar vistas y sockets a nuestro servidor actual.

#### Los aspectos a incluir son:

1. Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.

2. Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento.

3. Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.

Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.


#### Proceso de testing:

- [x] Se instalará y correrá el servidor en el puerto indicado.

- [x] El servidor debe levantarse sin problema.

- [x] Se abrirá la ruta raíz `/api/products`

- [x] Debe visualizarse el contenido de la vista index.handlebars, no se debe activar el websocket aún.

- [x] Se buscará en la url del navegador la ruta `/realtimeproducts`.

- [x] Se corroborará que el servidor haya conectado con el cliente, en la consola del servidor deberá mostrarse un mensaje de “cliente conectado”.

- [x] Se debe mostrar la lista de productos y se corroborará que se esté enviando desde websocket.

- [x] Se envió el siguiente objeto, actualizando automáticamente la lista en la ruta `/api/realtimeproducts`

```
{
            "title": "Smartphone XYZ",
            "description": "Powerful smartphone with advanced features.",
            "code": "test",
            "price": 599.99,
            "status": true,
            "stock": 30,
            "category": "Electronics",
            "thumbnails": [
                "xyz789_image1.jpg",
                "xyz789_image2.jpg",
                "xyz789_image3.jpg"
            ]
}
```
## Sugerencias

1. Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.

2. Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?

## Uso
Instalar las dependencias con:
```
npm install
```
Y ejecutar:
```
npm start
```

Ejecutar desde http://localhost:8080/ o cualquier herramienta para testear API's como Postman.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
