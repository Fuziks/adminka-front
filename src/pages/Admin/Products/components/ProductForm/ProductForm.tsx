import React, { useState, useEffect } from 'react';
import styles from './ProductForm.module.css';

interface ProductFormProps {
    product?: any;
    categories: any[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
    product, 
    categories, 
    onSubmit, 
    onCancel
}) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        categoryId: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                price: typeof product.price === 'number' ? product.price.toString() : product.price || '',
                categoryId: product.category?.id?.toString() || ''
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            name: formData.name,
            brand: formData.brand,
            price: parseFloat(formData.price),
            categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
        };
        
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <h3 className={styles.formTitle}>{product ? 'Редактировать товар' : 'Добавить товар'}</h3>
            
            <div className={styles.formGroup}>
    <label className={styles.inputLabel}>Название товара</label>
    <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={`${styles.textInput} ${styles.fullWidth}`}
        required
        placeholder="Введите название"
    />
</div>

<div className={styles.formGroup}>
    <label className={styles.inputLabel}>Бренд</label>
    <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
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
            onChange={handleChange}
            className={`${styles.numberInput} ${styles.fullWidth}`}
            min="0.01"
            step="0.01"
            placeholder="0.00"
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
                            onChange={handleChange}
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
                <button type="submit" className={styles.submitButton}>
                    {product ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;