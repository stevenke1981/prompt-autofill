# Prompt Autofill — 專案計畫

> 參考來源：[doggy8088/PromptFill](https://github.com/doggy8088/PromptFill) v0.5.1  
> 目標：完整復刻「結構化 AI 繪圖提示詞填空器」，並加入架構與體驗優化。

---

## 1. 專案背景

PromptFill 是一款專為 AI 繪圖（GPT Image、Nano Banana、Gemini 等）設計的**結構化提示詞產生工具**。使用者透過 `{{variable}}` 模板語法，以可視化「填空」方式快速組裝複雜 Prompt，搭配詞庫分類管理、模板瀑布流發現頁、長圖匯出與本機持久化。

本專案（`prompt-autofill`）在其基礎上**完整復刻核心功能**，並針對可維護性、儲存可靠性、開發者體驗與使用者效率做增量優化。

---

## 2. 目標與非目標

### 2.1 目標（Must Have）

| 編號 | 目標 | 驗收標準 |
|------|------|----------|
| G1 | 模板引擎 | 支援 `{{var}}` 語法、多實例獨立索引、雙語 zh-tw/en |
| G2 | 詞庫系統 | 分類管理、選項 CRUD、拖曳插入、預覽自訂選項雙向同步 |
| G3 | 視覺編輯 | WYSIWYG 編輯器、Undo/Redo、分類色彩高亮 |
| G4 | 發現頁 | 瀑布流模板列表、標籤篩選、搜尋 |
| G5 | 圖片管理 | 預覽圖上傳/重置/Lightbox、模糊背景、多圖支援 |
| G6 | 匯出分享 | 複製純文字 Prompt、html2canvas 長圖匯出（JPG） |
| G7 | 資料持久化 | LocalStorage 自動保存；系統模板/詞庫智慧合併升級 |
| G8 | 行動端 | 響應式版面、側滑抽屜、行動設定頁 |
| G9 | 匯入匯出 | JSON 完整備份/還原，匯入前自動備份 |
| G10 | 改善優化 | 見 §4 |

### 2.2 非目標（Out of Scope — Phase 1）

- iOS / Electron / Tauri 原生應用
- 雲端帳號同步與社群模板市集
- AI 自動擴充詞庫 / 提示詞重組（Roadmap 預留介面）
- 完整 TypeScript 遷移（Phase 1 維持 JSX + JSDoc）

---

## 3. 技術架構

```
prompt-autofill/
├── public/                 # 靜態資源、version.json
├── src/
│   ├── App.jsx             # 主應用（逐步拆分）
│   ├── components/         # UI 元件
│   ├── constants/          # 樣式、翻譯、標籤
│   ├── contexts/           # Toast 等 Context
│   ├── data/               # banks.js、templates.js（系統種子資料）
│   ├── hooks/              # useStickyState、useKeyboardShortcuts（新增）
│   ├── services/           # storage.js — IndexedDB 適配層（新增）
│   ├── utils/              # merge、helpers、imageUtils、promptEngine（新增）
│   └── __tests__/          # Vitest 單元測試（新增）
├── scripts/                # sync-data.mjs（可選）
├── plan.md / spec.md / todos.md / test.md / final.md
└── vite.config.js
```

### 技術棧

| 層級 | 選型 | 說明 |
|------|------|------|
| 建置 | Vite 5 | 與原版一致，`base: './'` 支援靜態部署 |
| UI | React 18 + Tailwind 3 | 元件化、響應式 |
| 圖示 | lucide-react | 與原版一致 |
| 匯出 | html2canvas | 長圖渲染 |
| 壓縮 | lz-string | URL 分享（保留） |
| 測試 | Vitest + @testing-library/react | 核心邏輯覆蓋 |
| 儲存 | LocalStorage + IndexedDB | 雙層：小資料 LS，大圖 IDB |

---

## 4. 改善優化清單（相對原版）

| 編號 | 優化項 | 理由 | 優先級 |
|------|--------|------|--------|
| I1 | **Prompt 引擎模組化** | 將變數解析、替換、多實例索引抽至 `utils/promptEngine.js`，可單測 | P0 |
| I2 | **IndexedDB 圖片儲存** | 避免 LocalStorage 5MB 配額導致大圖失敗 | P0 |
| I3 | **匯入前自動備份** | 匯入 JSON 前自動 snapshot 至 `backup-{timestamp}` | P0 |
| I4 | **鍵盤快捷鍵** | Ctrl+Shift+C 複製、Ctrl+Shift+S 匯出備份、Esc 關閉彈窗 | P1 |
| I5 | **Prompt 字元/Token 統計** | 預覽區顯示字元數與約略 token（÷4 估算） | P1 |
| I6 | **詞庫搜尋** | BanksSidebar 新增即時搜尋過濾 | P1 |
| I7 | **Vitest 測試基礎建設** | merge、promptEngine、helpers 單元測試 | P1 |
| I8 | **App.jsx 漸進拆分** | 抽出 `useAppState`、`ImagePreviewModal` 至獨立檔 | P2 |
| I9 | **深色模式** | `prefers-color-scheme` + 手動切換，CSS 變數驅動 | P2 |
| I10 | **版本品牌** | 專案更名 `prompt-autofill`，獨立 version.json | P2 |

---

## 5. 實作階段

### Phase 0 — 文件與骨架（本輪）
- [x] 撰寫 plan.md、spec.md、todos.md、test.md、final.md
- [ ] 從參考 repo 複製源碼至專案根目錄
- [ ] `npm install` 驗證可啟動

### Phase 1 — 核心復刻
- [ ] 確認所有原版元件可正常載入
- [ ] 內建模板/詞庫資料完整
- [ ] 發現頁、編輯頁、匯出功能 smoke test

### Phase 2 — 改善優化（I1–I7）
- [ ] promptEngine 模組 + 測試
- [ ] IndexedDB storage service
- [ ] 匯入自動備份、快捷鍵、統計列、詞庫搜尋

### Phase 3 — 收尾
- [ ] 建置 `npm run build` 通過
- [ ] `npm test` 全綠
- [ ] 更新 final.md 交付摘要

---

## 6. 風險與緩解

| 風險 | 影響 | 緩解 |
|------|------|------|
| App.jsx 逾 3000 行難維護 | 改動易回歸 | 先抽 utils/hooks，不全量重寫 |
| html2canvas 跨域圖片 | 匯出空白 | 保留 Base64 預取邏輯 |
| IndexedDB 瀏覽器差異 | 儲存失敗 | LocalStorage 降級 + Toast 提示 |
| 大體積 banks/templates.js | 載入慢 | 維持原版懶載入策略，不拆包 Phase 1 |

---

## 7. 成功指標

1. `npm run dev` 可開啟並完成「選模板 → 填空 → 複製 → 匯出長圖」全流程
2. `npm run build` 零錯誤
3. `npm test` ≥ 15 個測試案例通過
4. 改善項 I1–I7 均可演示
5. 使用者資料在重整後保留，系統更新合併不覆蓋自訂選項

---

## 8. 參考連結

- 上游原版：[TanShilongMario/PromptFill](https://github.com/TanShilongMario/PromptFill)
- Fork 參考：[doggy8088/PromptFill](https://github.com/doggy8088/PromptFill)
- 線上 Demo：[learn.duotify.com/user/webapps/prompt-fill/](https://learn.duotify.com/user/webapps/prompt-fill/)