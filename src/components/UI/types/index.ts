export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface Column {
  header: string | React.ReactNode;
  accessor: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
  width?: string;
}

export interface TableProps {
  data: any[];
  columns: Column[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onChange: (page: number) => void;
  };
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}