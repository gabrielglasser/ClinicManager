"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, UserCircle } from "lucide-react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import styles from "./patientModal.module.scss";


interface Patient {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  photo: string;
  createdAt: string;
}

interface PatientFormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  photo: string;
}

interface FormErrors {
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  telefone?: string;
  endereco?: string;
  photo?: string;
}

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PatientFormData) => Promise<void>;
  patient: Patient | null;
  isLoading: boolean;
}

const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patient,
  isLoading,
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    endereco: "",
    photo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (patient) {
      // Ajusta a data para considerar o fuso horário local
      const adjustedDate = new Date(patient.dataNascimento);
      const formattedDate = adjustedDate.toISOString().split("T")[0];

      setFormData({
        nome: patient.nome,
        cpf: patient.cpf,
        dataNascimento: formattedDate,
        telefone: patient.telefone,
        endereco: patient.endereco,
        photo: patient.photo,
      });
      setPreviewImage(patient.photo);
    } else {
      setFormData({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        endereco: "",
        photo: "",
      });
      setPreviewImage(null);
    }
    setErrors({});
  }, [patient, isOpen]);

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

  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    // Limita a 11 dígitos
    const cpf = numbers.slice(0, 11);
    // Aplica a máscara
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const isEditing = !!patient;

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    // Validação mais rigorosa do CPF
    if (!isEditing && !formData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (formData.cpf) {
      const cpfNumbers = formData.cpf.replace(/\D/g, "");
      if (cpfNumbers.length !== 11) {
        newErrors.cpf = "CPF deve conter 11 dígitos";
      } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
        newErrors.cpf = "Formato de CPF inválido";
      }
    }

    // Validar data de nascimento apenas se estiver criando ou se o campo foi modificado
    if (!isEditing && !formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else if (formData.dataNascimento) {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dataNascimento = "Data de nascimento não pode ser futura";
      }
    }

    // Validação mais rigorosa do telefone
    if (!isEditing && !formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone) {
      const phoneNumbers = formData.telefone.replace(/\D/g, "");
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.telefone = "Telefone deve conter 10 ou 11 dígitos";
      } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
        newErrors.telefone = "Formato de telefone inválido";
      }
    }

    // Validar endereço apenas se estiver criando ou se o campo foi modificado
    if (!isEditing && !formData.endereco?.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Se for edição, enviar todos os campos necessários
      if (patient) {
        const updatedFormData = {
          ...formData,
          photo: previewImage || formData.photo,
        };
        await onSave(updatedFormData);
      } else {
        // Se for criação, enviar todos os campos
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {patient ? "Editar Paciente" : "Novo Paciente"}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                <p className={styles.photoLabel}>Foto do Paciente</p>
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
              required={!patient}
            />

            <div className={styles.formRow}>
              <Input
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                error={errors.cpf}
                placeholder="123.456.789-00"
                required={!patient}
              />

              <Input
                label="Data de Nascimento"
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                error={errors.dataNascimento}
                required={!patient}
              />
            </div>

            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              error={errors.telefone}
              placeholder="(11) 98765-4321"
              required={!patient}
            />

            <Input
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              error={errors.endereco}
              required={!patient}
            />
          </div>

          <div className={styles.modalFooter}>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {patient ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
