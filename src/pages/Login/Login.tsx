  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import styles from './Login.module.css';
  import logo from '../../assets/login/login.png';

  const Login: React.FC = () => {
    const navigate = useNavigate();
    const [logoLoaded, setLogoLoaded] = useState(false);

    const handleLogin = () => {
      localStorage.setItem('auth', 'true');
      navigate('/');
    };

    return (
      <div className={styles.minimalContainer}>
        <div className={styles.card3d}>
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
            onClick={handleLogin}
            className={styles.neonBtn}
          >
            <span>Войти в систему <span>&#10140;</span></span>
          </button>
        </div>
      </div>
    );
  };

  export default Login;