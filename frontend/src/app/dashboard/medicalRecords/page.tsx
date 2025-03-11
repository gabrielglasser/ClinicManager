'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  UserCircle,
  FilePlus
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../../components/button/Button';
import MedicalRecordModal from '../../components/modals/medicalRecordMoral/medicalRecordModal';
import DeleteConfirmationModal from '../../components/modals/deleteModal/deleteConfirmationModal';
import styles from './MedicalRecords.module.scss';
import Image from 'next/image';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

interface MedicalRecord {
  id: string;
  pacienteId: string;
  historico: string;
  createdAt: string;
  updatedAt: string;
  paciente: {
    id: string;
    nome: string;
    photo: string;
  };
}

interface MedicalRecordFormData {
  pacienteId: string;
  historico: string;
}

const MedicalRecords: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Carregar prontuários
  const fetchMedicalRecords = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/prontuarios`, getAuthHeader());
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Erro ao carregar prontuários:', error);
      setError('Erro ao carregar prontuários. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Filtrar prontuários baseado no termo de busca
  const filteredRecords = medicalRecords.filter(
    (record) =>
      (record.paciente?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.historico || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setCurrentRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record: MedicalRecord) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const openDeleteModal = (record: MedicalRecord) => {
    setCurrentRecord(record);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSaveMedicalRecord = async (formData: MedicalRecordFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentRecord) {
        // Atualizar prontuário existente
        await axios.put(
          `${API_URL}/prontuarios/${currentRecord.id}`,
          { historico: formData.historico },
          getAuthHeader()
        );
      } else {
        // Criar novo prontuário
        try {
          await axios.post(`${API_URL}/prontuarios`, formData, getAuthHeader());
        } catch (error: any) {
          if (error.response?.status === 400 && error.response?.data?.code === 'P2002') {
            setError('Este paciente já possui um prontuário cadastrado.');
            setIsLoading(false);
            return;
          }
          throw error;
        }
      }
      
      await fetchMedicalRecords();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error);
      setError('Erro ao salvar prontuário. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedicalRecord = async () => {
    if (!currentRecord) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}/prontuarios/${currentRecord.id}`, getAuthHeader());
      await fetchMedicalRecords();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir prontuário:', error);
      setError('Erro ao excluir prontuário. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return format(parseISO(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  return (
    <DashboardLayout title="Prontuários">
      <div className={styles.medicalRecordsContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Prontuários</h2>
          <Button onClick={openAddModal}>
            <FilePlus size={18} style={{ marginRight: '0.5rem' }} />
            Novo Prontuário
          </Button>
        </div>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por paciente ou conteúdo..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <div className={styles.card}>
          {filteredRecords.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Histórico</th>
                      <th>Última Atualização</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className={styles.patientInfo}>
                            <div className={styles.avatar}>
                              {record.paciente?.photo ? (
                                <Image src={record.paciente.photo} alt={record.paciente.nome || 'Paciente'} />
                              ) : (
                                <UserCircle size={40} />
                              )}
                            </div>
                            <div>
                              <div className={styles.patientName}>{record.paciente?.nome || 'Paciente sem nome'}</div>
                              <div className={styles.patientDetails}>
                                Prontuário criado em {format(parseISO(record.createdAt), 'dd/MM/yyyy')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.historico}>{record.historico || 'Sem histórico'}</div>
                        </td>
                        <td>
                          <div className={styles.date}>{formatDate(record.updatedAt)}</div>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.view}`}
                              onClick={() => openEditModal(record)}
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.edit}`}
                              onClick={() => openEditModal(record)}
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => openDeleteModal(record)}
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
                  Mostrando <strong>1-{filteredRecords.length}</strong> de{' '}
                  <strong>{filteredRecords.length}</strong> prontuários
                </div>
                <div className={styles.paginationButtons}>
                  <button className={styles.paginationButton} disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button className={`${styles.paginationButton} ${styles.active}`}>
                    1
                  </button>
                  <button className={styles.paginationButton} disabled>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <FileText size={64} />
              <h3>Nenhum prontuário encontrado</h3>
              <p>
                {searchTerm
                  ? `Não encontramos prontuários correspondentes à sua busca "${searchTerm}".`
                  : 'Você ainda não cadastrou nenhum prontuário. Comece adicionando seu primeiro prontuário.'}
              </p>
              <Button onClick={openAddModal}>
                <FilePlus size={18} style={{ marginRight: '0.5rem' }} />
                Adicionar Prontuário
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Medical Record Modal Component */}
      <MedicalRecordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveMedicalRecord}
        medicalRecord={currentRecord}
        isLoading={isLoading}
      />
      
      {/* Delete Confirmation Modal Component */}
      {currentRecord && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteMedicalRecord}
          title="Excluir Prontuário?"
          message={
            <>
              Você está prestes a excluir o prontuário de{' '}
              <strong>{currentRecord.paciente.nome}</strong>. Esta ação não pode ser
              desfeita.
            </>
          }
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default MedicalRecords;