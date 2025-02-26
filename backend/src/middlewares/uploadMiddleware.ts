import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

// Configuração do Multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

export const uploadMiddleware = upload.single('photo');

export const handleUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    // Faz o upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'clinica-hospitalar', // Pasta no Cloudinary
    });

    // Adiciona a URL da imagem ao corpo da requisição
    req.body.photo = result.secure_url;

    fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
};