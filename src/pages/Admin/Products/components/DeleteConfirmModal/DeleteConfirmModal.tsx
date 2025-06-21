import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './DeleteConfirmModal.module.css';
import { DeleteConfirmModalProps } from '../../types';

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
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h3>Подтвердите удаление</h3>
          <button onClick={onClose} aria-label="Закрыть">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <p>
            Вы уверены, что хотите удалить {itemName ? <strong>"{itemName}"</strong> : 'этот товар'}?
          </p>
          <p>Это действие нельзя отменить.</p>
          
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Отменить
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              <FontAwesomeIcon icon={faTrashAlt} />
              Да, удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;