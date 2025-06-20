import React from 'react';
import { motion } from 'framer-motion';
import styles from './Table.module.css';
import { TableProps } from '../types'

const Table: React.FC<TableProps> = ({ 
  data, 
  columns, 
  onSort,
  sortConfig,
  pagination,
  isLoading = false,
  emptyState
}) => {
  const handlePageChange = (page: number) => {
    if (!pagination) return;
    if (page < 1 || page > Math.ceil(pagination.total / pagination.limit)) return;
    pagination.onChange(page);
  };

  const handleSort = (key: string) => {
    if (!onSort || !sortConfig || isLoading) return;
    
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    onSort(key, direction);
  };

  const renderCellContent = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  const renderPaginationItems = () => {
    if (!pagination) return null;
    
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = pagination.page;
    const items = [];
    
    items.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isLoading}
        className={currentPage === 1 ? styles.activePage : ''}
      >
        1
      </button>
    );
    
    if (currentPage > 3) {
      items.push(<span key="left-ellipsis" className={styles.ellipsis}>...</span>);
    }
    
    if (currentPage > 2) {
      items.push(
        <button
          key={currentPage - 1}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading}
        >
          {currentPage - 1}
        </button>
      );
    }
    
    if (currentPage !== 1 && currentPage !== totalPages) {
      items.push(
        <button
          key={currentPage}
          className={styles.activePage}
          onClick={() => handlePageChange(currentPage)}
          disabled={isLoading}
        >
          {currentPage}
        </button>
      );
    }
    
    if (currentPage < totalPages - 1) {
      items.push(
        <button
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLoading}
        >
          {currentPage + 1}
        </button>
      );
    }
    
    if (currentPage < totalPages - 2) {
      items.push(<span key="right-ellipsis" className={styles.ellipsis}>...</span>);
    }
    
    if (totalPages > 1) {
      items.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className={currentPage === totalPages ? styles.activePage : ''}
        >
          {totalPages}
        </button>
      );
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <div>Загрузка данных...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        {emptyState || (
          <div className={styles.defaultEmptyState}>
            Нет данных для отображения
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.accessor}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                  className={column.sortable ? styles.sortableHeader : ''}
                >
                  <div className={styles.headerContent}>
                    {column.header}
                    {column.sortable && sortConfig?.key === column.accessor && (
                      <span className={styles.sortArrow}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}              >
                {columns.map((column) => (
                  <td key={`${item.id}-${column.accessor}`}>
                    {column.render 
                      ? column.render(item) 
                      : renderCellContent(item[column.accessor])
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {pagination && (
        <motion.div 
          className={styles.pagination}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            className={styles.navButton}
            disabled={pagination.page === 1 || isLoading}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            &lt;
          </button>
          
          <div className={styles.pageNumbers}>
            {renderPaginationItems()}
          </div>
          
          <button
            className={styles.navButton}
            disabled={pagination.page * pagination.limit >= pagination.total || isLoading}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            &gt;
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Table;