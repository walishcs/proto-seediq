import { useMemo, useState, useCallback, useEffect } from 'react';
import { Table, ScrollArea, Text, Box, ActionIcon, Group, TextInput } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconSelector, IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import type { CSVData, SortConfig } from '../App';

interface DataTableProps {
  data: CSVData;
  onSort: (columnIndex: number) => void;
  sortConfig: SortConfig | null;
  onSearch: (searchTerms: Record<string, string>) => void;
}

export function DataTable({ data, onSort, sortConfig, onSearch }: DataTableProps) {
  const { headers, rows } = data;
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [debouncedSearchTerms] = useDebouncedValue(searchTerms, 300);

  useEffect(() => {
    onSearch(debouncedSearchTerms);
  }, [debouncedSearchTerms, onSearch]);

  const handleSearchChange = useCallback((columnIndex: number, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [columnIndex]: value,
    }));
  }, []);

  const handleClearSearch = useCallback((columnIndex: number) => {
    setSearchTerms(prev => {
      const newTerms = { ...prev };
      delete newTerms[columnIndex];
      return newTerms;
    });
  }, []);

  const getSortIcon = (columnIndex: number) => {
    const sortableColumns = ['Gloss', 'Proto-Seediq'];
    const columnName = headers[columnIndex];
    
    if (!sortableColumns.includes(columnName)) {
      return null;
    }

    if (sortConfig && sortConfig.column === columnIndex) {
      return sortConfig.direction === 'asc' ? 
        <IconSortAscending size={16} /> : 
        <IconSortDescending size={16} />;
    }
    
    return <IconSelector size={16} />;
  };

  const isSortable = (columnIndex: number) => {
    const sortableColumns = ['Gloss', 'Proto-Seediq'];
    return sortableColumns.includes(headers[columnIndex]);
  };

  const tableContent = useMemo(() => {
    if (rows.length === 0) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={headers.length}>
              <Text ta="center" c="dimmed" py="xl">
                沒有符合搜尋條件的資料
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    return (
      <Table.Tbody>
        {rows.map((row, rowIndex) => (
          <Table.Tr key={rowIndex}>
            {headers.map((_, colIndex) => (
              <Table.Td key={colIndex} style={{ 
                width: headers[colIndex] === 'Gloss' ? '40%' : `${60 / (headers.length - 1)}%`,
                minWidth: headers[colIndex] === 'Gloss' ? 300 : 120 
              }}>
                <Text size="sm" style={{ wordBreak: 'break-word' }}>
                  {row[colIndex] || ''}
                </Text>
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    );
  }, [rows, headers]);

  const getColumnStyle = (index: number) => {
    const columnName = headers[index];
    if (columnName === 'Gloss') {
      // Gloss 欄位佔用更多寬度
      return { 
        minWidth: 300, 
        width: '25%',
        paddingBottom: 8 
      };
    } else {
      // 其他欄位平均分配剩餘寬度
      return { 
        minWidth: 120, 
        width: `${60 / (headers.length - 1)}%`,
        paddingBottom: 8 
      };
    }
  };

  const getSearchColumnStyle = (index: number) => {
    const columnName = headers[index];
    if (columnName === 'Gloss') {
      return { 
        minWidth: 300, 
        width: '40%',
        paddingTop: 0, 
        paddingBottom: 8 
      };
    } else {
      return { 
        minWidth: 120, 
        width: `${60 / (headers.length - 1)}%`,
        paddingTop: 0, 
        paddingBottom: 8 
      };
    }
  };

  return (
    <Box style={{ flex: 1, minHeight: 0 }}>
      <ScrollArea h="100%" type="auto">
        <Table
          striped
          withTableBorder
          withColumnBorders
          style={{
            minWidth: 1000,
            tableLayout: 'fixed',
          }}
        >
          <Table.Thead
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'var(--mantine-color-gray-1)',
              zIndex: 1,
            }}
          >
            {/* 標題列 */}
            <Table.Tr>
              {headers.map((header, index) => (
                <Table.Th key={index} style={getColumnStyle(index)}>
                  {isSortable(index) ? (
                    <Group gap="xs" justify="space-between" wrap="nowrap">
                      <Text fw={600} size="sm" style={{ flex: 1 }}>
                        {header}
                      </Text>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => onSort(index)}
                        style={{ cursor: 'pointer' }}
                        c="gray.6"
                      >
                        {getSortIcon(index)}
                      </ActionIcon>
                    </Group>
                  ) : (
                    <Text fw={600} size="sm">
                      {header}
                    </Text>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
            {/* 搜尋列 */}
            <Table.Tr>
              {headers.map((header, index) => (
                <Table.Th key={`search-${index}`} style={getSearchColumnStyle(index)}>
                  <TextInput
                    placeholder={`搜尋 ${header}`}
                    value={searchTerms[index] || ''}
                    onChange={(event) => handleSearchChange(index, event.currentTarget.value)}
                    leftSection={<IconSearch size={14} />}
                    rightSection={
                      searchTerms[index] ? (
                        <ActionIcon
                          size="sm"
                          variant="transparent"
                          onClick={() => handleClearSearch(index)}
                          aria-label={`清除 ${header} 搜尋`}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      ) : null
                    }
                    size="xs"
                    styles={{
                      input: {
                        fontSize: '12px',
                        height: '28px',
                      },
                    }}
                  />
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          {tableContent}
        </Table>
      </ScrollArea>
    </Box>
  );
}
