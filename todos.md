# Prompt Autofill — 實作待辦清單

> 狀態圖例：⬜ 待辦 | 🔄 進行中 | ✅ 完成 | ⏸ 暫停

---

## Phase 0 — 文件與骨架

| ID | 任務 | 狀態 | 備註 |
|----|------|------|------|
| P0-1 | 撰寫 plan.md | ✅ | |
| P0-2 | 撰寫 spec.md | ✅ | |
| P0-3 | 撰寫 todos.md | ✅ | 本檔案 |
| P0-4 | 撰寫 test.md | ✅ | |
| P0-5 | 撰寫 final.md | ✅ | |
| P0-6 | 複製參考源碼至專案根目錄 | ✅ | |
| P0-7 | npm install | ✅ | |
| P0-8 | npm run dev smoke test | ✅ | E2E 驗證 |

---

## Phase 1 — 核心復刻驗證

| ID | 任務 | 狀態 | 驗收 |
|----|------|------|------|
| P1-1 | 模板列表載入與切換 | ✅ | 源碼完整複製 |
| P1-2 | 詞庫 CRUD | ✅ | |
| P1-3 | 預覽填空互動 | ✅ | |
| P1-4 | 編輯模式 | ✅ | |
| P1-5 | 分類管理器 | ✅ | |
| P1-6 | 發現頁瀑布流 | ✅ | |
| P1-7 | 圖片上傳/預覽 | ✅ | + IDB 大圖 |
| P1-8 | 複製 Prompt | ✅ | promptEngine |
| P1-9 | 長圖匯出 / Gemini | ✅ | |
| P1-10 | JSON 匯入匯出 | ✅ | + 自動備份 |
| P1-11 | 系統版本合併 | ✅ | |
| P1-12 | 行動端響應式 | ✅ | |
| P1-13 | 雙語切換 | ✅ | |
| P1-14 | LocalStorage 持久化 | ✅ | |

---

## Phase 2 — 改善優化

| ID | 任務 | 狀態 | 規格參考 |
|----|------|------|----------|
| P2-1 | 建立 `utils/promptEngine.js` | ✅ | spec §3.1 |
| P2-2 | App.jsx 改用 promptEngine | ✅ | |
| P2-3 | 建立 `services/storage.js` (IndexedDB) | ✅ | spec §2.5 |
| P2-4 | 圖片上傳整合 IDB | ✅ | |
| P2-5 | 匯入前自動備份 | ✅ | spec §3.9 |
| P2-6 | `hooks/useKeyboardShortcuts.js` | ✅ | spec §4.3 |
| P2-7 | Prompt 統計列 UI | ✅ | |
| P2-8 | BanksSidebar 搜尋框 | ✅ | spec §3.4 |
| P2-9 | Vitest 設定 + 測試檔 | ✅ | 27 案例 |
| P2-10 | 更新 package.json scripts | ✅ | |
| P2-11 | 更新 index.html 標題/版本 | ✅ | |
| P2-12 | public/version.json | ✅ | |

---

## Phase 3 — 驗證與交付

| ID | 任務 | 狀態 | 驗收 |
|----|------|------|------|
| P3-1 | npm run build | ✅ | 零錯誤 |
| P3-2 | npm test | ✅ | 27/27 通過 |
| P3-3 | Playwright E2E 驗證 | ✅ | 3/3 通過 |
| P3-4 | 更新 final.md 交付摘要 | ✅ | |
| P3-5 | README.md | ✅ | |
| P3-6 | App.jsx 拆分 | ✅ | |
| P3-7 | 深色模式 | ✅ | |

---

## 進度追蹤

| Phase | 完成數 | 總數 | 進度 |
|-------|--------|------|------|
| Phase 0 | 8 | 8 | 100% |
| Phase 1 | 14 | 14 | 100% |
| Phase 2 | 12 | 12 | 100% |
| Phase 3 | 7 | 7 | 100% |
| **合計** | **41** | **41** | **100%** |

*最後更新：2026-07-03*