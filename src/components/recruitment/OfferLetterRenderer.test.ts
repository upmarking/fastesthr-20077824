import { describe, it, expect } from 'vitest';
import { replaceVariables } from './OfferLetterRenderer';

describe('replaceVariables', () => {
  it('should replace a single variable', () => {
    const html = '<p>Hello {{name}}</p>';
    const variables = { name: 'John' };
    expect(replaceVariables(html, variables)).toBe('<p>Hello John</p>');
  });

  it('should replace multiple variables', () => {
    const html = '<p>Hello {{name}}, your salary is {{salary}}</p>';
    const variables = { name: 'John', salary: '50000' };
    expect(replaceVariables(html, variables)).toBe('<p>Hello John, your salary is 50000</p>');
  });

  it('should replace multiple occurrences of the same variable', () => {
    const html = '<p>{{name}}, please sign here: {{name}}</p>';
    const variables = { name: 'John' };
    expect(replaceVariables(html, variables)).toBe('<p>John, please sign here: John</p>');
  });

  it('should be case insensitive', () => {
    const html = '<p>Hello {{Name}} and {{NAME}}</p>';
    const variables = { name: 'John' };
    expect(replaceVariables(html, variables)).toBe('<p>Hello John and John</p>');
  });

  it('should handle empty string input', () => {
    const html = '';
    const variables = { name: 'John' };
    expect(replaceVariables(html, variables)).toBe('');
  });

  it('should handle empty variables record', () => {
    const html = '<p>Hello {{name}}</p>';
    const variables = {};
    expect(replaceVariables(html, variables)).toBe('<p>Hello {{name}}</p>');
  });

  it('should ignore variables present in HTML but not in dictionary', () => {
    const html = '<p>Hello {{name}}, your role is {{role}}</p>';
    const variables = { name: 'John' };
    expect(replaceVariables(html, variables)).toBe('<p>Hello John, your role is {{role}}</p>');
  });

  it('should handle special characters in replacement values', () => {
    const html = '<p>Your bonus is {{bonus}}</p>';
    const variables = { bonus: '$1,000.50 & 10% shares!' };
    expect(replaceVariables(html, variables)).toBe('<p>Your bonus is $1,000.50 &amp; 10% shares!</p>');
  });
});
