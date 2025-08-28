import { useState, useCallback, useEffect } from 'react';
import {
  AppShell,
  Container,
  Title,
  Group,
  Text,
  Stack,
  LoadingOverlay,
  Anchor,
  Center,
} from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import Papa from 'papaparse';
import { DataTable } from './components/DataTable.tsx';

export interface CSVData {
  headers: string[];
  rows: string[][];
}

export interface SortConfig {
  column: number;
  direction: 'asc' | 'desc';
}

function App() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [filteredData, setFilteredData] = useState<CSVData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSearch = useCallback((searchTerms: Record<string, string>) => {
    if (!csvData) return;

    let filtered = csvData.rows.filter((row: string[]) => {
      return Object.entries(searchTerms).every(([columnIndex, term]) => {
        if (!term.trim()) return true;
        const cellValue = row[parseInt(columnIndex)] || '';
        return cellValue.toLowerCase().includes(term.toLowerCase());
      });
    });

    // 如果有排序設定，重新應用排序
    if (sortConfig) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortConfig.column] || '';
        const bValue = b[sortConfig.column] || '';
        
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    setFilteredData({
      headers: csvData.headers,
      rows: filtered,
    });
  }, [csvData, sortConfig]);

  const handleSort = useCallback((columnIndex: number) => {
    if (!csvData) return;

    // 只允許對 Gloss 和 Proto-Seediq 欄位排序
    const sortableColumns = ['Gloss', 'Proto-Seediq'];
    const columnName = csvData.headers[columnIndex];
    if (!sortableColumns.includes(columnName)) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.column === columnIndex && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSortConfig = { column: columnIndex, direction };
    setSortConfig(newSortConfig);

    const sortedData = [...filteredData!.rows].sort((a, b) => {
      const aValue = a[columnIndex] || '';
      const bValue = b[columnIndex] || '';
      
      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredData({
      headers: filteredData!.headers,
      rows: sortedData,
    });
  }, [csvData, filteredData, sortConfig]);

  // 自動載入 data.csv 檔案
  useEffect(() => {
    const loadDataCSV = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.BASE_URL}data.csv`);
        if (!response.ok) {
          throw new Error('無法載入 data.csv 檔案');
        }
        
        const csvContent = await response.text();
        
        Papa.parse(csvContent, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              notifications.show({
                title: 'CSV 解析錯誤',
                message: results.errors[0].message,
                color: 'red',
              });
              setLoading(false);
              return;
            }

            const data = results.data as string[][];
            if (data.length === 0) {
              notifications.show({
                title: '檔案為空',
                message: 'data.csv 檔案沒有資料',
                color: 'red',
              });
              setLoading(false);
              return;
            }

            const allHeaders = data[0];
            const allRows = data.slice(1);

            // 排除 Proto-Toda-Truku 和 Proto-Truku 欄位
            const excludeColumns = ['Proto-Toda-Truku', 'Proto-Truku'];
            const columnIndexesToKeep = allHeaders
              .map((header, index) => !excludeColumns.includes(header) ? index : -1)
              .filter(index => index !== -1);

            const headers = columnIndexesToKeep.map(index => allHeaders[index]);
            
            // 清理資料：移除 = 符號、latex code、gloss 前後引號
            const cleanText = (text: string, isGloss: boolean = false): string => {
              if (!text) return '';
              
              let cleaned = text;
              
              // 移除 = 符號
              cleaned = cleaned.replace(/=/g, '');
              
              // 移除 latex code (如 \textsc{...})
              cleaned = cleaned.replace(/\\textsc\{([^}]*)\}/g, '$1');
              cleaned = cleaned.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
              
              // 如果是 Gloss 欄位，移除前後的引號
              if (isGloss) {
                cleaned = cleaned.replace(/^`/, '').replace(/'$/, '');
              }
              
              return cleaned.trim();
            };

            const rows = allRows.map(row => 
              columnIndexesToKeep.map((index, colIndex) => {
                const originalValue = row[index] || '';
                const isGlossColumn = headers[colIndex] === 'Gloss';
                return cleanText(originalValue, isGlossColumn);
              })
            );

            setCsvData({ headers, rows });
            setFilteredData({ headers, rows });
            setLoading(false);
          },
          error: (error: any) => {
            notifications.show({
              title: '檔案解析錯誤',
              message: error.message,
              color: 'red',
            });
            setLoading(false);
          },
        });
      } catch (error: any) {
        notifications.show({
          title: '載入失敗',
          message: '無法載入 data.csv，請確認檔案存在',
          color: 'red',
        });
        setLoading(false);
      }
    };

    loadDataCSV();
  }, []);

  return (
    <AppShell
      header={{ height: 70 }}
      footer={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-start">
          <Group>
            <IconDatabase size={28} style={{ color: 'var(--mantine-color-red-6)' }} />
            <Title order={3} c="red.6">
              Proto-Seediq Database
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" h="100%" pos="relative">
          <LoadingOverlay 
            visible={loading} 
            zIndex={1000} 
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ size: "lg", color: "red" }}
          />
          {!csvData && !loading ? (
            <Stack align="center" justify="center" h="60vh" gap="lg">
              <Title order={2} ta="center" c="red">
                載入錯誤
              </Title>
              <Text c="dimmed" ta="center">
                無法載入資料檔案，請檢查伺服器設定
              </Text>
            </Stack>
          ) : csvData ? (
            <Stack gap="md" h="100%">
              <Text size="lg" fw={500}>
                共 {filteredData?.rows.length || 0} 筆資料
                {csvData && filteredData && csvData.rows.length !== filteredData.rows.length && (
                  <Text component="span" size="sm" c="dimmed">
                    {' '}(從 {csvData.rows.length} 筆中篩選)
                  </Text>
                )}
              </Text>

              {filteredData && (
                <DataTable 
                  data={filteredData} 
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onSearch={handleSearch}
                />
              )}
            </Stack>
          ) : null}
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        <Center h="100%" px="md">
          <Text size="sm" c="dimmed" ta="center">
            資料來源：Song, Walis Hian-chi. 2025.{' '}
            <Anchor 
              href="https://etd.lib.nthu.edu.tw/detail/fa694e1976fa46ac5a6073d0dacc4117/" 
              target="_blank"
              c="red.6"
              style={{ textDecoration: 'none' }}
            >
              Eluw Ndaan Kari Seediq 賽德克語的歷史發展 The Historical Development of the Seediq Language
            </Anchor>
            . MA Thesis, National Tsing Hua University.
          </Text>
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
