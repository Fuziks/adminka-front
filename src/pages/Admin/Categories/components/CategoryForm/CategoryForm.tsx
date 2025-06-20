
import React, { useState, useEffect } from 'react';
import styles from './CategoryForm.module.css';
import { CategoryFormProps } from '../../types'

const CategoryForm: React.FC<CategoryFormProps> = ({ 
    category, 
    onSubmit, 
    onCancel
}) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name || '');
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (name.trim().length < 2) {
            setError('Название должно содержать минимум 2 символа');
            return;
        }
        
        setError('');
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.categoryForm}>
            <h3 className={styles.formTitle}>{category ? 'Редактировать категорию' : 'Добавить категорию'}</h3>
            
            <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Название категории</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim().length >= 2) {
                            setError('');
                        }
                    }}
                    className={`${styles.textInput} ${error ? styles.errorInput : ''}`}
                    required
                    placeholder="Введите название категории"
                    minLength={2}
                />
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>

            <div className={styles.formActions}>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className={styles.cancelButton}
                >
                    Отмена
                </button>
                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={name.trim().length < 2}
                >
                    {category ? 'Сохранить изменения' : 'Добавить'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;