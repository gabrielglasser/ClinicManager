"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, UserCircle } from "lucide-react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import { UserType } from "../../../types/user";
import styles from "./UserModal.module.scss";

interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  photo: string;
  createdAt: string;
}

interface UserFormData {
  nome: string;
  email: string;
  tipo: UserType;
  photo: string | File;
}

interface FormErrors {
  nome?: string;
  email?: string;
  tipo?: string;
  photo?: string;
  general?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSuccess?: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: "",
    email: "",
    tipo: "FUNCIONARIO",
    photo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        photo: user.photo,
      });
      setPreviewImage(user.photo);
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Por favor, selecione uma imagem válida",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "A imagem deve ter no máximo 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, photo: file }));
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.tipo) {
      newErrors.tipo = "Tipo de usuário é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("tipo", formData.tipo);

      // Se for um arquivo novo, anexa ao FormData
      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      } else if (typeof formData.photo === "string" && formData.photo) {
        // Se for uma URL existente, mantém a mesma
        formDataToSend.append("photo", formData.photo);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await fetch(
        `http://localhost:4000/api/usuarios/${user?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar usuário");
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      setErrors((prev) => ({
        ...prev,
        general:
          error.message ||
          "Ocorreu um erro ao atualizar o usuário. Tente novamente.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {user ? "Editar Usuário" : "Novo Usuário"}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <div className={styles.modalBody}>
            <div className={styles.photoUpload}>
              <div className={styles.photoPreview}>
                {previewImage ? (
                  <img src={previewImage} alt="Preview" />
                ) : (
                  <UserCircle size={80} />
                )}
              </div>
              <div className={styles.photoUploadControls}>
                <p className={styles.photoLabel}>Foto de Perfil</p>
                <label className={styles.uploadButton}>
                  <Upload size={16} />
                  Selecionar Imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                </label>
                {errors.photo && (
                  <p className={styles.photoError}>{errors.photo}</p>
                )}
              </div>
            </div>

            <Input
              label="Nome Completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              error={errors.nome}
              required
            />

            <Input
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className={styles.formGroup}>
              <label className={styles.selectLabel}>Tipo de Usuário</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="ADMIN">Administrador</option>
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="MEDICO">Médico</option>
              </select>
              {errors.tipo && <p className={styles.error}>{errors.tipo}</p>}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {user ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
