# Product Manager

Esta clase corresponde al segundo desafío entregable del curso de Programación Backend en Coderhouse, se trata de una clase "ProductManager" que gestiona un conjunto de productos desde una persistencia de archivos.

#### Los aspectos a incluir son:

- [x] La clase debe contar con una variable this path, que se inicializará desde su constructor y recibe la ruta a trabajar desde que se genera su instancia.

- [x] Cada producto que gestione debe contar con las propiedades: title, description, price, thumbnail, code y stock.

- [x] Debe contar con un método "addProduct" el cual agregará un producto al arreglo de productos en el archivo y asignarle una id autoincrementable.

- [x] Debe contar con un método "getProducts" el cual debe devolver en formato de arreglo leyendo el archivo.

- [x] Debe contar con un método "getProductById" el cual recibe un id, y luego de leer el archivo, debe buscar el producto con el id indicado y devolverlo en formato **objeto**.

- [x] Debe contar con un método "updateProduct" el cual recibe un id del producto a actualizar, y debe actualizar el producto que tenga ese id en el archivo **sin borrar su id**.

- [x] Debe contar con un método "deleteProduct" el cual recibe un id del producto a eliminar, y elimina el producto que tenga ese id.

## Uso
Sobre el directorio del archivo, ejecutar:
```
node productManager.js
```

## Testing

1. Se creará una instancia de la clase “ProductManager”

2. Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [].

3. Se llamará al método “addProduct” con los campos:
```
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25
```

4. El objeto debe agregarse satisfactoriamente con un id generado automáticamente **sin repetirse**.

5. Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado.

6. Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.

7. Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

8. Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.


## Licencia

[MIT](https://choosealicense.com/licenses/mit/)