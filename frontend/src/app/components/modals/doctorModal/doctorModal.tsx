"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, UserCircle } from "lucide-react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import styles from "./doctorModal.module.scss";

interface Especialidade {
  id: string;
  nome: string;
}

interface Doctor {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  photo: string;
  createdAt: string;
}

interface DoctorFormData {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  photo: string;
}

interface FormErrors {
  nome?: string;
  crm?: string;
  especialidade?: string;
  telefone?: string;
  email?: string;
  photo?: string;
  general?: string;
}

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DoctorFormData) => Promise<void>;
  doctor: Doctor | null;
  isLoading: boolean;
}

const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  doctor,
  isLoading,
}) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    nome: "",
    crm: "",
    especialidade: "",
    telefone: "",
    email: "",
    photo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  // Função para buscar especialidades do backend
  const fetchEspecialidades = async () => {
    setLoadingEspecialidades(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch("http://localhost:4000/api/especialidades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar especialidades");
      }

      const data = await response.json();
      setEspecialidades(data);
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Erro ao carregar especialidades. Por favor, tente novamente.",
      }));
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  // Buscar especialidades quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      fetchEspecialidades();
    }
  }, [isOpen]);

  useEffect(() => {
    if (doctor) {
      setFormData({
        nome: doctor.nome,
        crm: doctor.crm,
        especialidade: doctor.especialidade,
        telefone: doctor.telefone,
        email: doctor.email,
        photo: doctor.photo,
      });
      setPreviewImage(doctor.photo);
    } else {
      setFormData({
        nome: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: "",
        photo: "",
      });
      setPreviewImage(null);
    }
    setErrors({});
  }, [doctor, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Por favor, selecione uma imagem válida",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "A imagem deve ter no máximo 5MB",
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, photo: file.name }));
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.crm) {
      newErrors.crm = "CRM é obrigatório";
    } else if (!/^\d{5,6}$/.test(formData.crm)) {
      newErrors.crm = "CRM inválido (5 ou 6 dígitos)";
    }

    if (!formData.especialidade) {
      newErrors.especialidade = "Especialidade é obrigatória";
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!doctor && !formData.photo && !previewImage) {
      newErrors.photo = "Foto é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Update the photo with the preview image
    const updatedFormData = {
      ...formData,
      photo: previewImage || formData.photo,
    };

    await onSave(updatedFormData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {doctor ? "Editar Médico" : "Novo Médico"}
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
                <p className={styles.photoLabel}>Foto do Médico</p>
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

            <div className={styles.formRow}>
              <Input
                label="CRM"
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                error={errors.crm}
                placeholder="12345"
                required
              />

              <div className={styles.selectContainer}>
                <label className={styles.selectLabel}>Especialidade</label>
                <select
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  className={styles.specialtySelect}
                  required
                  disabled={loadingEspecialidades}
                >
                  <option value="">
                    {loadingEspecialidades
                      ? "Carregando especialidades..."
                      : "Selecione uma especialidade"}
                  </option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.nome}>
                      {esp.nome}
                    </option>
                  ))}
                </select>
                {errors.especialidade && (
                  <p className={styles.error}>{errors.especialidade}</p>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <Input
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                error={errors.telefone}
                placeholder="(11) 98765-4321"
                required
              />

              <Input
                label="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="medico@exemplo.com"
                required
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {doctor ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;
