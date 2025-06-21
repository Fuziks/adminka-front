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
        <FeatureCard 
          to="/products" 
          icon={productsIcon} 
          title="Управление товарами" 
          description="Полный контроль над каталогом продукции" 
        />
        
        <FeatureCard 
          to="/categories" 
          icon={categoriesIcon} 
          title="Управление категориями" 
          description="Организация структуры каталога" 
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  to: string;
  icon: string;
  title: string;
  description: string;
}> = ({ to, icon, title, description }) => (
  <Link to={to} className={styles.featureCard}>
    <div className={styles.cardImageContainer}>
      <img src={icon} alt={title} className={styles.cardImage} loading="lazy" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className={styles.cardHoverEffect}></div>
  </Link>
);

export default Home;