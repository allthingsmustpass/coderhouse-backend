# Product Manager

Esta clase corresponde al primer desafío entregable del curso de Programación Backend en Coderhouse, se trata de una clase "ProductManager" que gestiona un conjunto de productos".

#### Los aspectos a incluir son:

- [x] Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.

- [x] Cada producto que gestione debe contar con las propiedades: title, description, price, thumbnail, code y stock.

- [x] Debe contar con un método "addProduct" el cual agregará un producto al arreglo de productos inicial, validando la unicidad del campo "code" y que no se omita ningún campo.

- [x] Debe contar con un método "getProducts" el cual debe devolver el arreglo con todos los productos creados hasta el momento.

- [x] Debe contar con un método "getProductById" el cual debe buscar dentro del arreglo el producto que coincida con el id, y en caso de que no exista, muestre en consola un error.

## Uso
Sobre el directorio del archivo, ejecutar:
```
node productManager.js
```

## Testing

1. Se creará una instancia de la clase “ProductManager”

2. Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

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

6. Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

7. Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo.


## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
