import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './BulkDeleteConfirmModal.module.css';
import { BulkDeleteConfirmModalProps } from '../../types';

const BulkDeleteConfirmModal: React.FC<BulkDeleteConfirmModalProps> = ({ 
  isOpen, 
  selectedCount,
  onClose, 
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.warningIcon}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIconSvg} />
          </div>
          <h3 className={styles.modalTitle}>Подтвердите массовое удаление</h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Закрыть"
          >
            <FontAwesomeIcon icon={faTimes} className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.modalContent}>
         <p className={styles.warningText}>
         <strong>Перед этим удалите все товары из этих категорий!</strong>
          </p>
          <p className={styles.warningText}>
            Вы уверены, что хотите удалить <strong>{selectedCount} категорий</strong>?
          </p>
          <p className={styles.warningHint}>
            Это действие нельзя отменить. 
          </p>
          
          <div className={styles.actions}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
            >
              Отменить
            </button>
            <button 
              className={styles.confirmButton} 
              onClick={onConfirm}
            >
              <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} />
              Да, удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteConfirmModal;