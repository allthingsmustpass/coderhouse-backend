# Product Manager con handlebars + websocket

Esta entrega se trata de integrar mongoose al proyecto, modificando los managers para que la persistencia, además de file system, sea en la base de datos.

#### Los aspectos a incluir son:

1. Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto. 

2. Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
3. Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase.

4. Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”.

5. Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem.

6. NO ELIMINAR FileSystem de tu proyecto.

7. Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El
formato es: {user:correoDelUsuario, message: mensaje del usuario}

8. Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

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
