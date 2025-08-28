# Proto Seediq - 互動式表格檢視器

一個專為賽德克語族語言學資料設計的互動式表格檢視器，基於 React 和 Mantine UI 構建，支援實時搜尋和智慧排序，並使用暗紅色作為主要配色。

## 功能特色

- 🗂️ **自動載入資料**：啟動時自動載入賽德克語族比較資料
- 🔍 **即時搜尋**：表格內建搜尋框，支援即時篩選
- 🔢 **智慧排序**：Gloss 和 Proto-Seediq 欄位支援 A-Z 排序功能
- 🧹 **資料清理**：自動移除 LaTeX 標記、等號和多餘符號
- 📱 **響應式設計**：適配各種螢幕尺寸
- 🎨 **簡潔主題**：使用暗紅色作為主要配色
- ⚡ **高效能**：使用防抖搜尋，快速處理 679 筆資料
- 🚀 **自動部署**：GitHub Pages 自動部署

## 技術棧

- **React 18** - 前端框架
- **Mantine UI 7** - UI 組件庫
- **TypeScript** - 型別安全
- **Vite** - 建置工具
- **Papa Parse** - CSV 解析
- **Emotion** - CSS-in-JS

## 安裝與執行

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 http://localhost:5173 啟動

### 3. 建置生產版本

```bash
npm run build
```

### 4. 部署到 GitHub Pages

當推送到 main 分支時，GitHub Actions 會自動建置並部署到 GitHub Pages：

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

部署完成後，可以在 `https://yourusername.github.io/proto-seediq/` 訪問線上版本。

## 使用方法

1. **啟動應用程式**
   - 開啟瀏覽器訪問 `http://localhost:5173`
   - 系統會自動載入 679 筆賽德克語族比較資料

2. **搜尋功能**
   - 在表格標頭下方每個欄位的搜尋框中輸入關鍵字
   - 支援同時在多個欄位進行搜尋
   - 搜尋結果會即時更新

3. **排序功能**
   - 點擊 Gloss 或 Proto-Seediq 欄位標題旁的排序圖示
   - 支援 A-Z 升序和 Z-A 降序排列
   - 排序會保持在搜尋篩選後的結果

## 資料說明

應用程式內建 679 筆賽德克語族的語言學比較資料，包含以下語言變體：

- **Gloss**: 詞義標註 *(支援排序)*
- **Proto-Seediq**: 原始賽德克語 *(支援排序)*
- **Tgdaya**: 德路固語
- **Central Toda**: 中部都達語
- **Central Truku**: 中部太魯閣語
- **Eastern Truku**: 東部太魯閣語

### 搜尋範例
- 在 **Gloss** 欄位搜尋：`water`、`house`、`1sg` 等詞義
- 在 **Proto-Seediq** 欄位搜尋特定重建形式
- 在各語言欄位搜尋對應詞彙進行比較

## 開發

### 專案結構

```
src/
├── components/          # UI 組件
│   └── DataTable.tsx   # 資料表格組件（含搜尋功能）
├── App.tsx             # 主應用程式組件
├── main.tsx           # 應用程式入口點
├── theme.ts           # Mantine 主題配置
└── index.css          # 全域樣式
public/
└── data.csv           # 賽德克語族比較資料
```

### 自訂樣式

主題配置在 `src/theme.ts` 中，您可以修改：
- 主要顏色 (primaryColor)
- 字體 (fontFamily)
- 圓角大小 (defaultRadius)
- 色彩深淺 (primaryShade)

## 授權

MIT License
