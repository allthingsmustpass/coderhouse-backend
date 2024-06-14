### Test realizados.

1. Ruta `POST /api/users/:uid/documents`
- Reemplazar `:uid` por el ID del usuario que requiera la documentación.

- Subir mediante Postman utlizando **form-data** y una key **documents** los documentos `identificación`, `comprobante_domicilo`, `comprobante_cuenta`.

- Enviar la solicitud.


2. Ruta `PUT /api/users/:uid/premium:`
- Reemplazar `:uid` por el ID del usuario a actualizar a 'premium'.

En caso de tener los documentos cargados, se actualiza el estado del usuario a premium. De lo contrario, se devuelve un error. Además en caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devuelve un error
indicando que el usuario no ha terminado de procesar su documentación.

- Enviar la solicitud.

3. Ruta `POST /users/:uid/profile-image`
- Reemplazar `:uid` por el ID del usuario a cargar la imagen de perfil.

- Enviar la solicitud.

- Se añadió el campo `profileImage: { type: String }` en el modelo de usuario para que exista dentro de ese usuario.


4. Ruta `POST /products/:pid/image`
- Reemplazar `:pid` por el ID de la imagen del producto a subir.

- Sube correctamente desde Multer a `uploads/products`. 

- Enviar la solicitud.

