import React, { useState } from 'react';
import { Menu, Search, Bell, Calendar } from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
        />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={() => setShowCalendar(!showCalendar)}>
          <Calendar size={20} />
          {showCalendar && (
            <div className={styles.calendarModal}>
              {/* Aqui você pode adicionar um componente de calendário */}
              <p>Calendário</p>
            </div>
          )}
        </button>
        
        <button className={styles.actionButton} onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
          {showNotifications && (
            <div className={styles.notificationsModal}>
              {/* Aqui você pode adicionar as notificações */}
              <p>Notificações</p>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;