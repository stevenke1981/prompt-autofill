/**
 * Standard deliverables section appended to prompt templates.
 * Uses {{variable}} placeholders filled via banks sidebar.
 */

export const DELIVERABLES_SECTION = {
  'zh-tw': `### Deliverables (交付物要求)
請**嚴格**按以下規格產出，不得遺漏任何必填項目：

**1. 主要交付物**
- {{deliverable_primary}}

**2. 技術規格**
- **輸出格式：** {{output_format}}
- **畫幅比例：** {{ratio}}
- **解析度/品質：** {{output_resolution}}
- **交付數量：** {{output_count}}

**3. 驗收標準（Acceptance Criteria）**
- 主體完整入畫，無意外裁切或遮擋關鍵元素
- 光影、透視、風格與前述規範一致
- 無浮水印、無無關 UI 元素、無拼貼破綻
- 文字/標註（若有）清晰可讀

**4. 交付方式**
- 一次性交付完整成品；若需分批，請標註 Part 1/N 並說明剩餘內容`,

  en: `### Deliverables
Produce output **strictly** according to the following specifications. Do not omit any required item:

**1. Primary Deliverable**
- {{deliverable_primary}}

**2. Technical Specs**
- **Output Format:** {{output_format}}
- **Aspect Ratio:** {{ratio}}
- **Resolution/Quality:** {{output_resolution}}
- **Quantity:** {{output_count}}

**3. Acceptance Criteria**
- Subject fully in frame; no accidental cropping or occlusion of key elements
- Lighting, perspective, and style consistent with guidelines above
- No watermarks, unrelated UI elements, or collage artifacts
- Text/annotations (if any) must be legible

**4. Delivery Method**
- Deliver the complete final work in one pass; if batching is required, label Part 1/N and state remaining content`,
};

const HAS_DELIVERABLES = /###\s*Deliverables|交付物要求/;

export const withDeliverables = (content) => {
  if (!content) return content;

  if (typeof content === 'string') {
    if (HAS_DELIVERABLES.test(content)) return content;
    return `${content.trim()}\n\n${DELIVERABLES_SECTION['zh-tw']}`;
  }

  return {
    'zh-tw': HAS_DELIVERABLES.test(content['zh-tw'] || '')
      ? content['zh-tw']
      : `${(content['zh-tw'] || '').trim()}\n\n${DELIVERABLES_SECTION['zh-tw']}`,
    en: HAS_DELIVERABLES.test(content.en || '')
      ? content.en
      : `${(content.en || '').trim()}\n\n${DELIVERABLES_SECTION.en}`,
  };
};