# Prompt Autofill

結構化 AI 繪圖提示詞填空器 — 完整復刻 [PromptFill](https://github.com/doggy8088/PromptFill) 並加入模組化、儲存與體驗優化。

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](public/version.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 功能特色

- **模板引擎**：`{{variable}}` 語法、多實例獨立索引、雙語 zh-tw / en
- **詞庫系統**：分類管理、拖曳插入、預覽自訂選項雙向同步、即時搜尋
- **發現頁**：瀑布流模板瀏覽、標籤篩選
- **匯出分享**：複製 Prompt、Gemini 一鍵開啟、JSON 備份匯入（含自動備份）
- **本機優先**：LocalStorage + IndexedDB 大圖儲存，無需登入
- **深色模式**：淺色 / 深色 / 跟隨系統
- **快捷鍵**：`Ctrl+Shift+C` 複製、`Ctrl+Shift+E` 匯出、`Ctrl+Shift+S` Gemini、`Esc` 關閉彈窗

## 快速開始

### 前置要求

- [Node.js](https://nodejs.org/) v18+

### 安裝與執行

```bash
git clone <your-repo-url> prompt-autofill
cd prompt-autofill
npm install
npm run dev
```

開啟 [http://localhost:1420](http://localhost:1420)

Windows 可雙擊 `start.bat` 一鍵啟動。

### 建置

```bash
npm run build    # 輸出至 dist/
npm run preview  # 預覽生產版本
```

## 測試

```bash
npm test              # Vitest 單元測試（27 案例）
npm run test:e2e      # Playwright E2E（需先 npm install）
```

首次執行 E2E 請安裝瀏覽器：

```bash
npx playwright install chromium
```

## 專案結構

```
src/
├── components/       # UI 元件（含 ImagePreviewModal、AnimatedSlogan）
├── constants/        # 翻譯、樣式、標籤
├── data/             # 內建模板與詞庫
├── hooks/            # useTheme、usePromptStats、useKeyboardShortcuts
├── services/         # IndexedDB 圖片儲存
├── utils/            # promptEngine、merge、helpers
└── __tests__/        # 單元測試

e2e/                  # Playwright E2E
plan.md spec.md       # 規劃與規格文件
```

## 相對原版的改善

| 項目 | 說明 |
|------|------|
| `promptEngine.js` | 變數解析/替換模組化 |
| `storage.js` | 大圖自動存入 IndexedDB |
| 匯入自動備份 | 覆蓋前 snapshot 至 `backup-{timestamp}` |
| Prompt 統計 | 字元數 + Token 估算 |
| 詞庫搜尋 | BanksSidebar 即時過濾 |
| App.jsx 拆分 | ImagePreviewModal、AnimatedSlogan 獨立元件 |
| 深色模式 | CSS 變數 + Tailwind `dark:` |

## 使用流程

1. **發現頁**選擇模板，或點「返回編輯器」進入編輯
2. **預覽互動**：點選彩色變數下拉填空
3. **編輯模板**：拖曳詞庫插入 `{{var}}`，Undo/Redo 調整
4. **複製結果**或 **Gemini** 匯出至繪圖工具
5. **設定**中可切換主題、語言、匯入/匯出 JSON 備份

## 文件

- [plan.md](./plan.md) — 專案計畫
- [spec.md](./spec.md) — 功能規格
- [test.md](./test.md) — 測試計畫
- [todos.md](./todos.md) — 實作進度
- [final.md](./final.md) — 交付摘要

## 致謝

- 原版：[TanShilongMario/PromptFill](https://github.com/TanShilongMario/PromptFill)
- 參考 Fork：[doggy8088/PromptFill](https://github.com/doggy8088/PromptFill)

## 授權

[MIT](./LICENSE)