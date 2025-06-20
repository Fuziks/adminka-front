import React from 'react';
import { Category, SortConfig } from '../../types';
import Table from '../../../../../components/UI/Table/Table';
import styles from './CategoriesTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBoxOpen, faPen } from '@fortawesome/free-solid-svg-icons';
import { CategoriesTableProps } from '../../types'

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  sortConfig,
  onSort,
  onEdit,
  onDelete
}) => {
  const columns = [
    { 
      header: 'ID', 
      accessor: 'id',
      sortable: true,
      width: '75px',
      headerClass: styles.tableHeader,
      cellClass: styles.idCell
    },
    { 
      header: 'Название', 
      accessor: 'name',
      sortable: true,
      width: '900px',
      headerClass: styles.tableHeader,
      cellClass: styles.nameCell
    },
    { 
      header: 'Действия', 
      accessor: 'actions',
      width: '200px',
      headerClass: `${styles.tableHeader} ${styles.actionsHeader}`,
      cellClass: styles.actionsCell,
      render: (item: Category) => (
        <div className={styles.actions}>
          <button 
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            aria-label={`Редактировать ${item.name}`}
          >
            <FontAwesomeIcon icon={faPen} className={styles.icon} />
            <span>Изменить</span>
          </button>
          <button 
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            aria-label={`Удалить ${item.name}`}
          >
            <FontAwesomeIcon icon={faTrashAlt} className={styles.icon} />
            <span>Удалить</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.tableContainer}>
      <Table 
        data={categories} 
        columns={columns}
        onSort={onSort}
        sortConfig={sortConfig}
        emptyState={
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faBoxOpen} size="2x" color="#94a3b8" />
            <h4>Нет категорий для отображения</h4>
            <p>Добавьте категории, чтобы они появились в таблице</p>
          </div>
        }
      />
    </div>
  );
};

export default CategoriesTable;