import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarClock,
  FileText,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // Buscar dados do usuário do localStorage
  const usuario = JSON.parse(
    localStorage.getItem("usuario") ??
      '{"nome": "Usuário", "tipo": "Tipo", "photo": ""}'
  );

  const handleLogout = async () => {
    try {
      // Limpar o token e os dados do usuário do localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      // Redirecionar para a página de login
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Caso ocorra um erro, ainda assim limpe o token e redirecione
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      router.push("/auth/login");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.logo}>
        <h2>ClinicManager</h2>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <h3>Principal</h3>
          <Link
            href="/dashboard"
            className={`${styles.navLink} ${
              isActive("/dashboard") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <LayoutDashboard size={20} className={styles.icon} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/pacientes"
            className={`${styles.navLink} ${
              isActive("/pacientes") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Users size={20} className={styles.icon} />
            <span>Pacientes</span>
          </Link>

          <Link
            href="/medicos"
            className={`${styles.navLink} ${
              isActive("/medicos") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <UserCog size={20} className={styles.icon} />
            <span>Médicos</span>
          </Link>

          <Link
            href="/consultas"
            className={`${styles.navLink} ${
              isActive("/consultas") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <CalendarClock size={20} className={styles.icon} />
            <span>Consultas</span>
          </Link>

          <Link
            href="/prontuarios"
            className={`${styles.navLink} ${
              isActive("/prontuarios") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <FileText size={20} className={styles.icon} />
            <span>Prontuários</span>
          </Link>
        </div>

        <div className={styles.navSection}>
          <h3>Sistema</h3>
          <Link
            href="/usuarios"
            className={`${styles.navLink} ${
              isActive("/usuarios") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Users size={20} className={styles.icon} />
            <span>Usuários</span>
          </Link>

          <Link
            href="/configuracoes"
            className={`${styles.navLink} ${
              isActive("/configuracoes") ? styles.active : ""
            }`}
            onClick={onClose}
          >
            <Settings size={20} className={styles.icon} />
            <span>Configurações</span>
          </Link>
        </div>
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          {usuario.photo ? (
            <img src={usuario.photo} alt={usuario.nome} />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className={styles.userInfo}>
          <h4>{usuario.nome}</h4>
          <p>{usuario.tipo}</p>
        </div>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <LogOut size={20} className={styles.icon} />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default Sidebar;
