import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Snackbar, Alert, Skeleton, Pagination } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlus, 
  faCheckCircle, 
  faExclamationCircle,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { useCategories } from './hooks/useCategories';
import CategoriesTable from './components/CategoriesTable/CategoriesTable';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
import BulkDeleteConfirmModal from './components/BulkDeleteConfirmModal/BulkDeleteConfirmModal';
import Modal from '../../../components/UI/Modal/Modal';
import CategoryForm from './components/CategoryForm/CategoryForm';
import { Category } from './types';
import styles from './Categories.module.css';

const CategoriesPage: React.FC = () => {
  const {
    categories,
    loading,
    error,
    successMessage,
    pagination,
    sortConfig,
    fetchCategories,
    createCategory,
    deleteCategory,
    bulkDelete,
    setSortConfig,
    setPagination
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isChangingLimit, setIsChangingLimit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds(prev => 
      isSelected ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedIds(isSelected ? categories.map(c => c.id) : []);
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleteConfirmOpen(false);
    if (selectedIds.length < 2) return;
    await bulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page, pagination.limit, sortConfig.key, sortConfig.direction);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    fetchCategories(1, pagination.limit, key, direction);
  };

  const handleCreate = () => {
    setCurrentCategory(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleSubmit = async (categoryData: { name: string }, shouldClose = true) => {
    try {
      if (currentCategory) return false;
      
      await createCategory(categoryData);
      shouldClose ? setIsModalOpen(false) : setCurrentCategory(undefined);
      return true;
    } catch {
      return false;
    }
  };

  const handleLimitChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setIsChangingLimit(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    await fetchCategories(1, newLimit, sortConfig.key, sortConfig.direction);
    setIsChangingLimit(false);
  };

  if (loading && !categories.length) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonHeader}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} className={styles.skeletonRow} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Управление категориями</h2>
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
            Добавить категорию
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
            className={`${styles.bulkButton} ${styles.bulkDeleteButton}`}
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
            disabled={selectedIds.length < 2}
            whileHover={selectedIds.length >= 2 ? { scale: 1.03 } : {}}
            whileTap={selectedIds.length >= 2 ? { scale: 0.98 } : {}}
          >
            <FontAwesomeIcon icon={faTrashAlt} className={styles.bulkIcon} />
            Удалить выбранные
            {selectedIds.length > 1 && <span className={styles.badge}>{selectedIds.length}</span>}
            {selectedIds.length < 2 && (
              <span className={styles.tooltip}>Выберите 2 или более категорий для удаления</span>
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
          <CategoriesTable
            categories={categories}
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
          Показано {categories.length} из {pagination.total} категорий
        </div>
        
        <div className={styles.paginationControls}>
          <motion.div 
            className={styles.limitSelector}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label>Категорий на странице:</label>
            <select 
              value={pagination.limit} 
              onChange={handleLimitChange}
              className={styles.limitSelect}
              disabled={isChangingLimit}
            >
              {[5, 10, 20, 50].map(limit => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
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
        title={currentCategory ? "Редактировать категорию" : "Добавить категорию"}
        size="lg"
      >
        <CategoryForm
          category={currentCategory}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={currentCategory?.name}
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

export default CategoriesPage;