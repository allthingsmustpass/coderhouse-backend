import express from 'express';
import upload from '../middlewares/multerConfig.js'; // Importar la configuración de Multer
import User from '../model/users.model.js';

const router = express.Router();

// Ruta para actualizar el rol del usuario a "premium"
router.put('/api/users/:uid/premium', async (req, res) => {
  try {
    const userId = req.params.uid;

    // Obtener el usuario de la base de datos
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

    // Actualizar el rol del usuario a "premium"
    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado a premium' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
});

// Ruta para subir archivos
router.post('/api/users/:uid/documents', upload.array('documents'), async (req, res) => {
  try {
    const userId = req.params.uid;
    const files = req.files;

    // Obtener el usuario de la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar los documentos del usuario
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

export default router;
