import { isEqualNode } from 'next/dist/client/head-manager'

describe('isEqualNode', () => {
  it('should return true when comparing two identical elements', () => {
    const el = document.createElement('div')
    el.innerHTML = '<span>hello world</span>'

    const el2 = document.createElement('div')
    el2.innerHTML = '<span>hello world</span>'

    expect(isEqualNode(el, el2)).toBe(true)
  })

  it('should return false when comparing two elements with different attributes', () => {
    const el = document.createElement('div')
    el.innerHTML = '<span>hello world</span>'

    const el2 = document.createElement('div')
    el2.innerHTML = '<span>hello world</span>'
    el2.setAttribute('data-test', 'value')

    expect(isEqualNode(el, el2)).toBe(false)
  })

  it('should return false when comparing two elements with different children', () => {
    const el = document.createElement('div')
    el.innerHTML = '<span>hello world</span>'

    const el2 = document.createElement('div')
    el2.innerHTML = '<span>world</span>'

    expect(isEqualNode(el, el2)).toBe(false)
  })

  it('should return true when comparing two elements with the same nonce', () => {
    const el = document.createElement('script')
    el.nonce = '1234'

    const el2 = document.createElement('script')
    el2.setAttribute('nonce', '1234')

    expect(isEqualNode(el, el2)).toBe(true)
  })

  it('should return false when comparing two elements with different nonce', () => {
    const el = document.createElement('script')
    el.nonce = '1234'

    const el2 = document.createElement('script')
    el2.setAttribute('nonce', '12345')

    expect(isEqualNode(el, el2)).toBe(false)
  })

  it('should return true when comparing two elements with the same nonce attribute', () => {
    const el = document.createElement('script')
    el.setAttribute('nonce', '1234')

    const el2 = document.createElement('script')
    el2.setAttribute('nonce', '1234')

    expect(isEqualNode(el, el2)).toBe(true)
  })
})