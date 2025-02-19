"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Activity, 
  ClipboardList,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import styles from './page.module.scss';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${styles.dashboard} ${isDarkMode ? styles.darkMode : ''} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
      {/* Mobile Menu Button */}
      <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏥</span>
          <span className={styles.logoText}>ClinicManager</span>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.navSection}>
            <h3>GERAL</h3>
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </a>
            <a href="#" className={styles.navItem}>
              <Activity size={20} />
              <span>Atividades</span>
            </a>
            <a href="#" className={styles.navItem}>
              <Calendar size={20} />
              <span>Consultas</span>
            </a>
            <a href="#" className={styles.navItem}>
              <ClipboardList size={20} />
              <span>Agenda</span>
            </a>
          </div>

          <div className={styles.navSection}>
            <h3>SISTEMA</h3>
            <a href="#" className={styles.navItem}>
              <HelpCircle size={20} />
              <span>Ajuda</span>
            </a>
            <a href="#" className={styles.navItem}>
              <Settings size={20} />
              <span>Configurações</span>
            </a>
          </div>

          <a href="#" className={`${styles.navItem} ${styles.logout}`}>
            <LogOut size={20} />
            <span>Sair</span>
          </a>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input type="text" placeholder="Pesquisar..." />
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={styles.notificationBtn}>
              <Bell size={20} />
            </button>
            <div className={styles.userProfile}>
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop" 
                   alt="Dra. Alice" 
                   className={styles.avatar} />
              <div className={styles.userInfo}>
                <h4>Dra. Alice</h4>
                <p>Cardiologista</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {/* Welcome Section */}
          <section className={styles.welcomeSection}>
            <div className={styles.welcomeText}>
              <h1>Olá, Dra. Alice</h1>
              <p>Ajude quem precisa do seu cuidado!</p>
            </div>
          </section>

          {/* Stats Cards */}
          <section className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={`${styles.statIcon} ${styles.patients}`}>👥</span>
                <span className={styles.statLabel}>Total de Pacientes</span>
              </div>
              <div className={styles.statValue}>831</div>
              <div className={`${styles.statTrend} ${styles.positive}`}>+20% desde a última semana</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={`${styles.statIcon} ${styles.recovered}`}>🌟</span>
                <span className={styles.statLabel}>Recuperados</span>
              </div>
              <div className={styles.statValue}>627</div>
              <div className={`${styles.statTrend} ${styles.positive}`}>+15% desde a última semana</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={`${styles.statIcon} ${styles.operations}`}>⚕️</span>
                <span className={styles.statLabel}>Cirurgias</span>
              </div>
              <div className={styles.statValue}>199</div>
              <div className={`${styles.statTrend} ${styles.positive}`}>+25% desde a última semana</div>
            </div>
          </section>

          {/* Appointments Section */}
          <section className={styles.appointmentsSection}>
            <div className={styles.appointmentsHeader}>
              <h2>Consultas de Hoje</h2>
              <span className={styles.date}>11 de Outubro, 2022</span>
            </div>
            <div className={styles.appointmentsList}>
              <div className={styles.appointmentItem}>
                <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=50&auto=format&fit=crop" 
                     alt="Paciente" 
                     className={styles.patientAvatar} />
                <div className={styles.appointmentInfo}>
                  <h4>João Silva</h4>
                  <p>09:00 - 09:30</p>
                </div>
                <span className={styles.appointmentType}>Check-up</span>
              </div>

              <div className={styles.appointmentItem}>
                <img src="https://images.unsplash.com/photo-1625498542602-6bfb30f39b3f?q=80&w=50&auto=format&fit=crop" 
                     alt="Paciente" 
                     className={styles.patientAvatar} />
                <div className={styles.appointmentInfo}>
                  <h4>Maria Santos</h4>
                  <p>11:00 - 11:30</p>
                </div>
                <span className={styles.appointmentType}>Consulta</span>
              </div>

              <div className={styles.appointmentItem}>
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=50&auto=format&fit=crop" 
                     alt="Paciente" 
                     className={styles.patientAvatar} />
                <div className={styles.appointmentInfo}>
                  <h4>Pedro Oliveira</h4>
                  <p>14:00 - 14:30</p>
                </div>
                <span className={styles.appointmentType}>Retorno</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;