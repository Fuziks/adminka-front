import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductForm.module.css';
import { motion } from 'framer-motion';
import { checkProductName } from '../../../../../api/products';
import { ProductFormProps } from '../../types';

const initialFormData = {
  name: '',
  brand: '',
  price: '',
  categoryId: ''
};

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  categories, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [nameError, setNameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shakeButtons, setShakeButtons] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        categoryId: product.category?.id?.toString() || ''
      });
    }
  }, [product]);

  const validateName = async (name: string) => {
    if (!name || name.length < 3) {
      setNameError('');
      return false;
    }

    try {
      setIsChecking(true);
      const { exists } = await checkProductName(name);
      setNameError(exists ? 'Товар с таким названием уже существует' : '');
      return exists;
    } catch (error) {
      console.error('Ошибка проверки имени:', error);
      return false;
    } finally {
      setIsChecking(false);
      nameInputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    if (typingTimeout) clearTimeout(typingTimeout);
    
    setTypingTimeout(
      setTimeout(async () => await validateName(value), 500)
    );
  };

  const triggerShake = () => {
    setShakeButtons(true);
    setTimeout(() => setShakeButtons(false), 500);
  };

  const prepareSubmitData = () => ({
    name: formData.name,
    brand: formData.brand,
    price: parseFloat(formData.price),
    categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
  });

  const handleSubmit = async (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();
    
    if (nameError) {
      triggerShake();
      return;
    }

    onSubmit(prepareSubmitData(), shouldClose);
  };

  const handleSaveAndAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e, false);
  };

  const buttonAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.productForm}>
      <h3 className={styles.formTitle}>
        {product ? 'Редактировать товар' : 'Добавить товар'}
      </h3>
      
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Название товара</label>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className={`${styles.textInput} ${styles.fullWidth}`}
          required
          placeholder="Введите название"
          autoFocus
        />
        {nameError && <div className={styles.errorText}>{nameError}</div>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Бренд</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          className={`${styles.textInput} ${styles.fullWidth}`}
          placeholder="Введите бренд"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Цена (руб.)</label>
        <div className={styles.priceInputContainer}>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`${styles.numberInput} ${styles.fullWidth}`}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
          />
          <span className={styles.currencySymbol}>₽</span>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Категория</label>
        {categories.length === 0 ? (
          <div className={styles.loadingMessage}>Загрузка категорий...</div>
        ) : (
          <div className={styles.selectContainer}>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className={styles.selectArrow}>▼</div>
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Отмена
        </button>
        {!product && (
          <motion.button 
            type="button"
            onClick={handleSaveAndAdd}
            className={styles.saveAndAddButton}
            animate={shakeButtons ? buttonAnimation : {}}
          >
            Сохранить и добавить еще
          </motion.button>
        )}
        <motion.button 
          type="submit"
          className={styles.submitButton}
          animate={shakeButtons ? buttonAnimation : {}}
        >
          {product ? 'Сохранить изменения' : 'Добавить товар'}
        </motion.button>
      </div>
    </form>
  );
};

export default ProductForm;