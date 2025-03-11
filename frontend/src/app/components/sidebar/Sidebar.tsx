import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import UserModal from "../modals/userModal/userModal";
import { useState } from "react";
import { UserType } from "../../types/user";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  photo: string;
  createdAt: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);

  // Função para verificar autenticação
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return false;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
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

  // Função para buscar dados atualizados do usuário
  const fetchUserData = async () => {
    try {
      const token = await checkAuth();
      if (!token) return;

      const storedUser = localStorage.getItem("usuario");
      if (!storedUser) {
        router.push("/auth/login");
        return;
      }

      // Primeiro tenta pegar do localStorage
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);

      // Depois busca dados atualizados da API
      const response = await fetch(
        `http://localhost:4000/api/usuarios/${parsedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          router.push("/auth/login");
          return;
        }
        throw new Error("Falha ao buscar dados do usuário");
      }

      const userData = await response.json();
      setUsuario(userData);

      // Atualiza o localStorage com os dados mais recentes
      localStorage.setItem("usuario", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      if (error instanceof Error && error.message.includes("401")) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/auth/login");
      }
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:4000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      // Limpar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      
      // Limpar cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Limpar dados mesmo em caso de erro
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      router.push("/auth/login");
    }
  };

  const handleEditProfile = () => {
    setIsUserModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchUserData(); // Busca dados atualizados após edição
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
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
              href="/dashboard/patients"
              className={`${styles.navLink} ${
                isActive("/dashboard/patients") ? styles.active : ""
              }`}
              onClick={onClose}
            >
              <Users size={20} className={styles.icon} />
              <span>Pacientes</span>
            </Link>

            <Link
              href="/dashboard/doctors"
              className={`${styles.navLink} ${
                isActive("/dashboard/doctors") ? styles.active : ""
              }`}
              onClick={onClose}
            >
              <UserCog size={20} className={styles.icon} />
              <span>Médicos</span>
            </Link>

            <Link
              href="/dashboard/appointments"
              className={`${styles.navLink} ${
                isActive("/dashboard/appointments") ? styles.active : ""
              }`}
              onClick={onClose}
            >
              <CalendarClock size={20} className={styles.icon} />
              <span>Consultas</span>
            </Link>

            <Link
              href="/dashboard/medicalRecords"
              className={`${styles.navLink} ${
                isActive("/dashboard/medicalRecords") ? styles.active : ""
              }`}
              onClick={onClose}
            >
              <FileText size={20} className={styles.icon} />
              <span>Prontuários</span>
            </Link>
          </div>

          <div className={styles.navSection}>
            <h3>Sistema</h3>
            {usuario?.tipo === 'ADMIN' && (
              <Link
                href="/dashboard/adminUsers"
                className={`${styles.navLink} ${
                  isActive("/dashboard/adminUsers") ? styles.active : ""
                }`}
                onClick={onClose}
              >
                <Users size={20} className={styles.icon} />
                <span>Usuários</span>
              </Link>
            )}

            {usuario?.tipo === 'ADMIN' && (
              <Link
                href="/dashboard/adminSettings"
                className={`${styles.navLink} ${
                  isActive("/dashboard/adminSettings") ? styles.active : ""
                }`}
                onClick={onClose}
              >
                <Settings size={20} className={styles.icon} />
                <span>Configurações</span>
              </Link>
            )}
          </div>
        </nav>

        <div className={styles.userSection} onClick={handleEditProfile}>
          <div className={styles.userAvatar}>
            {usuario?.photo ? (
              <img src={usuario.photo} alt={usuario.nome} />
            ) : (
              <User size={24} />
            )}
          </div>
          <div className={styles.userInfo}>
            <h4>{usuario?.nome || "Usuário"}</h4>
            <p>{usuario?.tipo || "Tipo"}</p>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} className={styles.icon} />
          <span>Sair</span>
        </button>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={usuario || undefined}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default Sidebar;
