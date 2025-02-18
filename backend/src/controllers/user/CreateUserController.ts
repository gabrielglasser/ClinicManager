import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";
import { UploadedFile } from "express-fileupload";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, type, photo } = req.body;

    const createUserService = new CreateUserService();

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error("No files were uploaded.");
    } else {
      const fileData = req.files["file"];
      const file: UploadedFile = Array.isArray(fileData) ? fileData[0] : fileData;


      const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, function (err, result) {
            if (err) {
               reject(err);
               return;
            }

            resolve(result);
          })
          .end(file.data);
      });

      const user = await createUserService.execute({
        name,
        email,
        password,
        type,
        photo: resultFile.url,
      });

      return res.json(user);
    }
  }
}

export { CreateUserController };
