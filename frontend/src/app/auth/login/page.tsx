"use client";

import React, { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import styles from "./Login.module.scss";

interface FormData {
  email: string;
  senha: string;
}

interface FormErrors {
  email?: string;
  senha?: string;
  general?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    senha: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
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
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      if (!data.token || !data.usuario) {
        throw new Error("Resposta inválida do servidor");
      }

      // Salvar token e dados do usuário no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Salvar token no cookie com path e httpOnly
      document.cookie = `token=${data.token}; path=/; SameSite=Strict`;

      // Aguardar um momento para garantir que os dados foram salvos
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verificar se os dados foram salvos
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("usuario");

      if (!savedToken || !savedUser) {
        throw new Error("Falha ao salvar dados de autenticação");
      }

      // Redirecionar para o dashboard usando replace para evitar voltar ao login
      router.replace("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>ClinicManager</h1>
          <p className={styles.subtitle}>Faça login para acessar o sistema</p>
        </div>

        {errors.general && (
          <div className={styles.errorAlert}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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

          {/* <div className={styles.forgotPassword}>
            <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
          </div> */}

          <Button type="submit" fullWidth isLoading={isLoading}>
            <LogIn size={20} className={styles.buttonIcon} />
            Entrar
          </Button>
        </form>

        <div className={styles.registerLink}>
          Não tem uma conta? <Link href="/auth/register">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
