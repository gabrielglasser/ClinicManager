'use client';

import React, { useState, useEffect } from 'react';
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
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../../components/button/Button';
import DoctorModal from '../../components/modals/doctorModal/doctorModal';
import DeleteConfirmationModal from '../../components/modals/deleteModal/deleteConfirmationModal';
import styles from './doctors.module.scss';
import { useRouter } from 'next/navigation';

interface Especialidade {
  id: string;
  nome: string;
}

interface Doctor {
  id: string;
  nome: string;
  crm: string;
  especialidade: Especialidade;
  telefone: string;
  email: string;
  photo: string;
  createdAt: string;
}

interface DoctorFormData {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  photo: string;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, "");
    
    // Verifica se é celular (11 dígitos) ou telefone fixo (10 dígitos)
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
  };

  // Função para buscar médicos
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/medicos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar médicos ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchDoctors();
  }, [router]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.crm.includes(searchTerm) ||
      doctor.especialidade.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setCurrentDoctor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsModalOpen(true);
  };

  const openDeleteModal = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSaveDoctor = async (formData: DoctorFormData) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("Token não encontrado");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      const telefoneNumerico = formData.telefone.replace(/\D/g, "");

      // Criar FormData para enviar os dados
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('crm', formData.crm);
      formDataToSend.append('especialidadeId', formData.especialidade);
      formDataToSend.append('telefone', telefoneNumerico);
      formDataToSend.append('email', formData.email);

      // Se houver uma foto, adiciona ao FormData
      if (formData.photo) {
        // Se a foto for uma string base64, converte para Blob
        if (formData.photo.startsWith('data:image')) {
          const response = await fetch(formData.photo);
          const blob = await response.blob();
          formDataToSend.append('photo', blob, 'photo.jpg');
        } else {
          formDataToSend.append('photo', formData.photo);
        }
      }

      console.log('Dados a serem enviados:', Object.fromEntries(formDataToSend)); // Debug

      const url = currentDoctor 
        ? `http://localhost:4000/api/medicos/${currentDoctor.id}`
        : "http://localhost:4000/api/medicos";

      const method = currentDoctor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resposta do servidor:", errorData);
        throw new Error(errorData.message || `Erro ao ${currentDoctor ? 'atualizar' : 'criar'} médico`);
      }

      await fetchDoctors();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar médico:", error);
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!currentDoctor) return;

    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4000/api/medicos/${currentDoctor.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar médico");

      await fetchDoctors();
      closeDeleteModal();
    } catch (error) {
      console.error("Erro ao deletar médico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Médicos">
      <div className={styles.doctorsContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Médicos</h2>
          <Button onClick={openAddModal}>
            <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
            Novo Médico
          </Button>
        </div>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome, CRM ou especialidade..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className={styles.card}>
          {filteredDoctors.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Médico</th>
                      <th>CRM</th>
                      <th>Especialidade</th>
                      <th>Contato</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={styles.avatar}>
                              {doctor.photo ? (
                                <img src={doctor.photo} alt={doctor.nome} />
                              ) : (
                                <UserCircle size={40} />
                              )}
                            </div>
                            <div style={{ marginLeft: '0.75rem' }}>
                              <div className={styles.doctorName}>{doctor.nome}</div>
                              <div className={styles.doctorInfo}>{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{doctor.crm}</td>
                        <td>
                          <span className={styles.specialty}>
                            {doctor.especialidade.nome}
                          </span>
                        </td>
                        <td>{formatPhone(doctor.telefone)}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.edit}`}
                              onClick={() => openEditModal(doctor)}
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => openDeleteModal(doctor)}
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
                  Mostrando <strong>1-{filteredDoctors.length}</strong> de <strong>{filteredDoctors.length}</strong> médicos
                </div>
                <div className={styles.paginationButtons}>
                  <button className={styles.paginationButton} disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button className={`${styles.paginationButton} ${styles.active}`}>1</button>
                  <button className={styles.paginationButton} disabled>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Users size={64} />
              <h3>Nenhum médico encontrado</h3>
              <p>
                {searchTerm
                  ? `Não encontramos médicos correspondentes à sua busca "${searchTerm}".`
                  : 'Você ainda não cadastrou nenhum médico. Comece adicionando seu primeiro médico.'}
              </p>
              <Button onClick={openAddModal}>
                <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
                Adicionar Médico
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Doctor Modal Component */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveDoctor}
        doctor={currentDoctor}
        isLoading={isLoading}
      />
      
      {/* Delete Confirmation Modal Component */}
      {currentDoctor && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteDoctor}
          title="Excluir Médico?"
          message={
            <>
              Você está prestes a excluir o médico <strong>{currentDoctor.nome}</strong>. Esta ação não pode ser desfeita.
            </>
          }
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Doctors;