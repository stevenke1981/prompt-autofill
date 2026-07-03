import { describe, it, expect } from 'vitest';
import { mergeTemplatesWithSystem, mergeBanksWithSystem } from '../utils/merge';

describe('merge', () => {
  it('MG-01: mergeTemplates preserves selections', () => {
    const current = [
      {
        id: 'tpl_default',
        name: 'Changed',
        content: 'Changed content {{x}}',
        selections: { 'x-0': 'custom' },
      },
    ];

    const { templates } = mergeTemplatesWithSystem(current, { backupSuffix: ' (backup)' });
    const merged = templates.find((t) => t.id === 'tpl_default');
    expect(merged?.selections?.['x-0']).toBe('custom');
  });

  it('MG-02: mergeTemplates backs up user-modified system template', () => {
    const current = [
      {
        id: 'tpl_default',
        name: 'User Edit',
        content: 'User content',
        selections: {},
      },
    ];

    const { templates, notes } = mergeTemplatesWithSystem(current, { backupSuffix: ' (backup)' });
    const hasBackup = templates.some((t) => {
      if (t.id === 'tpl_default') return false;
      const nameStr = typeof t.name === 'string' ? t.name : JSON.stringify(t.name);
      return nameStr.includes('User Edit');
    });
    expect(hasBackup).toBe(true);
    expect(notes.length).toBeGreaterThan(0);
  });

  it('MG-03: mergeTemplates keeps custom templates', () => {
    const current = [
      {
        id: 'tpl_custom_abc',
        name: 'My Template',
        content: 'Custom',
        selections: {},
      },
    ];

    const { templates } = mergeTemplatesWithSystem(current, { backupSuffix: '' });
    expect(templates.some((t) => t.id === 'tpl_custom_abc')).toBe(true);
  });

  it('MG-04: mergeBanks keeps custom options', () => {
    const customOption = { 'zh-tw': '自訂選項', en: 'Custom Option' };
    const currentBanks = {
      role: {
        label: { 'zh-tw': '角色', en: 'Role' },
        category: 'character',
        options: [...[], customOption],
      },
    };

    const { banks, notes } = mergeBanksWithSystem(currentBanks, {}, { backupSuffix: '' });
    const hasCustom = banks.role.options.some(
      (opt) => typeof opt === 'object' && opt['zh-tw'] === '自訂選項'
    );
    expect(hasCustom).toBe(true);
    expect(notes.some((n) => n.includes('自訂義選項'))).toBe(true);
  });

  it('MG-05: mergeBanks keeps new custom bank', () => {
    const currentBanks = {
      my_custom_bank: {
        label: 'Custom',
        category: 'other',
        options: ['one'],
      },
    };

    const { banks } = mergeBanksWithSystem(currentBanks, {}, { backupSuffix: '' });
    expect(banks.my_custom_bank).toBeDefined();
  });
});