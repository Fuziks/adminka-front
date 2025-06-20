import React, { useState } from 'react';
import styles from './BulkEditModal.module.css';
import { BulkEditModalProps } from '../../types'

const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  selectedCount,
  categories,
  onClose,
  onConfirm
}) => {
  const [formData, setFormData] = useState({
    price: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      
      await onConfirm({
        price: formData.price ? parseFloat(formData.price) : undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Массовое редактирование ({selectedCount} товаров)</h1>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Новая цена (руб.)</label>
            <div className={styles.priceInputContainer}>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className={styles.input}
              />
              <span className={styles.currencySymbol}>₽</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Новая категория</label>
            <div className={styles.selectContainer}>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className={styles.select}
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
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.divider}></div>

          <div className={styles.actions}>
            <button 
              type="button"
              onClick={onClose} 
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button 
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Применить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEditModal;