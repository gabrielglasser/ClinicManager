import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Header.module.scss';
import type { CalendarProps } from 'react-calendar';

interface Notification {
  id: string;
  text: string;
  read: boolean;
  title: string;
  message: string;
  time: string;
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
  const [searchTerm, setSearchTerm] = useState('');
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
            text: `Consulta de ${c.paciente?.nome || 'paciente'} às ${new Date(c.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            title: 'Consulta próxima',
            message: `Consulta de ${c.paciente?.nome || 'paciente'} às ${new Date(c.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            time: new Date(c.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            read: false
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

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      
      <h1 className={styles.pageTitle}>{title}</h1>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.relativeWrapper}>
          <button
            className={styles.iconButton}
            onClick={() => setShowCalendar(!showCalendar)}
            aria-label="Calendário"
          >
            <CalendarIcon className={styles.icon} />
          </button>
          {showCalendar && (
            <div className={`${styles.calendarModal} open`} ref={calendarRef}>
              <Calendar
                onChange={setDate}
                value={date}
                locale="pt-BR"
                className={styles.calendar}
              />
            </div>
          )}
        </div>
        
        <div className={styles.relativeWrapper}>
          <button
            className={styles.iconButton}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações"
          >
            <Bell className={styles.icon} />
            {notifications.length > 0 && (
              <span className={styles.notificationBadge}>{notifications.length}</span>
            )}
          </button>
          {showNotifications && (
            <div className={`${styles.notificationsModal} open`} ref={notifRef}>
              <div className={styles.notificationsHeader}>
                <h3>Notificações</h3>
                <button
                  className={styles.clearButton}
                  onClick={clearNotifications}
                  aria-label="Limpar notificações"
                >
                  Limpar todas
                </button>
              </div>
              <div className={styles.notificationsList}>
                {notifications.length === 0 ? (
                  <p className={styles.noNotifications}>Nenhuma notificação</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${
                        notification.read ? styles.read : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationTitle}>
                          {notification.title}
                        </p>
                        <p className={styles.notificationMessage}>
                          {notification.message}
                        </p>
                        <span className={styles.notificationTime}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;