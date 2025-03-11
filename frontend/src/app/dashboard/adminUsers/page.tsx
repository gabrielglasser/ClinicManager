'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  UserCircle,
  Users
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../../components/button/Button';
import UserModal from '../../components/modals/userModal/userModal';
import DeleteConfirmationModal from '../../components/modals/deleteModal/deleteConfirmationModal';
import { User, UserType } from '../../types/user';
import styles from './AdminUsers.module.scss';

const AdminUsers: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'doctors' | 'staff' | 'admin'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      setError('Falha ao carregar usuários');
      toast.error('Erro ao carregar usuários. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        const usuario = localStorage.getItem("usuario");

        if (!token || !usuario) {
          router.push("/auth/login");
          return;
        }

        const parsedUser = JSON.parse(usuario);
        if (parsedUser.tipo !== "ADMIN") {
          toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
          router.push("/dashboard");
          return;
        }

        // Se chegou aqui, o usuário é ADMIN, então carrega os dados
        loadUsers();
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        router.push("/dashboard");
      }
    };

    checkAdminAccess();
  }, []);

  // Filtrar usuários
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'doctors') return matchesSearch && user.tipo === 'MEDICO';
    if (activeTab === 'staff') return matchesSearch && user.tipo === 'FUNCIONARIO';
    if (activeTab === 'admin') return matchesSearch && user.tipo === 'ADMIN';

    return matchesSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const url = currentUser 
        ? `http://localhost:4000/api/usuarios/${currentUser.id}`
        : "http://localhost:4000/api/usuarios";

      const method = currentUser ? "PUT" : "POST";

      // Criar FormData para enviar a imagem
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("tipo", formData.tipo);

      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      } else if (typeof formData.photo === "string" && formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar usuário");
      }

      toast.success(currentUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      await loadUsers();
      closeModal();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.message || 'Erro ao salvar usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/usuarios/${currentUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir usuário");
      }

      toast.success('Usuário excluído com sucesso!');
      await loadUsers();
      closeDeleteModal();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(error.message || 'Erro ao excluir usuário');
    }
  };

  const getUserTypeClass = (tipo: UserType) => {
    switch (tipo) {
      case 'ADMIN':
        return styles.admin;
      case 'MEDICO':
        return styles.doctor;
      case 'FUNCIONARIO':
        return styles.staff;
      default:
        return '';
    }
  };

  const getUserTypeLabel = (tipo: UserType) => {
    switch (tipo) {
      case 'ADMIN':
        return 'Administrador';
      case 'MEDICO':
        return 'Médico';
      case 'FUNCIONARIO':
        return 'Funcionário';
      default:
        return tipo;
    }
  };

  useEffect(() => {
  }, [activeTab, filteredUsers.length, searchTerm, users]);

  return (
    <DashboardLayout title="Administração de Usuários">
      <div className={styles.adminUsersContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Usuários</h2>
          <Button
            onClick={() => {
              setCurrentUser(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus size={20} />
            Novo Usuário
          </Button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className={`${styles.tab} ${activeTab === 'doctors' ? styles.active : ''}`}
          >
            Médicos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`${styles.tab} ${activeTab === 'staff' ? styles.active : ''}`}
          >
            Funcionários
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`${styles.tab} ${activeTab === 'admin' ? styles.active : ''}`}
          >
            Administradores
          </button>
        </div>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className={styles.card}>
          {filteredUsers.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Tipo</th>
                      <th>E-mail</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                              {user.photo ? (
                                <img src={user.photo} alt={user.nome} />
                              ) : (
                                <UserCircle size={40} />
                              )}
                            </div>
                            <div>
                              <div className={styles.userName}>{user.nome}</div>
                              <div className={styles.userEmail}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.userType} ${getUserTypeClass(user.tipo)}`}>
                            {getUserTypeLabel(user.tipo)}
                          </span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.edit}`}
                              onClick={() => openEditModal(user)}
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => openDeleteModal(user)}
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Mostrando <strong>1-{filteredUsers.length}</strong> de{' '}
                  <strong>{filteredUsers.length}</strong> usuários
                </div>
                <div className={styles.paginationButtons}>
                  <Button
                    variant="outline"
                    disabled
                    className={styles.paginationButton}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="primary"
                    className={`${styles.paginationButton} ${styles.active}`}
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className={styles.paginationButton}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Users size={64} />
              <h3>Nenhum usuário encontrado</h3>
              <p>
                {searchTerm
                  ? `Não encontramos usuários correspondentes à sua busca "${searchTerm}".`
                  : 'Não há usuários cadastrados no sistema.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* User Modal Component */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={currentUser || undefined}
          onSuccess={loadUsers}
        />
      )}
      
      {/* Delete Confirmation Modal Component */}
      {currentUser && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteUser}
          title="Excluir Usuário"
          message={
            <>
              Você está prestes a excluir o usuário <strong>{currentUser.nome}</strong>.
              Esta ação não pode ser desfeita.
            </>
          }
          isLoading={isLoading}
        />
      )}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default AdminUsers;