import { describe, it, expect } from 'vitest';
import { resolvePronouns, resolveGroupLabel } from '../identity';

describe('resolvePronouns', () => {
  it('resolves she/her', () => {
    const p = resolvePronouns({ pronouns: 'she/her' });
    expect(p.subject).toBe('she');
    expect(p.object).toBe('her');
    expect(p.possessive).toBe('her');
    expect(p.reflexive).toBe('herself');
  });

  it('resolves they/them', () => {
    const p = resolvePronouns({ pronouns: 'they/them' });
    expect(p.subject).toBe('they');
    expect(p.isPlural).toBe(true);
  });

  it('defaults to they/them for null', () => {
    const p = resolvePronouns({ pronouns: null });
    expect(p.subject).toBe('they');
  });

  it('handles custom pronouns', () => {
    const p = resolvePronouns({ pronouns: 've/ver' });
    expect(p.subject).toBe('ve');
    expect(p.object).toBe('ver');
  });
});

describe('resolveGroupLabel', () => {
  it('returns "you two" for 2', () => expect(resolveGroupLabel(2)).toBe('you two'));
  it('returns "your trio" for 3', () => expect(resolveGroupLabel(3)).toBe('your trio'));
  it('returns "your quad" for 4', () => expect(resolveGroupLabel(4)).toBe('your quad'));
  it('returns "your group" for 5+', () => expect(resolveGroupLabel(5)).toBe('your group'));
});
