import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Header.module.scss';
import type { CalendarProps } from 'react-calendar';

interface Notification {
  id: string;
  text: string;
}

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  notifications?: Notification[];
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, notifications: notificationsProp }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [date, setDate] = useState<CalendarProps['value']>(new Date());
  const [notifications, setNotifications] = useState<Notification[]>(notificationsProp || []);
  const calendarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Buscar notificações reais de consultas próximas
  useEffect(() => {
    if (notificationsProp) return; // Se vier por prop, não busca
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) return;
        const data = await response.json();
        const now = new Date();
        const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const notifs = (data || [])
          .filter((c: any) => {
            const d = new Date(c.data);
            return d > now && d <= in2h;
          })
          .map((c: any) => ({
            id: c.id,
            text: `Consulta de ${c.paciente?.nome || 'paciente'} às ${new Date(c.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          }));
        setNotifications(notifs);
      } catch (e) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [notificationsProp]);

  // Fechar modais ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (showNotifications && notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showCalendar || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar, showNotifications]);

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      
      <h1 className={styles.pageTitle}>{title}</h1>
      
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className={styles.searchInput} 
          aria-label="Buscar"
          onInput={e => {
            // Sanitização básica para evitar XSS
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/<|>|&/g, '');
          }}
        />
      </div>
      
      <div className={styles.actions}>
        <div className={styles.relativeWrapper}>
          <button
            className={styles.actionButton}
            aria-label="Abrir calendário"
            onClick={() => setShowCalendar((v) => !v)}
            tabIndex={0}
          >
            <CalendarIcon size={20} />
          </button>
          {showCalendar && (
            <div className={`${styles.calendarModal} open`} ref={calendarRef}>
              <Calendar
                onChange={setDate}
                value={date}
                locale="pt-BR"
              />
            </div>
          )}
        </div>
        
        <div className={styles.relativeWrapper}>
          <button
            className={styles.actionButton}
            aria-label="Abrir notificações"
            onClick={() => setShowNotifications((v) => !v)}
            tabIndex={0}
          >
            <Bell size={20} />
            <span className={styles.badge}>{notifications.length}</span>
          </button>
          {showNotifications && (
            <div className={`${styles.notificationsModal} open`} ref={notifRef}>
              <strong>Notificações</strong>
              <ul className={styles.notificationsList}>
                {notifications.length === 0 ? (
                  <li>Nenhuma notificação</li>
                ) : (
                  notifications.map(n => <li key={n.id}>{n.text}</li>)
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;