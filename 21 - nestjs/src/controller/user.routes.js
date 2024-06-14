import express from 'express';
import upload from '../middlewares/multerConfig.js';
import User from '../model/users.model.js';
import Product from '../model/products.model.js';

const router = express.Router();

// Ruta para actualizar el rol del usuario a "premium"
router.put('/users/premium/:uid/', async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ha subido los documentos requeridos
    const requiredDocuments = ['identificacion', 'comprobante_domicilio', 'comprobante_cuenta'];
    const hasUploadedRequiredDocuments = requiredDocuments.every(doc =>
      user.documents.some(d => d.name.includes(doc))
    );

    if (!hasUploadedRequiredDocuments) {
      return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos requeridos' });
    }

    // Actualizar el rol del usuario a "premium" :B
    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado a premium' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
});

// Ruta para subir la documentación para ser 'premium'
router.post('/users/:uid/documents', upload.array('documents'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const files = req.files;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const documents = files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));

    user.documents.push(...documents);
    user.hasUploadedDocuments = true; // Actualizar el estado del usuario
    await user.save();

    res.status(200).json({ message: 'Documentos cargados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar los documentos' });
  }
});

router.post('/users/:uid/profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const file = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    user.profileImage = file.path;
    await user.save();

    res.status(200).json({ message: 'Imagen de perfil cargada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la imagen de perfil' });
  }
});

// Subir imagen del producto 
// Sube correctamente la imagen a uploads/products
//TO DO: Subir una imagen del producto DESDE los productos del usuario y modificar para que exista en el array de imagenes del producto en la vista.
router.post('/products/:pid/image', upload.single('productImage'), async (req, res) => {
  try {
    const productId = req.params.pid;
    const file = req.file;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar la imagen del producto
    product.image = file.path;
    await product.save();

    res.status(200).json({ message: 'Imagen de producto cargada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la imagen del producto' });
  }
});


export default router;
