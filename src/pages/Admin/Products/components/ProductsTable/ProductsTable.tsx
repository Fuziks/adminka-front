import React from 'react';
import { Product, SortConfig } from '../../types';
import Table from '../../../../../components/UI/Table/Table';
import styles from './ProductsTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBoxOpen, faPen } from '@fortawesome/free-solid-svg-icons';
import { ProductsTableProps } from '../../types';

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  sortConfig,
  selectedIds,
  onSort,
  onEdit,
  onDelete,
  onSelect,
  onSelectAll
}) => {
  const formatPrice = (price: number | string): string => {
    const numericValue = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.]/g, '')) 
      : price;

    return !isNaN(numericValue) 
      ? `${numericValue.toLocaleString('ru-RU', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} ₽`
      : 'Н/Д';
  };

  const getCategoryName = (category: Product['category']): string => {
    return !category ? 'Без категории' : typeof category === 'string' ? category : category.name;
  };

  const renderCheckbox = (item?: Product) => (
    <input
      type="checkbox"
      checked={item ? selectedIds.includes(item.id) : products.every(p => selectedIds.includes(p.id))}
      onChange={(e) => item ? onSelect(item.id, e.target.checked) : onSelectAll(e.target.checked)}
      className={styles.checkbox}
      onClick={(e) => e.stopPropagation()}
    />
  );

  const renderActions = (item: Product) => (
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
  );

  const columns = [
    { 
      header: renderCheckbox(),
      accessor: 'select',
      width: '50px',
      headerClass: styles.checkboxHeader,
      cellClass: styles.checkboxCell,
      render: renderCheckbox
    },
    { 
      header: 'ID', 
      accessor: 'id',
      sortable: true,
      width: '90px',
      headerClass: styles.tableHeader,
      cellClass: styles.idCell
    },
    { 
      header: 'Название', 
      accessor: 'name',
      sortable: true,
      width: '300px',
      headerClass: styles.tableHeader,
      cellClass: styles.brandCell,
    },
    { 
      header: 'Бренд', 
      accessor: 'brand',
      sortable: true,
      width: '180px',
      headerClass: styles.tableHeader,
      cellClass: styles.brandCell,
    },
    { 
      header: 'Цена', 
      accessor: 'price',
      sortable: true,
      width: '200px',
      headerClass: styles.tableHeader,
      cellClass: styles.priceCell,
      render: (item: Product) => formatPrice(item.price)
    },
    { 
      header: 'Категория', 
      accessor: 'category',
      width: '200px',
      headerClass: styles.tableHeader,
      cellClass: styles.brandCell,
      render: (item: Product) => (
        <span className={styles.categoryBadge}>
          {getCategoryName(item.category)}
        </span>
      )
    },
    { 
      header: 'Действия', 
      accessor: 'actions',
      width: '200px',
      headerClass: styles.tableHeader,
      cellClass: styles.actionsCell,
      render: renderActions
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Table 
        data={products} 
        columns={columns}
        onSort={onSort}
        sortConfig={sortConfig}
        emptyState={
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faBoxOpen} size="2x" color="#94a3b8" />
            <h4>Нет товаров для отображения</h4>
            <p>Добавьте товары, чтобы они появились в таблице</p>
          </div>
        }
      />
    </div>
  );
};

export default ProductsTable;