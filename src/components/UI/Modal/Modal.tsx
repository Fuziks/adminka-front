import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Modal.module.css';
import { ModalProps } from '../types';

const sizeClasses = {
  sm: styles.modalSm,
  md: styles.modalMd,
  lg: styles.modalLg
};

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${sizeClasses[size]}`}>
        <div className={styles.modalHeader}>
          {title && <h3 className={styles.modalTitle}>{title}</h3>}
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;