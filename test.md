# Prompt Autofill — 測試計畫

> 涵蓋單元測試、整合測試與手動驗收清單

---

## 1. 測試策略

| 層級 | 工具 | 範圍 | 目標覆蓋 |
|------|------|------|----------|
| 單元 | Vitest | utils、services、hooks | 核心邏輯 ≥80% |
| 元件 | @testing-library/react | promptEngine 整合點 | 關鍵路徑 |
| 建置 | `vite build` | 生產打包 | 零錯誤 |
| 手動 | 瀏覽器 | 完整 UX 流程 | 100% 驗收項 |

---

## 2. 測試環境設定

### 2.1 依賴（devDependencies）

```json
{
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^25.0.0"
}
```

### 2.2 指令

```bash
npm test              # 單次執行
npm run test:watch    # watch 模式
npm run build         # 建置驗證
```

### 2.3 Vitest 設定（vite.config.js 擴充）

```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/__tests__/setup.js',
}
```

---

## 3. 單元測試案例

### 3.1 `utils/promptEngine.js`

| ID | 案例 | 輸入 | 預期 |
|----|------|------|------|
| PE-01 | parseVariables 基本 | `"Hello {{name}}"` | `['name']` |
| PE-02 | parseVariables 重複 | `"{{a}} and {{a}}"` | `['a', 'a']` |
| PE-03 | getInstanceKey | `('color', 1)` | `'color-1'` |
| PE-04 | getInstanceKey 首次 | `('color', 0)` | `'color-0'` |
| PE-05 | resolvePrompt 字串選項 | content + selections | 替換正確文字 |
| PE-06 | resolvePrompt 雙語選項 | language='en' | 英文值 |
| PE-07 | resolvePrompt 多實例 | 兩個 {{x}} 不同選擇 | 各自替換 |
| PE-08 | resolvePrompt 未選擇 | 缺 selection | 保留 `{{var}}` 或空 |
| PE-09 | countStats | `"abcd"` | chars=4, tokens≈1 |
| PE-10 | countStats 中文 | `"你好世界"` | chars=4 |

### 3.2 `utils/helpers.js`

| ID | 案例 | 預期 |
|----|------|------|
| HL-01 | deepClone 巢狀物件 | 深拷貝不等於原物件 |
| HL-02 | makeUniqueKey 衝突 | 產生唯一 suffix |
| HL-03 | getLocalized 字串 | 直接返回 |
| HL-04 | getLocalized 物件 zh-tw | 返回中文 |
| HL-05 | getLocalized 物件 en | 返回英文 |
| HL-06 | getLocalized fallback | 缺語言時 fallback |

### 3.3 `utils/merge.js`

| ID | 案例 | 預期 |
|----|------|------|
| MG-01 | mergeTemplates 保留 selections | selections 合併 |
| MG-02 | mergeTemplates 使用者修改系統模板 | 產生備份 id |
| MG-03 | mergeTemplates 自訂模板 | 保留在列表 |
| MG-04 | mergeBanks 自訂選項 | 追加至系統詞庫 |
| MG-05 | mergeBanks 新自訂詞庫 | 完整保留 |
| MG-06 | mergeBanks 衝突 key | 重命名 |

### 3.4 `services/storage.js`

| ID | 案例 | 預期 |
|----|------|------|
| ST-01 | isLargeDataUrl 小圖 | false |
| ST-02 | isLargeDataUrl 大圖 | true (>200KB) |
| ST-03 | saveImage + loadImage | 往返一致 |
| ST-04 | removeImage | load 返回 null |

### 3.5 `hooks/useKeyboardShortcuts.js`

| ID | 案例 | 預期 |
|----|------|------|
| KB-01 | Ctrl+Shift+C | 觸發 onCopy |
| KB-02 | Escape | 觸發 onEscape |
| KB-03 | enabled=false | 不觸發 |

---

## 4. 手動驗收清單（E2E）

### 4.1 啟動與導航

- [ ] `npm run dev` 開啟 http://localhost:1420（或 5173）
- [ ] 發現頁顯示模板瀑布流
- [ ] 點擊模板進入編輯/預覽

### 4.2 填空流程

- [ ] 預覽模式下拉選擇變數值
- [ ] 同一變數兩次出現可獨立選擇
- [ ] 「+ 新增自訂選項」同步至詞庫
- [ ] 統計列顯示字元數與 token 估算

### 4.3 編輯流程

- [ ] 切換編輯模式，變數色彩正確
- [ ] 拖曳詞庫卡片插入變數
- [ ] Undo / Redo 可用
- [ ] 切回預覽模式內容一致

### 4.4 詞庫與分類

- [ ] 搜尋框過濾詞庫
- [ ] 新增詞庫組
- [ ] 管理分類改顏色
- [ ] 批次貼上多行選項

### 4.5 模板管理

- [ ] 新增模板
- [ ] 建立副本
- [ ] 刪除模板（保留至少一個）
- [ ] 上傳預覽圖（大圖走 IndexedDB）

### 4.6 匯出

- [ ] 複製結果到剪貼簿正確
- [ ] Ctrl+Shift+C 快捷鍵複製
- [ ] 儲存長圖下載 JPG
- [ ] 長圖含封面與正文

### 4.7 資料持久化

- [ ] 重整頁面資料保留
- [ ] JSON 匯出含完整資料
- [ ] JSON 匯入前自動備份
- [ ] 匯入後合併正確

### 4.8 國際化

- [ ] 切換英文後 UI 與選項更新
- [ ] 雙語模板顯示正確語言內容

### 4.9 行動端（可選，瀏覽器 DevTools）

- [ ] 寬度 <768px 顯示 MobileTabBar
- [ ] 側滑抽屜可開啟

---

## 5. 建置與 Lint 驗證

```bash
npm run build    # 預期：dist/ 產出，exit 0
npm test         # 預期：≥29 案例通過
```

---

## 6. 回歸風險點

| 區域 | 風險 | 測試重點 |
|------|------|----------|
| promptEngine 抽離 | 替換邏輯不一致 | PE-05~07 + 手動填空 |
| IndexedDB | 降級失敗 | ST-03 + 大圖上傳手動 |
| 匯入備份 | 備份覆蓋 | 匯入兩次檢查 backup key |
| 快捷鍵 | 與瀏覽器衝突 | 僅 Ctrl+Shift+* 組合 |

---

## 7. 測試資料夾結構

```
src/__tests__/
├── setup.js
├── promptEngine.test.js
├── helpers.test.js
├── merge.test.js
├── storage.test.js
└── useKeyboardShortcuts.test.js
```

---

## 8. 通過標準

- 所有單元測試通過（允許 0 failure）
- `npm run build` 成功
- 手動清單 §4.1–4.7 全部勾選
- 無 console error（正常操作流程）