import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

// Configuração do Multer para armazenar arquivos na memória
const storage = multer.memoryStorage(); // Armazena o arquivo na memória
const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single('photo');

export const handleUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    // Converte o buffer do arquivo em uma string base64
    const fileBase64 = req.file.buffer.toString('base64');
    const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Faz o upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload(fileDataUri, {
      folder: 'clinica-hospitalar', // Pasta no Cloudinary
    });

    // Adiciona a URL da imagem ao corpo da requisição
    req.body.photo = result.secure_url;

    next();
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
};