import { describe, it, expect } from 'vitest';
import { withDeliverables, DELIVERABLES_SECTION } from '../constants/deliverables';

describe('deliverables', () => {
  it('appends section to bilingual content', () => {
    const result = withDeliverables({ 'zh-tw': '### Task\n內容', en: '### Task\nContent' });
    expect(result['zh-tw']).toContain('交付物要求');
    expect(result['zh-tw']).toContain('{{deliverable_primary}}');
    expect(result.en).toContain('Deliverables');
    expect(result.en).toContain('{{output_format}}');
  });

  it('does not duplicate if section already exists', () => {
    const existing = { 'zh-tw': `### Task\n\n${DELIVERABLES_SECTION['zh-tw']}`, en: '### Task' };
    const result = withDeliverables(existing);
    expect((result['zh-tw'].match(/交付物要求/g) || []).length).toBe(1);
  });

  it('appends to string content', () => {
    const result = withDeliverables('Hello prompt');
    expect(result).toContain('交付物要求');
  });
});