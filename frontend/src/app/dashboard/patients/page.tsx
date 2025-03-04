"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Users,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Button from "../../components/button/Button";
import PatientModal from "../../components/modals/patientsModal/patientModal";
import DeleteConfirmationModal from "../../components/modals/deleteModal/deleteConfirmationModal";
import styles from "./Patients.module.scss";

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  photo: string;
  createdAt: string;
}

interface PatientFormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  photo: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter patients
  const filteredPatients = patients.filter(
    (patient) =>
      patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setCurrentPatient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsModalOpen(true);
  };

  const openDeleteModal = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Adicionar função para carregar pacientes
  const fetchPatients = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/pacientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Erro detalhado ao buscar pacientes:", error);
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Usar useEffect para carregar pacientes ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado!");
      return;
    }

    fetchPatients();
  }, []);

  // Atualizar função handleSavePatient
  const handleSavePatient = async (formData: PatientFormData) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      // Formatar a data para o formato esperado pelo backend (mm/dd/yyyy)
      const formatDateForBackend = (dateString: string) => {
        const [year, month, day] = dateString.split("-");
        return `${month}/${day}/${year}`;
      };

      // Criar uma cópia do formData com a data formatada
      const formattedData = {
        ...formData,
        dataNascimento: formatDateForBackend(formData.dataNascimento),
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (currentPatient) {
        // Atualizar paciente existente
        const response = await fetch(
          `http://localhost:4000/api/pacientes/${currentPatient.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(formattedData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao atualizar paciente");
        }
      } else {
        // Criar novo paciente
        const response = await fetch("http://localhost:4000/api/pacientes", {
          method: "POST",
          headers,
          body: JSON.stringify(formattedData),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao criar paciente");
        }
      }

      await fetchPatients();
      closeModal();
    } catch (error) {
      console.error("Erro detalhado ao salvar paciente:", error);
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar função handleDeletePatient
  const handleDeletePatient = async () => {
    if (!currentPatient) return;

    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4000/api/pacientes/${currentPatient.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar paciente");

      await fetchPatients();
      closeDeleteModal();
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pt-BR").format(date);
    } catch (error) {
      return dateString;
    }
  };

  const calculateAge = (birthDate: string) => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      return "";
    }
  };

  return (
    <DashboardLayout title="Pacientes">
      <div className={styles.patientsContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Pacientes</h2>
          <Button onClick={openAddModal}>
            <UserPlus size={18} style={{ marginRight: "0.5rem" }} />
            Novo Paciente
          </Button>
        </div>

        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.card}>
          {filteredPatients.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>CPF</th>
                      <th>Data de Nascimento</th>
                      <th>Telefone</th>
                      <th>Endereço</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className={styles.avatar}>
                              {patient.photo ? (
                                <img src={patient.photo} alt={patient.nome} />
                              ) : (
                                <UserCircle size={40} />
                              )}
                            </div>
                            <div style={{ marginLeft: "0.75rem" }}>
                              <div className={styles.patientName}>
                                {patient.nome}
                              </div>
                              <div className={styles.patientInfo}>
                                {calculateAge(patient.dataNascimento)} anos
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{patient.cpf}</td>
                        <td>{formatDate(patient.dataNascimento)}</td>
                        <td>{patient.telefone}</td>
                        <td>{patient.endereco}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={`${styles.actionButton} ${styles.edit}`}
                              onClick={() => openEditModal(patient)}
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => openDeleteModal(patient)}
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
                  Mostrando <strong>1-{filteredPatients.length}</strong> de{" "}
                  <strong>{filteredPatients.length}</strong> pacientes
                </div>
                <div className={styles.paginationButtons}>
                  <button className={styles.paginationButton} disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className={`${styles.paginationButton} ${styles.active}`}
                  >
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
              <Users size={64} />
              <h3>Nenhum paciente encontrado</h3>
              <p>
                {searchTerm
                  ? `Não encontramos pacientes correspondentes à sua busca "${searchTerm}".`
                  : "Você ainda não cadastrou nenhum paciente. Comece adicionando seu primeiro paciente."}
              </p>
              <Button onClick={openAddModal}>
                <UserPlus size={18} style={{ marginRight: "0.5rem" }} />
                Adicionar Paciente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Modal Component */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSavePatient}
        patient={currentPatient}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal Component */}
      {currentPatient && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeletePatient}
          title="Excluir Paciente?"
          message={
            <>
              Você está prestes a excluir o paciente{" "}
              <strong>{currentPatient.nome}</strong>. Esta ação não pode ser
              desfeita.
            </>
          }
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Patients;
