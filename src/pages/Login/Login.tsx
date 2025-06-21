import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../../assets/login/login.png';
import { ROUTES } from '../../utils/routes';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoLoaded, setIsLogoLoaded] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('auth', 'true');
    navigate(ROUTES.HOME);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img 
            src={logo} 
            alt="PC Store Logo" 
            className={`${styles.logo} ${isLogoLoaded ? styles.visible : ''}`}
            onLoad={() => setIsLogoLoaded(true)}
          />
        </div>
        
        <div className={styles.title}>
          <span>ADMIN</span>
        </div>
        
        <h2 className={styles.heading}>Добро пожаловать</h2>
        
        <p className={styles.description}>
          Панель управления магазином компьютерных комплектующих
        </p>
        
        <button type="submit" className={styles.button}>
          <span>Войти в систему <span>&#10140;</span></span>
        </button>
      </form>
    </div>
  );
};

export default Login;