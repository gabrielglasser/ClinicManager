'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../../input/Input';
import Button from '../../button/Button';
import styles from './AppointmentModal.module.scss';

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
  hora: string;
  status: 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'REALIZADA';
  observacoes: string;
  createdAt: string;
  medico: Doctor;
  paciente: Patient;
}

interface AppointmentFormData {
  pacienteId: string;
  medicoId: string;
  data: string;
  hora: string;
  observacoes: string;
}

interface FormErrors {
  pacienteId?: string;
  medicoId?: string;
  data?: string;
  hora?: string;
  observacoes?: string;
  general?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => Promise<void>;
  appointment: Appointment | null;
  isLoading: boolean;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment,
  isLoading
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    pacienteId: '',
    medicoId: '',
    data: '',
    hora: '',
    observacoes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      fetchPatients();
      if (appointment) {
        setFormData({
          pacienteId: appointment.pacienteId,
          medicoId: appointment.medicoId,
          data: appointment.data,
          hora: appointment.hora,
          observacoes: appointment.observacoes || ''
        });
      }
    }
  }, [isOpen, appointment]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/medicos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar médicos');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/pacientes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar pacientes');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.pacienteId) {
      newErrors.pacienteId = 'Selecione um paciente';
    }

    if (!formData.medicoId) {
      newErrors.medicoId = 'Selecione um médico';
    }

    if (!formData.data) {
      newErrors.data = 'Selecione uma data';
    } else {
      const selectedDate = new Date(formData.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.data = 'A data deve ser futura';
      }
    }

    if (!formData.hora) {
      newErrors.hora = 'Selecione um horário';
    } else {
      const [hours, minutes] = formData.hora.split(':').map(Number);
      if (hours < 8 || hours >= 18) {
        newErrors.hora = 'O horário deve ser entre 8h e 18h';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formattedData = {
        ...formData,
        data: new Date(formData.data).toISOString().split('T')[0],
        hora: formData.hora + ':00'
      };

      await onSave(formattedData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      setErrors({ general: 'Erro ao salvar consulta' });
    }
  };

  const handleClose = () => {
    setFormData({
      pacienteId: '',
      medicoId: '',
      data: '',
      hora: '',
      observacoes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    isOpen ? (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>
              {appointment ? 'Editar Consulta' : 'Nova Consulta'}
            </h3>
            <button className={styles.closeButton} onClick={handleClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.modalBody}>
            {errors.general && (
              <div className={styles.errorMessage}>
                {errors.general}
              </div>
            )}
            <div className={styles.selectContainer}>
              <label className={styles.selectLabel}>Paciente</label>
              <select
                className={styles.select}
                value={formData.pacienteId}
                onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
              >
                <option value="">Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nome}
                  </option>
                ))}
              </select>
              {errors.pacienteId && <p className={styles.error}>{errors.pacienteId}</p>}
            </div>

            <div className={styles.selectContainer}>
              <label className={styles.selectLabel}>Médico</label>
              <select
                className={styles.select}
                value={formData.medicoId}
                onChange={(e) => setFormData({ ...formData, medicoId: e.target.value })}
              >
                <option value="">Selecione um médico</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nome} - {doctor.especialidade.nome}
                  </option>
                ))}
              </select>
              {errors.medicoId && <p className={styles.error}>{errors.medicoId}</p>}
            </div>

            <div className={styles.formRow}>
              <Input
                label="Data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                error={errors.data}
              />

              <Input
                label="Hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                error={errors.hora}
              />
            </div>

            <div className={styles.textareaContainer}>
              <label className={styles.textareaLabel}>Observações</label>
              <textarea
                className={styles.textarea}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Adicione observações importantes sobre a consulta..."
              />
            </div>

            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {appointment ? 'Salvar' : 'Agendar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
};

export default AppointmentModal;