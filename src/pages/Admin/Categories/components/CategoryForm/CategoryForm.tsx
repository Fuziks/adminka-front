import React, { useState, useEffect, useRef } from 'react';
import styles from './CategoryForm.module.css';
import { motion } from 'framer-motion';
import { checkCategoryName } from '../../../../../api/categories';
import { CategoryFormProps } from '../../types';

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onSubmit, 
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [nameError, setNameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shakeButtons, setShakeButtons] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
      });
    }
  }, [category]);

  const checkCategoryExists = async (name: string) => {
    if (!name || name.length < 3) { 
      setNameError('');
      return false;
    }
  
    try {
      setIsChecking(true);
      const response = await checkCategoryName(name);
      return response.exists;
    } catch (err) {
      console.error('Ошибка проверки имени:', err);
      return false;
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const newTimeout = setTimeout(async () => {
      const exists = await checkCategoryExists(value);
      setNameError(exists ? 'Категория с таким названием уже существует' : '');
    }, 500); 
    
    setTypingTimeout(newTimeout);
  };

  const triggerShake = () => {
    setShakeButtons(true);
    setTimeout(() => setShakeButtons(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();
    
    if (nameError) {
      triggerShake();
      return;
    }

    if (formData.name.trim().length < 2) {
      setNameError('Название должно содержать минимум 2 символа');
      triggerShake();
      return;
    }
    
    onSubmit({ name: formData.name.trim() }, shouldClose);
  };

  const handleSaveAndAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e, false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className={styles.categoryForm}>
      <h3 className={styles.formTitle}>{category ? 'Редактировать категорию' : 'Добавить категорию'}</h3>
      
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Название категории</label>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className={`${styles.textInput} ${nameError ? styles.errorInput : ''}`}
          required
          placeholder="Введите название категории"
          autoFocus
        />
        {nameError && <div className={styles.errorMessage}>{nameError}</div>}
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Отмена
        </button>
        {!category && (
          <motion.button 
            type="button"
            onClick={handleSaveAndAdd}
            className={styles.saveAndAddButton}
            animate={shakeButtons ? { 
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 }
            } : {}}
          >
            Сохранить и добавить еще
          </motion.button>
        )}
        <motion.button 
          type="submit"
          className={styles.submitButton}
          animate={shakeButtons ? { 
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
          } : {}}
        >
          {category ? 'Сохранить изменения' : 'Добавить категорию'}
        </motion.button>
      </div>
    </form>
  );
};

export default CategoryForm;