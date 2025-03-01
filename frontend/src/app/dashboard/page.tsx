"use client";

import React from "react";
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
import { useState, useEffect } from "react";

const Dashboard: React.FC = () => {
  const [totalPacientes, setTotalPacientes] = useState();

  


  const stats = [
    {
      title: "Total de Pacientes",
      value: 1248,
      change: 12.5,
      icon: <Users size={20} />,
      iconClass: styles.blue,
    },
    {
      title: "Médicos Ativos",
      value: 36,
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
                <span>{Math.abs(stat.change)}% em relação ao mês anterior</span>
              </div>
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
