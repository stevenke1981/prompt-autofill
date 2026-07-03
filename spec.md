# Prompt Autofill — 功能規格書

> 版本：1.0.0-alpha  
> 基準：PromptFill v0.5.1 + 自訂優化項 I1–I7

---

## 1. 名詞定義

| 名詞 | 定義 |
|------|------|
| **模板 (Template)** | 含 `{{variable}}` 佔位符的 Prompt 文稿，可雙語 |
| **詞庫 (Bank)** | 變數名 → 候選選項列表的映射，附分類與標籤 |
| **分類 (Category)** | 詞庫的分組，含 id、label、color |
| **選擇 (Selection)** | 使用者為某變數實例選定的值，key 為 `varName` 或 `varName-N` |
| **系統資料** | `templates.js` / `banks.js` 內建的官方種子，帶 `SYSTEM_DATA_VERSION` |
| **使用者資料** | LocalStorage / IndexedDB 中持久化的自訂內容 |

---

## 2. 資料模型

### 2.1 Template

```typescript
interface Template {
  id: string;                          // 唯一，建議 tpl_ 前綴
  name: string | LocalizedString;
  content: string | LocalizedString;
  imageUrl?: string;
  imageUrls?: string[];                // 多圖預覽
  selections?: Record<string, string | LocalizedString>;
  tags?: string[];                     // 建築、人物、攝影…
  language?: 'zh-tw' | 'en' | ('zh-tw' | 'en')[];
}

type LocalizedString = { 'zh-tw': string; en: string };
```

### 2.2 Bank

```typescript
interface Bank {
  label: string | LocalizedString;
  category: string;                    // 對應 Category.id
  options: (string | LocalizedString)[];
}

type Banks = Record<string, Bank>;
```

### 2.3 Category

```typescript
interface Category {
  id: string;
  label: LocalizedString;
  color: string;                       // blue | amber | rose | emerald | violet | slate …
}
```

### 2.4 持久化 Keys（LocalStorage）

| Key | 內容 |
|-----|------|
| `templates` | Template[] |
| `banks` | Banks |
| `defaults` | Record<string, string> — 各詞庫預設選項 |
| `categories` | Record<string, Category> |
| `app_language` | `'zh-tw'` \| `'en'` |
| `app_storage_mode` | `'browser'` \| `'folder'` |
| `system_data_version` | 已同步的系統版本號 |
| `backup-{ISO8601}` | 匯入前自動備份快照 |

### 2.5 IndexedDB（新增）

- Database：`prompt-autofill`
- Store：`images` — key: `templateId`, value: `{ blob, updatedAt }`
- 用途：模板自訂預覽圖超過 200KB 時優先寫入 IDB，LocalStorage 僅存引用 key

---

## 3. 核心功能規格

### 3.1 變數語法與渲染

**語法**：`{{variable_name}}`，名稱允許 `[a-zA-Z0-9_]`。

**多實例規則**：
- 第 N 次出現的 `{{color}}` 對應 selection key `color-0`、`color-1`…
- 渲染時依出現順序遞增索引
- 最終輸出文字時替換為選定值的本地化字串

**promptEngine API**（新增模組）：

```js
parseVariables(content: string): string[]
getInstanceKey(varName: string, occurrenceIndex: number): string
resolvePrompt(content: string, selections: object, banks: object, language: string): string
countStats(text: string): { chars: number, tokensEstimate: number }
```

### 3.2 預覽互動模式

- 模板內 `{{var}}` 渲染為帶分類色的下拉膠囊
- 下拉底部「+ 新增自訂選項」→ 寫入詞庫並選中
- 未定義變數顯示「未定義變數」樣式
- 底部統計列（新增）：字元數 | 約略 Token

### 3.3 編輯模板模式

- `VisualEditor`：contenteditable 區域，變數 chip 不可部分刪除（整塊刪除）
- 拖曳詞庫卡片至編輯區插入 `{{key}}`
- `EditorToolbar`：插入變數 Modal、Undo、Redo
- 切換模式不遺失未保存內容（即時同步 state）

### 3.4 詞庫管理（BanksSidebar）

- 瀑布流多欄卡片列表
- 每卡：標籤名、分類色、選項列表（Enter 單筆、多行批次）
- 搜尋框（新增）：依 label / key / 選項文字過濾
- 「管理分類」→ CategoryManager：CRUD + 12 色預設
- 「建立新變數組」→ AddBankModal

### 3.5 模板管理（TemplatesSidebar）

- 列表：名稱、標籤、操作（重命名、副本、刪除）
- 至少保留 1 個模板
- 副本名稱加「（副本）」後綴
- 新建模板預設內容含範例變數

### 3.6 發現頁（DiscoveryView）

- 入口預設視圖，瀑布流卡片
- 每卡：封面圖、標題、標籤 drawer
- 標籤篩選列 + 搜尋
- 點擊進入模板詳情 / 編輯流程
- 行動端：3D 陀螺儀預覽、上下滑動展開文字

### 3.7 圖片管理

- 支援本機檔案（jpg/png/webp/gif）與 URL
- 上傳前 `compressImage`：max 512px，目標 ≤300KB
- 超過閾值 → IndexedDB（新增）
- 懸停操作：大圖、上傳、重置
- `Lightbox` 全螢幕檢視

### 3.8 匯出

**複製結果**：
- 輸出 `resolvePrompt` 後的純文字
- Toast「已複製」
- 快捷鍵 Ctrl+Shift+C（新增）

**儲存長圖**：
- 目標寬度 860px，scale 2.5，JPG quality 0.92
- 等待封面載入 + Base64 預取
- 按鈕 loading 態「匯出中...」
- 頂部封面（max-height 300px）+ 模糊色背景框

### 3.9 匯入 / 匯出 JSON

**匯出**：包含 templates、banks、categories、defaults、version、exportedAt

**匯入**：
1. 自動備份當前資料到 `backup-{timestamp}`（新增）
2. 解析 JSON，驗證必要欄位
3. 合併策略：使用者自訂模板保留；系統 id 走 `mergeTemplatesWithSystem`
4. Toast 顯示合併摘要

### 3.10 系統更新合併

觸發：啟動時比對 `SYSTEM_DATA_VERSION` vs local `system_data_version`

**模板合併**（`mergeTemplatesWithSystem`）：
- 系統模板強制更新 name/content
- 保留使用者 selections
- 若使用者曾改系統模板內容 → 備份為 `{id}_user_*`

**詞庫合併**（`mergeBanksWithSystem`）：
- 系統選項強制同步
- 使用者自訂選項（不在系統集合中）追加保留

### 3.11 國際化

- 支援 `zh-tw`、`en`
- `getLocalized(obj, language)` 統一取詞
- UI 字串來自 `TRANSLATIONS[language]`
- 模板/詞庫選項支援雙語物件

### 3.12 行動端

- breakpoint：md = 768px
- 側滑抽屜：模板列表、詞庫列表
- `MobileTabBar`：發現 / 編輯 / 設定
- `MobileSettingsView`：語言、儲存模式、版本、匯入匯出

---

## 4. UI / UX 規格

### 4.1 版面

```
桌面版：
┌─────────────────────────────────────────────────────┐
│  Header: Logo | 語言 | 設定 | 回到發現頁              │
├──────────┬─────────────────────────┬────────────────┤
│ 模板側欄  │   主編輯/預覽區          │   詞庫側欄      │
│          │   [統計列 - 新增]        │   [搜尋 - 新增]  │
└──────────┴─────────────────────────┴────────────────┘

行動版：
┌─────────────────────┐
│  發現頁 / 詳情 / 編輯  │
├─────────────────────┤
│  MobileTabBar       │
└─────────────────────┘
```

### 4.2 色彩系統

- 分類色：`CATEGORY_STYLES` 映射 Tailwind 色票
- Premium 按鈕：漸變 + hover 陰影（`PREMIUM_STYLES`）
- 標籤：`TAG_STYLES` / `TAG_LABELS`

### 4.3 快捷鍵（新增）

| 快捷鍵 | 動作 |
|--------|------|
| `Ctrl+Shift+C` | 複製當前 Prompt |
| `Ctrl+Shift+E` | 觸發 JSON 匯出 |
| `Ctrl+Shift+S` | 儲存長圖（非編輯模式） |
| `Escape` | 關閉最上層 Modal / Lightbox |

---

## 5. API / 模組介面

### 5.1 storageService（新增）

```js
init(): Promise<void>
saveImage(templateId: string, dataUrl: string): Promise<void>
loadImage(templateId: string): Promise<string | null>
removeImage(templateId: string): Promise<void>
isLargeDataUrl(dataUrl: string): boolean
```

### 5.2 useKeyboardShortcuts（新增）

```js
useKeyboardShortcuts(handlers: {
  onCopy?: () => void;
  onExportJson?: () => void;
  onExportImage?: () => void;
  onEscape?: () => void;
}, enabled: boolean): void
```

### 5.3 useStickyState（沿用 + 擴充）

- 維持原版 LocalStorage 同步
- storage mode = `folder` 時跳過寫入（保留原版行為）

---

## 6. 內建資料規格

### 6.1 系統模板

- 數量：與原版 `INITIAL_TEMPLATES_CONFIG` 一致（18+ 模板）
- 必含：角色概念分解圖、3x3 攝影網格、雜誌封面、企業成長路等
- 每模板含 `tags`、`imageUrl`、`selections` 預設

### 6.2 系統詞庫

- `INITIAL_BANKS`：role、subject、ratio、style 等 30+ 組
- `INITIAL_CATEGORIES`：6 大類
- `INITIAL_DEFAULTS`：各詞庫預設選中項

### 6.3 版本檔

`public/version.json`：

```json
{
  "appVersion": "1.0.0",
  "systemDataVersion": "0.7.4",
  "basedOn": "PromptFill 0.5.1"
}
```

---

## 7. 效能需求

| 指標 | 目標 |
|------|------|
| 首屏可互動 | < 3s（本地 dev） |
| 模板切換 | < 100ms 感知延遲 |
| 長圖匯出 | < 10s（含圖片預載） |
| 詞庫搜尋 | 即時（< 50ms，500 選項內） |

---

## 8. 瀏覽器支援

- Chrome / Edge 100+
- Firefox 100+
- Safari 15+（iOS 行動端陀螺儀需權限）
- 不支援 IE

---

## 9. 授權

- 原版 MIT License，本專案同 MIT
- 保留對 TanShilongMario / doggy8088 原作者致謝