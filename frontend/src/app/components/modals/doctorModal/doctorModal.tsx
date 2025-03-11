"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, UserCircle } from "lucide-react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import styles from "./doctorModal.module.scss";
import Image from 'next/image';

interface Especialidade {
  id: string;
  nome: string;
}

interface Doctor {
  id: string;
  nome: string;
  crm: string;
  especialidade: Especialidade;
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/especialidades`, {
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
        especialidade: doctor.especialidade.id,
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

  // Adicionar função para formatar telefone
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    // Limita a 11 dígitos
    const phone = numbers.slice(0, 11);

    // Verifica se é celular (11 dígitos) ou telefone fixo (10 dígitos)
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3");
    }
    return phone.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação para o telefone
    if (name === "telefone") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro do campo quando ele for alterado
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      // Converter a imagem para Base64
      const base64Image = await convertToBase64(file);
      setPreviewImage(base64Image as string);
      setFormData((prev) => ({ ...prev, photo: base64Image as string }));
      setErrors((prev) => ({ ...prev, photo: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, photo: "Erro ao processar a imagem" }));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.crm?.trim()) {
      newErrors.crm = "CRM é obrigatório";
    } else if (!/^\d{5,6}$/.test(formData.crm.replace(/\D/g, ""))) {
      newErrors.crm = "CRM deve conter 5 ou 6 dígitos";
    }

    if (!formData.especialidade) {
      newErrors.especialidade = "Especialidade é obrigatória";
    }

    if (!formData.telefone?.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else {
      const numerosTelefone = formData.telefone.replace(/\D/g, "");
      if (numerosTelefone.length < 10 || numerosTelefone.length > 11) {
        newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos";
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
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
                  <Image src={previewImage} alt="Preview" />
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
                    <option key={esp.id} value={esp.id}>
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
