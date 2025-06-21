import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './DeleteConfirmModal.module.css';
import { DeleteConfirmModalProps } from '../../types'

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.warningIcon}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIconSvg} />
          </div>
          <h3 className={styles.modalTitle}>Подтвердите удаление</h3>
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
         <strong>Перед этим удалите все товары из этой категории!</strong>
          </p>
          <p className={styles.warningText}>
            Вы уверены, что хотите удалить {itemName ? <strong>"{itemName}"</strong> : 'эту категорию'}?
          </p>
          <p className={styles.warningHint}>Это действие нельзя отменить.</p>
          
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

export default DeleteConfirmModal;