import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import heroImage from '../../assets/home/HOMEadminpanel.jpg'; 
import productsIcon from '../../assets/home/HOMEproduct.png'; 
import categoriesIcon from '../../assets/home/HOMEcategory.png'; 

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div 
        className={styles.heroSection}
        style={{ backgroundImage: `url(${heroImage})` }}
      > 
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Админ-панель <span>PC Store</span></h1>
          <p className={styles.heroSubtitle}>Управление компьютерными компонентами</p>
        </div>
      </div>
      <div className={styles.features}>
        <Link to="/products" className={styles.featureCard}>
          <div className={styles.cardImageContainer}>
            <img 
              src={productsIcon} 
              alt="Товары" 
              className={styles.cardImage}
              loading="lazy"
            />
          </div>
          <h3>Управление товарами</h3>
          <p>Полный контроль над каталогом продукции</p>
          <div className={styles.cardHoverEffect}></div>
        </Link>

        <Link to="/categories" className={styles.featureCard}>
          <div className={styles.cardImageContainer}>
            <img 
              src={categoriesIcon} 
              alt="Категории" 
              className={styles.cardImage}
              loading="lazy"
            />
          </div>
          <h3>Управление категориями</h3>
          <p>Организация структуры каталога</p>
          <div className={styles.cardHoverEffect}>2</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;