'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../../button/Button';
import styles from './deleteConfirmationModal.module.scss';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: React.ReactNode;
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Confirmar Exclusão</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.confirmDialog}>
          <AlertTriangle size={48} />
          <h3>{title}</h3>
          <p>{message}</p>
          
          <div className={styles.buttonContainer}>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;