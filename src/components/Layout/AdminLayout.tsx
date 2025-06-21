import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { ROUTES } from '../../utils/routes';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>PC Store Admin</h3>
          <p className={styles.adminSubtitle}>Панель управления</p>
        </div>

        <nav className={styles.navMenu}>
          <Link to={ROUTES.HOME} className={styles.navItem}>
            <span>Главная</span>
          </Link>
          <Link to={ROUTES.PRODUCTS} className={styles.navItem}>
            <span>Товары</span>
          </Link>
          <Link to={ROUTES.CATEGORIES} className={styles.navItem}>
            <span>Категории</span>
          </Link>
        </nav>

        <div className={styles.logoutContainer}>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            <span>
              <span>&#8617;</span> Выйти из системы
            </span>
          </button>
        </div>
      </aside>
      
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;