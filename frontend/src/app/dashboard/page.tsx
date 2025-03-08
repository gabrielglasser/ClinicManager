"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCog,
  CalendarClock,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import DashboardLayout from "./layout/DashboardLayout";
import styles from "./Dashboard.module.scss";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [totalMedicos, setTotalMedicos] = useState<number>(0);
  const [totalProntuarios, setTotalProntuarios] = useState<number>(0);
  const [consultasHoje, setConsultasHoje] = useState<number>(0);
  const [consultasDoDia, setConsultasDoDia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [periodoConsultas, setPeriodoConsultas] = useState<'semana' | 'mes' | 'ano'>('semana');
  const [consultasRealizadas, setConsultasRealizadas] = useState<any[]>([]);
  const [variacaoPacientes, setVariacaoPacientes] = useState<number>(0);
  const [variacaoMedicos, setVariacaoMedicos] = useState<number>(0);
  const [variacaoConsultas, setVariacaoConsultas] = useState<number>(0);
  const [variacaoProntuarios, setVariacaoProntuarios] = useState<number>(0);

  /**
   * Verifica se o usuário está autenticado e se o token é válido
   * @returns {Promise<string | false>} Retorna o token se válido ou false se inválido
   */
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return false;
    }

    try {
      // Verifica se o token é válido
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Se o token for inválido, limpa o localStorage e redireciona
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

  /**
   * Calcula a variação percentual entre dois valores
   * @param atual - Valor do mês atual
   * @param anterior - Valor do mês anterior
   * @returns {number} Retorna a variação percentual com uma casa decimal
   */
  const calcularVariacaoMensal = (atual: number, anterior: number): number => {
    if (anterior === 0) return 0;
    return Number((((atual - anterior) / anterior) * 100).toFixed(1));
  };

  /**
   * Busca e processa os dados dos pacientes, incluindo a variação mensal
   */
  const fetchPacientes = async () => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/pacientes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar pacientes");
      }

      const data = await response.json();
      
      // Filtra pacientes do mês atual e anterior
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const pacientesMesAtual = data.filter((paciente: any) => {
        const dataCriacao = new Date(paciente.createdAt);
        return dataCriacao.getMonth() === mesAtual && 
               dataCriacao.getFullYear() === anoAtual;
      });

      const pacientesMesAnterior = data.filter((paciente: any) => {
        const dataCriacao = new Date(paciente.createdAt);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return dataCriacao.getMonth() === mesAnterior && 
               dataCriacao.getFullYear() === anoAnterior;
      });

      setTotalPacientes(data.length);
      setVariacaoPacientes(calcularVariacaoMensal(
        pacientesMesAtual.length,
        pacientesMesAnterior.length
      ));
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      setError("Erro ao carregar dados");
    }
  };

  /**
   * Busca e processa os dados dos médicos, incluindo a variação mensal
   */
  const fetchMedicos = async () => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/medicos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar médicos");
      }

      const data = await response.json();
      
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const medicosMesAtual = data.filter((medico: any) => {
        const dataCriacao = new Date(medico.createdAt);
        return dataCriacao.getMonth() === mesAtual && 
               dataCriacao.getFullYear() === anoAtual;
      });

      const medicosMesAnterior = data.filter((medico: any) => {
        const dataCriacao = new Date(medico.createdAt);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return dataCriacao.getMonth() === mesAnterior && 
               dataCriacao.getFullYear() === anoAnterior;
      });

      setTotalMedicos(data.length);
      setVariacaoMedicos(calcularVariacaoMensal(
        medicosMesAtual.length,
        medicosMesAnterior.length
      ));
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    }
  };

  /**
   * Busca e processa os dados dos prontuários, incluindo a variação mensal
   */
  const fetchProntuarios = async () => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/prontuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar prontuários");
      }

      const data = await response.json();
      
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const prontuariosMesAtual = data.filter((prontuario: any) => {
        const dataCriacao = new Date(prontuario.createdAt);
        return dataCriacao.getMonth() === mesAtual && 
               dataCriacao.getFullYear() === anoAtual;
      });

      const prontuariosMesAnterior = data.filter((prontuario: any) => {
        const dataCriacao = new Date(prontuario.createdAt);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return dataCriacao.getMonth() === mesAnterior && 
               dataCriacao.getFullYear() === anoAnterior;
      });

      setTotalProntuarios(data.length);
      setVariacaoProntuarios(calcularVariacaoMensal(
        prontuariosMesAtual.length,
        prontuariosMesAnterior.length
      ));
    } catch (error) {
      console.error("Erro ao buscar prontuários:", error);
    }
  };

  /**
   * Busca as consultas do dia atual e calcula a variação mensal
   */
  const fetchConsultasHoje = async () => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/consultas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar consultas");
      }

      const data = await response.json();
      
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const consultasMesAtual = data.filter((consulta: any) => {
        const dataConsulta = new Date(consulta.data);
        return dataConsulta.getMonth() === mesAtual && 
               dataConsulta.getFullYear() === anoAtual;
      });

      const consultasMesAnterior = data.filter((consulta: any) => {
        const dataConsulta = new Date(consulta.data);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return dataConsulta.getMonth() === mesAnterior && 
               dataConsulta.getFullYear() === anoAnterior;
      });

      // Atualiza as consultas de hoje
      const consultasDeHoje = data.filter((consulta: any) => {
        const dataConsulta = new Date(consulta.data).toISOString().split('T')[0];
        return dataConsulta === hoje.toISOString().split('T')[0];
      });

      setConsultasHoje(consultasDeHoje.length);
      setConsultasDoDia(consultasDeHoje);
      setVariacaoConsultas(calcularVariacaoMensal(
        consultasMesAtual.length,
        consultasMesAnterior.length
      ));
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    }
  };

  /**
   * Prepara os dados para exibição no gráfico baseado no período selecionado
   * @param consultas - Array de consultas a serem processadas
   * @returns {Array} Dados formatados para o gráfico
   */
  const prepararDadosGrafico = (consultas: any[]) => {
    if (periodoConsultas === 'semana') {
      // Agrupa consultas por dia da semana
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const dados = diasSemana.map(dia => ({
        nome: dia,
        consultas: 0
      }));

      consultas.forEach(consulta => {
        const data = new Date(consulta.data);
        const diaSemana = data.getDay();
        dados[diaSemana].consultas++;
      });

      return dados;
    } else if (periodoConsultas === 'mes') {
      // Agrupa consultas por dia do mês
      const hoje = new Date();
      const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      const dados = Array.from({ length: diasNoMes }, (_, i) => ({
        nome: `${i + 1}`,
        consultas: 0
      }));

      consultas.forEach(consulta => {
        const data = new Date(consulta.data);
        const dia = data.getDate() - 1;
        dados[dia].consultas++;
      });

      return dados;
    } else {
      // Agrupa consultas por mês
      const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
      const dados = meses.map(mes => ({
        nome: mes,
        consultas: 0
      }));

      consultas.forEach(consulta => {
        const data = new Date(consulta.data);
        const mes = data.getMonth();
        dados[mes].consultas++;
      });

      return dados;
    }
  };

  /**
   * Busca e filtra as consultas baseado no período selecionado (semana/mês/ano)
   * @param periodo - Período selecionado para filtrar as consultas
   */
  const fetchConsultasRealizadas = async (periodo: 'semana' | 'mes' | 'ano') => {
    const token = await checkAuth();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/consultas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar consultas realizadas");
      }

      const data = await response.json();
      
      // Filtra consultas baseado no período selecionado
      const hoje = new Date();
      const consultasFiltradas = data.filter((consulta: any) => {
        const dataConsulta = new Date(consulta.data);
        
        switch (periodo) {
          case 'semana':
            const umaSemanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
            const umaSemanaFrente = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dataConsulta >= umaSemanaAtras && dataConsulta <= umaSemanaFrente;
          
          case 'mes':
            return dataConsulta.getMonth() === hoje.getMonth() &&
                   dataConsulta.getFullYear() === hoje.getFullYear();
          
          case 'ano':
            return dataConsulta.getFullYear() === hoje.getFullYear();
          
          default:
            return false;
        }
      });

      setConsultasRealizadas(consultasFiltradas);
      setDadosGrafico(prepararDadosGrafico(consultasFiltradas));
    } catch (error) {
      console.error("Erro ao buscar consultas realizadas:", error);
    }
  };

  // Effect para atualizar o gráfico quando o período é alterado
  useEffect(() => {
    if (!isLoading) {
      fetchConsultasRealizadas(periodoConsultas);
    }
  }, [periodoConsultas]);

  // Effect inicial para carregar todos os dados do dashboard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPacientes(),
        fetchMedicos(),
        fetchProntuarios(),
        fetchConsultasHoje(),
        fetchConsultasRealizadas(periodoConsultas)
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total de Pacientes",
      value: isLoading ? "Carregando..." : error ? "Erro" : totalPacientes,
      change: variacaoPacientes,
      icon: <Users size={20} />,
      iconClass: styles.blue,
    },
    {
      title: "Médicos Ativos",
      value: isLoading ? "Carregando..." : error ? "Erro" : totalMedicos,
      change: variacaoMedicos,
      icon: <UserCog size={20} />,
      iconClass: styles.purple,
    },
    {
      title: "Consultas Hoje",
      value: isLoading ? "Carregando..." : error ? "Erro" : consultasHoje,
      change: variacaoConsultas,
      icon: <CalendarClock size={20} />,
      iconClass: styles.green,
    },
    {
      title: "Prontuários",
      value: isLoading ? "Carregando..." : error ? "Erro" : totalProntuarios,
      change: variacaoProntuarios,
      icon: <FileText size={20} />,
      iconClass: styles.orange,
    },
  ];

  /**
   * Formata a hora para exibição no formato HH:mm
   * @param date - Data a ser formatada
   * @returns {string} Hora formatada
   */
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Renderiza o gráfico de consultas com base no período selecionado
   * @returns {JSX.Element} Componente do gráfico
   */
  const renderGrafico = () => {
    if (isLoading) {
      return <div className={styles.loading}>Carregando dados...</div>;
    }

    if (consultasRealizadas.length === 0) {
      return <div className={styles.noData}>Nenhuma consulta realizada neste período</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dadosGrafico}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nome"
            tick={{ fontSize: 12 }}
            interval={periodoConsultas === 'mes' ? 2 : 0}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="consultas"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className={styles.dashboard}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <h3 className={styles.statTitle}>{stat.title}</h3>
                <div className={`${styles.statIcon} ${stat.iconClass}`}>
                  {stat.icon}
                </div>
              </div>
              <p className={styles.statValue}>{stat.value}</p>
              {!isLoading && !error && stat.change !== 0 && (
                <div
                  className={`${styles.statChange} ${
                    stat.change >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {Math.abs(stat.change)}% em relação ao mês anterior
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Consultas Realizadas</h3>
            <div className={styles.chartActions}>
              <button
                className={`${styles.chartFilter} ${periodoConsultas === 'semana' ? styles.active : ''}`}
                onClick={() => setPeriodoConsultas('semana')}
              >
                Semana
              </button>
              <button
                className={`${styles.chartFilter} ${periodoConsultas === 'mes' ? styles.active : ''}`}
                onClick={() => setPeriodoConsultas('mes')}
              >
                Mês
              </button>
              <button
                className={`${styles.chartFilter} ${periodoConsultas === 'ano' ? styles.active : ''}`}
                onClick={() => setPeriodoConsultas('ano')}
              >
                Ano
              </button>
            </div>
          </div>
          <div className={`${styles.chartContent} ${styles.tooltipWrapper}`}>
            {renderGrafico()}
          </div>
        </div>

        <div className={styles.appointmentsSection}>
          <div className={styles.appointmentsHeader}>
            <h3 className={styles.appointmentsTitle}>Consultas de Hoje</h3>
            <Link href="/dashboard/appointments" className={styles.viewAllLink}>
              Ver todas
            </Link>
          </div>
          <div className={styles.appointmentsList}>
            {isLoading ? (
              <div className={styles.loading}>Carregando consultas...</div>
            ) : consultasDoDia.length === 0 ? (
              <div className={styles.noAppointments}>
                Não há consultas agendadas para hoje
              </div>
            ) : (
              consultasDoDia.map((consulta: any) => (
                <div key={consulta.id} className={styles.appointmentCard}>
                  <div className={styles.appointmentTime}>
                    {formatTime(consulta.data)}
                  </div>
                <div className={styles.appointmentInfo}>
                    <h4>{consulta.paciente?.nome || 'Paciente não encontrado'}</h4>
                    <p>{consulta.medico?.nome || 'Médico não encontrado'}</p>
                </div>
                  <div className={`${styles.appointmentStatus} ${styles.confirmed}`}>
                    Confirmada
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
