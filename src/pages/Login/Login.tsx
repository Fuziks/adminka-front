import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../../assets/login/login.png';
import { ROUTES } from '../../utils/routes'

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [logoLoaded, setLogoLoaded] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('auth', 'true');
    navigate(ROUTES.HOME); 
  };

  return (
    <div className={styles.minimalContainer}>
      <form onSubmit={handleLogin} className={styles.card3d}>
        <div className={styles.storeLogo}>
          <img 
            src={logo} 
            alt="PC Store Logo" 
            className={`${styles.logoImage} ${logoLoaded ? styles.logoLoaded : ''}`}
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
        <div className={styles.adminTitle}>
          <span>ADMIN</span>
        </div>
        <h2 className={styles.welcomeText}>Добро пожаловать</h2>
        <p className={styles.desc}>
          Панель управления магазином компьютерных комплектующих
        </p>
        <button 
          type="submit"
          className={styles.neonBtn}
        >
          <span>Войти в систему <span>&#10140;</span></span>
        </button>
      </form>
    </div>
  );
};

export default Login;