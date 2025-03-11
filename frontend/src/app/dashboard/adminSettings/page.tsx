'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './adminSettings.module.scss';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../layout/DashboardLayout';
import DeleteConfirmationModal from '../../components/modals/deleteModal/deleteConfirmationModal';

interface Especialidade {
  id: string;
  nome: string;
}

interface Sala {
  id: string;
  numero: number;
}

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'especialidades' | 'salas'>('especialidades');
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Especialidade | Sala | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    numero: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Especialidade | Sala | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

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
        fetchData();
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        router.push("/dashboard");
      }
    };

    checkAdminAccess();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = activeTab === 'especialidades' 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/especialidades`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/salas`;
      
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados');
      }
      
      const data = await response.json();
      
      if (activeTab === 'especialidades') {
        setEspecialidades(data);
      } else {
        setSalas(data);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const baseEndpoint = activeTab === 'especialidades' 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/especialidades`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/salas`;
      
      const endpoint = editingItem 
        ? `${baseEndpoint}/${editingItem.id}`
        : baseEndpoint;
      
      const method = editingItem ? 'PUT' : 'POST';
      const body = activeTab === 'especialidades' 
        ? { nome: formData.nome }
        : { numero: parseInt(formData.numero) };

      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 409) {
          // Erro de conflito (item já existe)
          if (activeTab === 'especialidades') {
            throw new Error(`A especialidade "${formData.nome}" já existe.`);
          } else {
            throw new Error(`A sala ${formData.numero} já existe.`);
          }
        }
        
        throw new Error(errorData.message || 'Erro ao salvar');
      }

      toast.success(editingItem ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!');
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ nome: '', numero: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeletingLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = activeTab === 'especialidades' 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/especialidades`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/salas`;
      
      const response = await fetch(`${endpoint}/${itemToDelete.id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 400) {
          if (activeTab === 'especialidades') {
            throw new Error('Não é possível excluir esta especialidade pois existem consultas vinculadas aos médicos desta especialidade. Por favor, remova ou cancele as consultas antes de excluir a especialidade.');
          } else {
            throw new Error('Não é possível excluir esta sala pois ela está sendo utilizada em consultas.');
          }
        }
        
        throw new Error(errorData.message || 'Erro ao excluir');
      }

      toast.success('Item excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    } finally {
      setIsDeletingLoading(false);
    }
  };

  const handleEdit = (item: Especialidade | Sala) => {
    setEditingItem(item);
    setFormData({
      nome: 'nome' in item ? item.nome : '',
      numero: 'numero' in item ? item.numero.toString() : ''
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (item: Especialidade | Sala) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const filteredItems = activeTab === 'especialidades'
    ? especialidades.filter(esp => esp.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : salas.filter(sala => sala.numero.toString().includes(searchTerm));

  return (
    <DashboardLayout title="Configurações do Sistema">
      <div className={styles.adminSettingsContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Configurações do Sistema</h1>
          <button
            className={styles.addButton}
            onClick={() => {
              setEditingItem(null);
              setFormData({ nome: '', numero: '' });
              setIsModalOpen(true);
            }}
          >
            <FiPlus /> Adicionar {activeTab === 'especialidades' ? 'Especialidade' : 'Sala'}
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'especialidades' ? styles.active : ''}`}
            onClick={() => setActiveTab('especialidades')}
          >
            Especialidades
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'salas' ? styles.active : ''}`}
            onClick={() => setActiveTab('salas')}
          >
            Salas
          </button>
        </div>

        <div className={styles.searchBar}>
          <FiSearch />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={`Buscar ${activeTab === 'especialidades' ? 'especialidade' : 'sala'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{activeTab === 'especialidades' ? 'Nome' : 'Número'}</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {'nome' in item ? item.nome : `Sala ${item.numero}`}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionButton} ${styles.edit}`}
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.delete}`}
                          onClick={() => openDeleteModal(item)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>
                {editingItem ? 'Editar' : 'Adicionar'} {activeTab === 'especialidades' ? 'Especialidade' : 'Sala'}
              </h2>
              <form onSubmit={handleSubmit}>
                {activeTab === 'especialidades' ? (
                  <input
                    type="text"
                    placeholder="Nome da especialidade"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                ) : (
                  <input
                    type="number"
                    placeholder="Número da sala"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    required
                  />
                )}
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit">
                    {editingItem ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Exclusão */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDelete}
          title={activeTab === 'especialidades' ? 'Excluir Especialidade' : 'Excluir Sala'}
          message={
            itemToDelete && (
              <>
                Você está prestes a excluir{' '}
                {'nome' in itemToDelete ? (
                  <>a especialidade <strong>{itemToDelete.nome}</strong></>
                ) : (
                  <>a <strong>Sala {itemToDelete.numero}</strong></>
                )}
                . Esta ação não pode ser desfeita.
              </>
            )
          }
          isLoading={isDeletingLoading}
        />
      </div>
    </DashboardLayout>
  );
}