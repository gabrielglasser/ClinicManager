import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import Button from '../../button/Button';
import styles from './medicalRecordModal.module.scss';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

interface Patient {
  id: string;
  nome: string;
}

interface MedicalRecord {
  id: string;
  pacienteId: string;
  historico: string;
  createdAt: string;
  paciente?: {
    nome: string;
  };
}

interface MedicalRecordFormData {
  pacienteId: string;
  historico: string;
}

interface FormErrors {
  pacienteId?: string;
  historico?: string;
}

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MedicalRecordFormData) => Promise<void>;
  medicalRecord: MedicalRecord | null;
  isLoading: boolean;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  medicalRecord,
  isLoading
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    pacienteId: '',
    historico: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<FormErrors>({});

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    // Carregar lista de pacientes do backend
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${API_URL}/pacientes`, getAuthHeader());
        setPatients(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };

    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (medicalRecord) {
      setFormData({
        pacienteId: medicalRecord.pacienteId,
        historico: medicalRecord.historico,
      });
    } else {
      setFormData({
        pacienteId: '',
        historico: '',
      });
    }
    setErrors({});
  }, [medicalRecord, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.pacienteId) {
      newErrors.pacienteId = 'Paciente é obrigatório';
    }
    
    if (!formData.historico) {
      newErrors.historico = 'Histórico é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setModalError(null);
      await onSave(formData);
    } catch (error: any) {
      console.error('Erro ao salvar prontuário:', error);
      setModalError(error.response?.data?.message || 'Erro ao salvar prontuário. Tente novamente mais tarde.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {medicalRecord ? 'Editar Prontuário' : 'Novo Prontuário'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {modalError && (
              <div className={styles.error}>
                {modalError}
              </div>
            )}
            
            <div className={styles.patientSelect}>
              <label className={styles.selectLabel}>Paciente</label>
              <select
                name="pacienteId"
                value={formData.pacienteId}
                onChange={handleChange}
                className={styles.select}
                required
                disabled={!!medicalRecord} // Desabilita se estiver editando
              >
                <option value="">Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nome}
                  </option>
                ))}
              </select>
              {errors.pacienteId && (
                <p className={styles.error}>{errors.pacienteId}</p>
              )}
            </div>
            
            <div className={styles.textareaContainer}>
              <label className={styles.textareaLabel}>Histórico Médico</label>
              <textarea
                name="historico"
                value={formData.historico}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Descreva o histórico médico do paciente..."
                required
              />
              {errors.historico && (
                <p className={styles.error}>{errors.historico}</p>
              )}
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              {medicalRecord ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordModal;