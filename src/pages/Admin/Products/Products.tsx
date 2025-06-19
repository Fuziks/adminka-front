import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Snackbar, Alert, Skeleton, Pagination } from '@mui/material';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import ProductsTable from './components/ProductsTable/ProductsTable';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
import BulkEditModal from './components/BulkEditModal/BulkEditModal';
import BulkDeleteConfirmModal from './components/BulkDeleteConfirmModal/BulkDeleteConfirmModal';
import Modal from '../../../components/UI/Modal/Modal';
import ProductForm from './components/ProductForm/ProductForm';
import { Product } from './types';
import styles from './Products.module.css';
import { createProduct, deleteProduct, updateProduct } from '../../../api/products';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlus, 
  faCheckCircle, 
  faExclamationCircle,
  faPen,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

const ProductsPage: React.FC = () => {
  const {
    products,
    loading,
    error,
    successMessage,
    pagination,
    sortConfig,
    fetchProducts,
    bulkDelete,
    bulkUpdate,
    setError,
    setSuccessMessage,
    setSortConfig,
    setPagination
  } = useProducts();

  const { categories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isChangingLimit, setIsChangingLimit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds(prev => 
      isSelected 
        ? [...prev, id] 
        : prev.filter(item => item !== id)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedIds(isSelected ? products.map(p => p.id) : []);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleteConfirmOpen(false);
    if (selectedIds.length < 2) return;
    
    try {
      await bulkDelete(selectedIds);
      setSuccessMessage(`Успешно удалено ${selectedIds.length} товаров`);
      setSelectedIds([]);
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      setError('Ошибка массового удаления');
    }
  };

  const handleBulkUpdate = async (data: { price?: number; categoryId?: number }) => {
    if (selectedIds.length < 2) return;
    
    try {
      await bulkUpdate(selectedIds, data);
      setSuccessMessage(`Успешно обновлено ${selectedIds.length} товаров`);
      setIsBulkEditOpen(false);
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      setError('Ошибка изменения');
    }
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, pagination.limit, sortConfig.key, sortConfig.direction);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    fetchProducts(1, pagination.limit, key, direction);
  };

  const handleCreate = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        setSuccessMessage('Товар успешно удален');
        fetchProducts(pagination.page, pagination.limit);
      } catch (err) {
        setError('Ошибка удаления товара');
      }
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleSubmit = async (productData: any) => {
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, productData);
        setSuccessMessage('Товар успешно обновлен');
      } else {
        await createProduct(productData);
        setSuccessMessage('Товар успешно добавлен');
      }
      setIsModalOpen(false);
      fetchProducts(pagination.page, pagination.limit);
    } catch (err) {
      setError(currentProduct ? 'Ошибка обновления товара' : 'Ошибка создания товара');
    }
  };

  const handleLimitChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setIsChangingLimit(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    await fetchProducts(1, newLimit, sortConfig.key, sortConfig.direction);
    
    setIsChangingLimit(false);
  };

  if (loading && !products.length) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonHeader}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} style={{ marginBottom: 10, borderRadius: 8 }} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Управление товарами</h2>
        <div className={styles.controls}>
          <Link to="/home" className={styles.backLink}>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
            На главную
          </Link>
          <Button 
            variant="contained" 
            onClick={handleCreate}
            className={styles.addButton}
            startIcon={<FontAwesomeIcon icon={faPlus} className={styles.icon} />}
          >
            Добавить товар
          </Button>
        </div>
      </div>

      <motion.div
        className={styles.topControls}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.bulkActions}>
        <motion.button
            className={`${styles.bulkButton} ${styles.bulkEditButton}`}
            onClick={() => setIsBulkEditOpen(true)}
            disabled={selectedIds.length < 2}
            whileHover={selectedIds.length >= 2 ? { scale: 1.03 } : {}}
            whileTap={selectedIds.length >= 2 ? { scale: 0.98 } : {}}
          >
            <FontAwesomeIcon icon={faPen} className={styles.bulkIcon} />
            Массовое редактирование
            {selectedIds.length > 1 && (
              <span className={styles.badge}>{selectedIds.length}</span>
            )}
            {selectedIds.length < 2 && (
              <span className={styles.tooltip}>Выберите 2 или более товаров для массового редактирования</span>
            )}
          </motion.button>
          
          <motion.button
            className={`${styles.bulkButton} ${styles.bulkDeleteButton}`}
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
            disabled={selectedIds.length < 2}
            whileHover={selectedIds.length >= 2 ? { scale: 1.03 } : {}}
            whileTap={selectedIds.length >= 2 ? { scale: 0.98 } : {}}
          >
            <FontAwesomeIcon icon={faTrashAlt} className={styles.bulkIcon} />
            Удалить выбранные
            {selectedIds.length > 1 && (
              <span className={styles.badge}>{selectedIds.length}</span>
            )}
            {selectedIds.length < 2 && (
              <span className={styles.tooltip}>Выберите 2 или более товаров для удаления</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={`table-${pagination.limit}-${isChangingLimit}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={styles.tableContainer}
        >
          <ProductsTable
            products={products}
            sortConfig={sortConfig}
            selectedIds={selectedIds}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
          />
        </motion.div>
      </AnimatePresence>

      <div className={styles.paginationContainer}>
        <div className={styles.resultsInfo}>
          Показано {products.length} из {pagination.total} товаров
        </div>
        
        <div className={styles.paginationControls}>
          <motion.div 
            className={styles.limitSelector}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label>Товаров на странице:</label>
            <select 
              value={pagination.limit} 
              onChange={handleLimitChange}
              className={styles.limitSelect}
              disabled={isChangingLimit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </motion.div>
          
          {pagination.total > pagination.limit && (
            <Pagination
              count={Math.ceil(pagination.total / pagination.limit)}
              page={pagination.page}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
              shape="rounded"
              className={styles.pagination}
            />
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? "Редактировать товар" : "Добавить товар"}
        size="lg"
      >
        <ProductForm
          product={currentProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      <BulkEditModal
        isOpen={isBulkEditOpen}
        selectedCount={selectedIds.length}
        categories={categories}
        onClose={() => setIsBulkEditOpen(false)}
        onConfirm={handleBulkUpdate}
      />

      <BulkDeleteConfirmModal
        isOpen={isBulkDeleteConfirmOpen}
        selectedCount={selectedIds.length}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Alert severity="success" icon={false} className={styles.successAlert}>
            <div className={styles.alertContent}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
              {successMessage}
            </div>
          </Alert>
        </motion.div>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Alert severity="error" icon={false} className={styles.errorAlert}>
            <div className={styles.alertContent}>
              <FontAwesomeIcon icon={faExclamationCircle} className={styles.errorIcon} />
              {error}
            </div>
          </Alert>
        </motion.div>
      </Snackbar>
    </div>
  );
};

export default ProductsPage;