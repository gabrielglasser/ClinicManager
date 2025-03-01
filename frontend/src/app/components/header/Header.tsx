import React from 'react';
import { Menu, Search, Bell, Calendar, Settings } from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
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
        <button className={styles.actionButton}>
          <Calendar size={20} />
        </button>
        
        <button className={styles.actionButton}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <button className={styles.actionButton}>
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;