import React from 'react';
import { Category, SortConfig } from '../../types';
import Table from '../../../../../components/UI/Table/Table';
import styles from './CategoriesTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBoxOpen, faPen } from '@fortawesome/free-solid-svg-icons';
import { CategoriesTableProps } from '../../types';

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  sortConfig,
  selectedIds,
  onSort,
  onEdit,
  onDelete,
  onSelect,
  onSelectAll
}) => {
  const columns = [
    { 
      header: (
        <input
          type="checkbox"
          checked={categories.length > 0 && categories.every(c => selectedIds.includes(c.id))}
          onChange={(e) => onSelectAll(e.target.checked)}
          className={styles.checkbox}
        />  
      ),
      accessor: 'select',
      width: '50px',
      headerClass: styles.checkboxHeader,
      cellClass: styles.checkboxCell,
      render: (item: Category) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(item.id, e.target.checked);
          }}
          className={styles.checkbox}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    { 
      header: 'ID', 
      accessor: 'id',
      sortable: true,
      width: '60px',
      headerClass: styles.tableHeader,
      cellClass: styles.idCell
    },
    { 
      header: 'Название', 
      accessor: 'name',
      sortable: true,
      width: '800px',
      headerClass: styles.tableHeader,
      cellClass: styles.nameCell,
    },
    { 
      header: 'Действия', 
      accessor: 'actions',
      width: '200px',
      headerClass: styles.tableHeader,
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
            Изменить
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
            Удалить
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
