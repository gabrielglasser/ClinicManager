"use client"

import React, { useState } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Upload, UserCircle } from 'lucide-react'; 
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import styles from './Register.module.scss'; 
import { UserType, User } from '../../types/user'; // Importando os tipos

interface FormData {
  nome: string;
  email: string;
  senha: string; 
  confirmarSenha: string; 
  tipo: UserType; // Usando UserType aqui
  photo: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string; 
  confirmarSenha?: string; 
  photo?: string;
  general?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '', 
    confirmarSenha: '', 
    tipo: 'FUNCIONARIO', 
    photo: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!file.type.match('image.*')) {
      setErrors((prev) => ({ ...prev, photo: 'Por favor, selecione uma imagem válida' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'A imagem deve ter no máximo 5MB' }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // In a real app, you would upload the image to a server and get a URL
    // For now, we'll just store the file name
    setFormData((prev) => ({ ...prev, photo: file.name }));
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (!formData.photo) {
      newErrors.photo = 'Foto de perfil é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { confirmarSenha, ...usuarioData } = formData;

      // Criar um objeto FormData para enviar a imagem
      const formDataToSend = new FormData();
      formDataToSend.append('nome', usuarioData.nome);
      formDataToSend.append('email', usuarioData.email);
      formDataToSend.append('senha', usuarioData.senha);
      formDataToSend.append('tipo', usuarioData.tipo);

      // Adicionar a imagem ao FormData
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataToSend.append('photo', fileInput.files[0]);
      }

      // Fazer a requisição POST para a API
      const response = await fetch('http://localhost:4000/api/usuarios', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar o cadastro');
      }

      // Usar a interface User para tipar a resposta
      const newUser: User = data;

      // Redirecionar para o login após cadastro bem-sucedido
      router.push('/auth/login'); 
    } catch (error) {
      setErrors({ general: error.message || 'Falha ao realizar o cadastro. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>Preencha os dados para se cadastrar</p>
        </div>

        {errors.general && (
          <div className={styles.errorAlert}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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
              {errors.photo && <p className={styles.photoError}>{errors.photo}</p>}
            </div>
          </div>

          <Input
            label="Nome Completo"
            type="text"
            name="nome"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={handleChange}
            icon={<UserIcon size={20} />} 
            error={errors.nome}
            required
          />

          <Input
            label="E-mail"
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={20} />}
            error={errors.email}
            required
          />

          <div className={styles.formRow}>
            <Input
              label="Senha"
              type="password"
              name="senha"
              placeholder="Sua senha"
              value={formData.senha}
              onChange={handleChange}
              icon={<Lock size={20} />}
              error={errors.senha}
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              icon={<Lock size={20} />}
              error={errors.confirmarSenha}
              required
            />
          </div>

          <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>Tipo de Usuário</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="ADMIN">Administrador</option>
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="MEDICO">Médico</option>
            </select>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Criar Conta
          </Button>
        </form>

        <div className={styles.loginLink}>
          Já tem uma conta? <Link href="/auth/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;