"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCog,
  CalendarClock,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import DashboardLayout from "./layout/DashboardLayout";
import styles from "./Dashboard.module.scss";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [totalMedicos, setTotalMedicos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para verificar autenticação
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return false;
    }

    try {
      // Verifica se o token é válido
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Se o token for inválido, limpa o localStorage e redireciona
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/auth/login");
        return false;
      }

      return token;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      router.push("/auth/login");
      return false;
    }
  };

  // Função para buscar pacientes
  const fetchPacientes = async () => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/pacientes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          router.push("/auth/login");
          return;
        }
        throw new Error("Erro ao buscar pacientes");
      }

      const data = await response.json();
      setTotalPacientes(data.length);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setError("Erro ao carregar dados");
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // Função para buscar médicos
  const fetchMedicos = async () => {
    try {
      const token = localStorage.getItem("token"); // Obter o token do localStorage
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const response = await fetch("http://localhost:4000/api/medicos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluir o token no cabeçalho
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar médicos.");
      }

      const data = await response.json();
      setTotalMedicos(data.length); // Define o total de médicos
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const stats = [
    {
      title: "Total de Pacientes",
      value: isLoading ? "Carregando..." : error ? "Erro" : totalPacientes,
      change: 12.5,
      icon: <Users size={20} />,
      iconClass: styles.blue,
    },
    {
      title: "Médicos Ativos",
      value: isLoading ? "Carregando..." : error ? "Erro" : totalMedicos,
      change: 2.8,
      icon: <UserCog size={20} />,
      iconClass: styles.purple,
    },
    {
      title: "Consultas Hoje",
      value: 42,
      change: -5.2,
      icon: <CalendarClock size={20} />,
      iconClass: styles.green,
    },
    {
      title: "Prontuários",
      value: 867,
      change: 8.1,
      icon: <FileText size={20} />,
      iconClass: styles.orange,
    },
  ];

  const appointments = [
    {
      time: "09:00",
      patient: "Maria Oliveira",
      doctor: "Dr. Carlos Santos",
      status: "confirmed",
    },
    {
      time: "10:30",
      patient: "João Silva",
      doctor: "Dra. Ana Pereira",
      status: "pending",
    },
    {
      time: "11:45",
      patient: "Luiza Costa",
      doctor: "Dr. Roberto Alves",
      status: "confirmed",
    },
    {
      time: "14:15",
      patient: "Pedro Souza",
      doctor: "Dra. Carla Mendes",
      status: "canceled",
    },
    {
      time: "16:00",
      patient: "Fernanda Lima",
      doctor: "Dr. Paulo Ribeiro",
      status: "confirmed",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className={styles.dashboard}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <h3 className={styles.statTitle}>{stat.title}</h3>
                <div className={`${styles.statIcon} ${stat.iconClass}`}>
                  {stat.icon}
                </div>
              </div>
              <p className={styles.statValue}>{stat.value}</p>
              {!isLoading && !error && (
                <div
                  className={`${styles.statChange} ${
                    stat.change >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {Math.abs(stat.change)}% em relação ao mês anterior
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Consultas Realizadas</h3>
            <div className={styles.chartActions}>
              <button className={`${styles.chartFilter} ${styles.active}`}>
                Semana
              </button>
              <button className={styles.chartFilter}>Mês</button>
              <button className={styles.chartFilter}>Ano</button>
            </div>
          </div>
          <div className={styles.chartContent}>
            <p>Gráfico de consultas realizadas seria exibido aqui</p>
          </div>
        </div>

        <div className={styles.appointmentsSection}>
          <div className={styles.appointmentsHeader}>
            <h3 className={styles.appointmentsTitle}>Consultas de Hoje</h3>
            <Link href="/consultas" className={styles.viewAllLink}>
              Ver todas
            </Link>
          </div>
          <div className={styles.appointmentsList}>
            {appointments.map((appointment, index) => (
              <div key={index} className={styles.appointmentCard}>
                <div className={styles.appointmentTime}>{appointment.time}</div>
                <div className={styles.appointmentInfo}>
                  <h4>{appointment.patient}</h4>
                  <p>{appointment.doctor}</p>
                </div>
                <div
                  className={`${styles.appointmentStatus} ${
                    styles[appointment.status]
                  }`}
                >
                  {appointment.status === "confirmed" && "Confirmada"}
                  {appointment.status === "pending" && "Pendente"}
                  {appointment.status === "canceled" && "Cancelada"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
