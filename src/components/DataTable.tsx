import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  clickable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T, isFocused?: boolean) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchable?: boolean;
  defaultPageSize?: number;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  initialPage?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  onSearchChange?: (value: string) => void;
  searchDisabled?: boolean;
  searchValue?: string;
  latencyBadge?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string | number;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchable = true,
  defaultPageSize = 25,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  initialPage,
  onPageChange,
  totalCount,
  onSearchChange,
  searchDisabled = false,
  searchValue,
  latencyBadge,
  loading = false,
  loadingRows = 5,
  emptyMessage = 'No data found',
  onRowClick,
  getRowId,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(searchValue ?? '');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(defaultSortColumn ?? null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(initialPage ?? 1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (initialPage != null) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    if (searchValue !== undefined) {
      setSearchQuery(searchValue);
    }
  }, [searchValue]);

  const searchableColumns = useMemo(
    () => columns.filter(col => col.searchable),
    [columns]
  );

  const filteredData = useMemo(() => {
    if (searchDisabled || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(row =>
      searchableColumns.some(col => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, searchableColumns, searchDisabled]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  const displayTotalCount = totalCount ?? sortedData.length;
  const totalPages = displayTotalCount === 0 ? 0 : Math.ceil(displayTotalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, displayTotalCount);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    const newPage = 1;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    const newPage = 1;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleFirstPage = () => {
    const newPage = 1;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };
  const handlePreviousPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };
  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };
  const handleLastPage = () => {
    const newPage = totalPages;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (loading || paginatedData.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedRowIndex(prev => {
          const next = prev < 0 ? 0 : Math.min(prev + 1, paginatedData.length - 1);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedRowIndex(prev => Math.max(0, prev - 1));
        break;
      case 'Home':
        if (e.ctrlKey) {
          e.preventDefault();
          setFocusedRowIndex(0);
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          e.preventDefault();
          setFocusedRowIndex(paginatedData.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        if (focusedRowIndex >= 0 && focusedRowIndex < paginatedData.length) {
          e.preventDefault();
          const row = paginatedData[focusedRowIndex];

          // Trigger onRowClick if provided
          if (onRowClick) {
            onRowClick(row);
          }

          // Also try to click any clickable column link
          const clickableColumn = columns.find(col => col.clickable);
          if (clickableColumn && clickableColumn.render) {
            const cell = tableBodyRef.current?.querySelectorAll('tr')[focusedRowIndex]
              ?.querySelector(`[data-column="${String(clickableColumn.key)}"]`);
            if (cell) {
              const link = cell.querySelector('a');
              if (link) link.click();
            }
          }
        }
        break;
    }
  }, [loading, paginatedData, focusedRowIndex, onRowClick, columns]);

  const handleRowClick = useCallback((row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  }, [onRowClick]);

  const getRowKey = useCallback((row: T): string | number => {
    if (getRowId) {
      return getRowId(row);
    }
    return row.id;
  }, [getRowId]);

  useEffect(() => {
    if (focusedRowIndex >= 0 && tableBodyRef.current) {
      const rows = tableBodyRef.current.querySelectorAll('tr');
      const focusedRow = rows[focusedRowIndex] as HTMLElement;
      if (focusedRow) {
        focusedRow.focus();
      }
    }
  }, [focusedRowIndex]);

  // Generate unique table ID for ARIA
  const tableId = useMemo(() => `datatable-${Math.random().toString(36).substr(2, 9)}`, []);

  // Render loading skeleton rows
  const renderSkeletonRows = () => {
    return Array.from({ length: loadingRows }).map((_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`} aria-hidden="true">
        {columns.map((col, colIndex) => (
          <TableCell
            key={`skeleton-${rowIndex}-${colIndex}`}
            style={col.width ? { width: col.width } : undefined}
          >
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  // Determine if search should be shown
  const showSearch = searchable && !searchDisabled;

  return (
    <div
      className="space-y-4"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Data table"
    >
      {/* Search input */}
      {showSearch && (
        <div className="flex items-center gap-4">
          <div className="w-full sm:w-96">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
              aria-label="Search table"
              aria-controls={tableId}
              disabled={loading}
            />
          </div>
          {latencyBadge}
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={String(column.key)}
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    sortColumn === column.key
                      ? (sortDirection === 'asc' ? 'ascending' : 'descending')
                      : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1 -mx-1"
                      aria-label={`Sort by ${column.header}${sortColumn === column.key ? (sortDirection === 'asc' ? ', currently ascending' : ', currently descending') : ''}`}
                      disabled={loading}
                    >
                      {column.header}
                      <span className="w-4 h-4 inline-flex items-center justify-center" aria-hidden="true">
                        {sortColumn === column.key && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody
            ref={tableBodyRef}
            id={tableId}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? (
              renderSkeletonRows()
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={getRowKey(row)}
                  tabIndex={0}
                  role="row"
                  aria-rowindex={startIndex + rowIndex + 1}
                  aria-selected={focusedRowIndex === rowIndex}
                  className={`
                    outline-none focus:outline-none focus-visible:outline-none
                    ${focusedRowIndex === rowIndex ? 'bg-muted/50 ring-2 ring-inset ring-ring' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onFocus={() => setFocusedRowIndex(rowIndex)}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map(column => (
                    <TableCell
                      key={String(column.key)}
                      data-column={String(column.key)}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.render
                        ? column.render(row[column.key], row, focusedRowIndex === rowIndex)
                        : String(row[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                  role="cell"
                >
                  <p className="text-muted-foreground">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div
          className="text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            `Showing ${displayTotalCount === 0 ? 0 : startIndex + 1}-${endIndex} of ${displayTotalCount} row(s)`
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`${tableId}-pagesize`}
              className="text-sm text-muted-foreground"
            >
              Rows per page:
            </label>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
              disabled={loading}
            >
              <SelectTrigger
                className="w-20"
                id={`${tableId}-pagesize`}
                aria-label="Rows per page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <nav
            className="flex gap-2"
            role="navigation"
            aria-label="Table pagination"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirstPage}
              disabled={loading || currentPage === 1}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={loading || currentPage === 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={loading || currentPage === totalPages || totalPages === 0}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
              disabled={loading || currentPage === totalPages || totalPages === 0}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>

          <div
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              `Page ${totalPages === 0 ? 0 : currentPage} of ${totalPages}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
