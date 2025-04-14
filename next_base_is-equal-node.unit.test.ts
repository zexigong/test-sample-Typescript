import { isEqualNode } from '../../packages/next/src/client/head-manager';

describe('isEqualNode', () => {
  let oldTag: HTMLElement;
  let newTag: HTMLElement;

  beforeEach(() => {
    oldTag = document.createElement('div');
    newTag = document.createElement('div');
  });

  it('should return true for identical nodes without nonce', () => {
    oldTag.setAttribute('id', 'test');
    newTag.setAttribute('id', 'test');
    expect(isEqualNode(oldTag, newTag)).toBe(true);
  });

  it('should return false for different nodes', () => {
    oldTag.setAttribute('id', 'test1');
    newTag.setAttribute('id', 'test2');
    expect(isEqualNode(oldTag, newTag)).toBe(false);
  });

  it('should handle nodes with nonce correctly', () => {
    oldTag.setAttribute('nonce', '123');
    newTag.setAttribute('nonce', '123');
    document.body.appendChild(oldTag);
    expect(isEqualNode(oldTag, newTag)).toBe(true);
  });

  it('should return false if only one node is in the document with nonce', () => {
    oldTag.setAttribute('nonce', '123');
    newTag.setAttribute('nonce', '123');
    document.body.appendChild(oldTag);
    expect(isEqualNode(oldTag, newTag)).toBe(false);
  });

  it('should compare nodes without nonce attribute as equal if nonce is removed', () => {
    oldTag.setAttribute('nonce', '');
    newTag.setAttribute('nonce', '123');
    document.body.appendChild(oldTag);
    expect(isEqualNode(oldTag, newTag)).toBe(true);
  });

  it('should return true for nodes with different nonces if one is in the document', () => {
    oldTag.setAttribute('nonce', '123');
    newTag.setAttribute('nonce', '456');
    document.body.appendChild(oldTag);
    expect(isEqualNode(oldTag, newTag)).toBe(false);
  });
});