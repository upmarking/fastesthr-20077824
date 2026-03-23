import { describe, it, expect } from 'vitest';
import { replaceVariables } from './OfferLetterRenderer';

describe('replaceVariables', () => {
  it('should replace a single variable', () => {
    const html = '<p>Hello {{name}}</p>';
    const variables = { name: 'John Doe' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello John Doe</p>');
  });

  it('should replace multiple different variables', () => {
    const html = '<p>Hello {{name}}, your role is {{role}}.</p>';
    const variables = { name: 'Jane Doe', role: 'Developer' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello Jane Doe, your role is Developer.</p>');
  });

  it('should replace multiple occurrences of the same variable', () => {
    const html = '<p>{{name}}, please sign here: {{name}}</p>';
    const variables = { name: 'Alice' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Alice, please sign here: Alice</p>');
  });

  it('should be case-insensitive when replacing variables', () => {
    const html = '<p>Hello {{NAME}}, your role is {{Role}}.</p>';
    const variables = { name: 'Bob', role: 'Designer' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello Bob, your role is Designer.</p>');
  });

  it('should return the original string if there are no variables in the HTML', () => {
    const html = '<p>Hello world</p>';
    const variables = { name: 'Charlie' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello world</p>');
  });

  it('should return the original string if the variables object is empty', () => {
    const html = '<p>Hello {{name}}</p>';
    const variables = {};
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello {{name}}</p>');
  });

  it('should ignore variables present in HTML but not in the variables object', () => {
    const html = '<p>Hello {{name}}, your role is {{role}}.</p>';
    const variables = { name: 'David' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Hello David, your role is {{role}}.</p>');
  });

  it('should handle special characters in variable values', () => {
    const html = '<p>Cost: {{price}}</p>';
    const variables = { price: '$100.00' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Cost: $100.00</p>');
  });

  it('should handle empty string values for variables', () => {
    const html = '<p>Name: {{name}}</p>';
    const variables = { name: '' };
    const result = replaceVariables(html, variables);
    expect(result).toBe('<p>Name: </p>');
  });
});
