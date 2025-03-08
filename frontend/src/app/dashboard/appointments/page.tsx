'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CalendarPlus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../../components/button/Button';
import AppointmentModal from '../../components/modals/appointmentModal/appointmentModal';
import DeleteConfirmationModal from '../../components/modals/deleteModal/deleteConfirmationModal';
import styles from './Appointments.module.scss';

interface Doctor {
  id: string;
  nome: string;
  especialidade: {
    id: string;
    nome: string;
  };
}

interface Patient {
  id: string;
  nome: string;
}

interface Appointment {
  id: string;
  pacienteId: string;
  medicoId: string;
  data: string;
  salaId: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentFormData {
  pacienteId: string;
  medicoId: string;
  data: string;
  hora: string;
  salaId: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const doctorIds = new Set(appointments.map(a => a.medicoId));
      const patientIds = new Set(appointments.map(a => a.pacienteId));
      
      fetchDoctors(Array.from(doctorIds));
      fetchPatients(Array.from(patientIds));
    }
  }, [appointments]);

  const fetchDoctors = async (ids: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const promises = ids.map(id =>
        fetch(`http://localhost:4000/api/medicos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json())
      );

      const doctorsData = await Promise.all(promises);
      const doctorsMap = doctorsData.reduce((acc, doctor) => {
        acc[doctor.id] = doctor;
        return acc;
      }, {} as Record<string, Doctor>);

      setDoctors(doctorsMap);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const fetchPatients = async (ids: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const promises = ids.map(id =>
        fetch(`http://localhost:4000/api/pacientes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json())
      );

      const patientsData = await Promise.all(promises);
      const patientsMap = patientsData.reduce((acc, patient) => {
        acc[patient.id] = patient;
        return acc;
      }, {} as Record<string, Patient>);

      setPatients(patientsMap);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:4000/api/consultas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar consultas');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Resposta da API não é um array:', data);
        setError('Formato de dados inválido');
        setAppointments([]);
        return;
      }

      setAppointments(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      setError('Não foi possível carregar as consultas. Por favor, tente novamente.');
      setAppointments([]);
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) => {
      const doctorName = doctors[appointment.medicoId]?.nome?.toLowerCase() || '';
      const patientName = patients[appointment.pacienteId]?.nome?.toLowerCase() || '';
      const searchTermLower = searchTerm.toLowerCase();
      
      return doctorName.includes(searchTermLower) || patientName.includes(searchTermLower);
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setCurrentAppointment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const openDeleteModal = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setError(null);
  };

  const handleSaveAppointment = async (formData: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const url = currentAppointment
        ? `http://localhost:4000/api/consultas/${currentAppointment.id}`
        : 'http://localhost:4000/api/consultas';
      
      // Combina data e hora em um único campo DateTime
      const [year, month, day] = formData.data.split('-').map(Number);
      const [hours, minutes] = formData.hora.split(':').map(Number);
      const dateTime = new Date(year, month - 1, day, hours, minutes);

      const payload = {
        pacienteId: formData.pacienteId,
        medicoId: formData.medicoId,
        salaId: formData.salaId,
        data: dateTime.toISOString()
      };
      
      const response = await fetch(url, {
        method: currentAppointment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao salvar consulta');
      }

      // Atualiza a lista de consultas imediatamente após salvar
      await fetchAppointments();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar consulta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!currentAppointment) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/consultas/${currentAppointment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cancelar consulta');
      }

      await fetchAppointments();
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      setError(error instanceof Error ? error.message : 'Erro ao cancelar consulta');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = parseISO(date);
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusColor = (data: string) => {
    const appointmentDate = new Date(data);
    const now = new Date();

    if (appointmentDate < now) {
      return styles.completed;
    }
    return styles.scheduled;
  };

  const getStatusIcon = (data: string) => {
    const appointmentDate = new Date(data);
    const now = new Date();

    if (appointmentDate < now) {
      return <CheckCircle size={16} />;
    }
    return <Clock size={16} />;
  };

  return (
    <DashboardLayout title="Consultas">
      <div className={styles.appointmentsContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Consultas</h2>
          <Button onClick={openAddModal}>
            <CalendarPlus size={18} style={{ marginRight: '0.5rem' }} />
            Nova Consulta
          </Button>
        </div>
        
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por paciente ou médico..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className={styles.card}>
          {error ? (
            <div className={styles.emptyState}>
              <Calendar size={64} />
              <h3>Erro ao carregar consultas</h3>
              <p>{error}</p>
              <Button onClick={fetchAppointments}>
                Tentar novamente
              </Button>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Paciente</th>
                      <th>Médico</th>
                      <th>Status</th>
                      <th>Criada em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <div className={styles.dateTime}>
                            <Calendar size={16} className={styles.icon} />
                            <div>
                              <div className={styles.date}>
                                {formatDate(appointment.data)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.name}>
                            {patients[appointment.pacienteId]?.nome || 'Carregando...'}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className={styles.name}>
                              {doctors[appointment.medicoId]?.nome || 'Carregando...'}
                            </div>
                            <div className={styles.specialty}>
                              {doctors[appointment.medicoId]?.especialidade?.nome || 'Carregando...'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.status} ${getStatusColor(appointment.data)}`}>
                            {getStatusIcon(appointment.data)}
                            <span>
                              {new Date(appointment.data) < new Date() ? 'Realizada' : 'Agendada'}
                            </span>
                          </span>
                        </td>
                        <td>
                          <div className={styles.createdAt}>
                            {format(parseISO(appointment.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.edit}`}
                              onClick={() => openEditModal(appointment)}
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => openDeleteModal(appointment)}
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
                  Mostrando <strong>1-{filteredAppointments.length}</strong> de{' '}
                  <strong>{filteredAppointments.length}</strong> consultas
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
              <Calendar size={64} />
              <h3>Nenhuma consulta encontrada</h3>
              <p>
                {searchTerm
                  ? `Não encontramos consultas correspondentes à sua busca "${searchTerm}".`
                  : 'Você ainda não tem consultas agendadas. Comece agendando sua primeira consulta.'}
              </p>
              <Button onClick={openAddModal}>
                <CalendarPlus size={18} style={{ marginRight: '0.5rem' }} />
                Agendar Consulta
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Appointment Modal Component */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveAppointment}
        appointment={currentAppointment}
        isLoading={isLoading}
      />
      
      {/* Delete Confirmation Modal Component */}
      {currentAppointment && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteAppointment}
          title="Cancelar Consulta?"
          message={
            <>
              Você está prestes a cancelar a consulta de{' '}
              <strong>{patients[currentAppointment.pacienteId]?.nome || 'Carregando...'}</strong> com{' '}
              <strong>{doctors[currentAppointment.medicoId]?.nome || 'Carregando...'}</strong> agendada para{' '}
              <strong>
                {formatDate(currentAppointment.data)}
              </strong>
              . Esta ação não pode ser desfeita.
            </>
          }
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Appointments;