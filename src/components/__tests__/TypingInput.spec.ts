import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'
import TypingInput from '../TypingInput.vue'

describe('TypingInput', () => {
  it('renders properly', () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const containerEl = wrapper.get('.typing-input-container')
    expect(containerEl.attributes().style).toContain('font-size: 36px')
    const articleEl = wrapper.get('.typing-input-article')
    const tokens = articleEl.findAll('span')
    expect(tokens.length).toBe(12)
    expect(tokens[0].text()).toBe('H')
    expect(wrapper.find('.typing-input')).not.toBeNull()
  })
  it('handle correct input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'H'
    input.trigger('input', { type: 'input', data: 'H', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span').classes()).toContain('success')
  })
  it('handle error input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'O'
    input.trigger('input', { type: 'input', data: 'O', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect((input.element as HTMLTextAreaElement).value).toBe('O')
    expect(wrapper.get('.typing-input-article>span').classes()).toContain('error')
  })
  it('handle enter input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = '\n'
    input.trigger('input', { type: 'input', data: null, inputType: 'insertLineBreak' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span:first-of-type').classes()).toContain('error')
    expect((input.element as HTMLTextAreaElement).value).toBe('\n')
  })
  it('handle composition placeholder input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = ' '
    input.trigger('input', { type: 'input', data: ' ', inputType: 'insertCompositionText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span:first-of-type').classes()).toContain('initial')
    expect((input.element as HTMLTextAreaElement).value).toBe(' ')
  })
  it('handle composition text input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = ' '
    input.trigger('input', { type: 'input', data: ' ', inputType: 'insertCompositionText' })
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = '世界'
    input.trigger('input', { type: 'input', data: '世界', inputType: 'insertCompositionText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span:first-child').classes()).toContain('error')
    expect(wrapper.get('.typing-input-article>span:nth-child(2)').classes()).toContain('error')
    expect((input.element as HTMLTextAreaElement).value).toBe('世界')
  })
  it('handle backward delete properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'Hel'
    input.trigger('input', { type: 'input', data: 'Hel', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect((input.element as HTMLTextAreaElement).value).toBe('Hel')
    expect(wrapper.findAll('.typing-input-article>span')[2].classes()).toContain('success')
    ;(input.element as HTMLTextAreaElement).value = 'He'
    input.trigger('input', { type: 'input', data: null, inputType: 'deleteContentBackward' })
    await nextTick()
    expect((input.element as HTMLTextAreaElement).value).toBe('He')
    expect(wrapper.find('.typing-input-article>span:nth-child(2)').classes()).toContain('success')
    expect(wrapper.find('.typing-input-article>span:nth-child(3)').classes()).toContain('initial')
  })
  it('disable backward delete should work properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello Vitest', fontSize: 36, lineHeight: 1.5, allowBackward: false }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'Hel'
    input.trigger('input', { type: 'input', data: 'Hel', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect((input.element as HTMLTextAreaElement).value).toBe('Hel')
    expect(wrapper.findAll('.typing-input-article>span')[2].classes()).toContain('success')
    ;(input.element as HTMLTextAreaElement).value = 'He'
    input.trigger('input', { type: 'input', data: null, inputType: 'deleteContentBackward' })
    await nextTick()
    expect((input.element as HTMLTextAreaElement).value).toBe('Hel')
    expect(wrapper.find('.typing-input-article>span:nth-child(2)').classes()).toContain('success')
    expect(wrapper.find('.typing-input-article>span:nth-child(3)').classes()).toContain('success')
  })
  it('handle exceeded across edge input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'Hello '
    input.trigger('input', { type: 'input', data: 'Hello ', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span:first-child').classes()).toContain('success')
    expect((input.element as HTMLTextAreaElement).value).toBe('Hello')
  })
  it('handle exceeded from edge input properly', async () => {
    const wrapper = mount(TypingInput, {
      props: { article: 'Hello', fontSize: 36, lineHeight: 1.5 }
    })
    const input = wrapper.get('.typing-input')
    const handleInput = vi.spyOn(wrapper.vm as any, 'handleInput')
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'Hello'
    input.trigger('input', { type: 'input', data: 'Hello', inputType: 'insertText' })
    await nextTick()
    ;(input.element as HTMLTextAreaElement).value = 'Hello'
    input.trigger('input', { type: 'input', data: 'Hello', inputType: 'insertText' })
    await nextTick()
    expect(handleInput).toHaveBeenCalled()
    expect(wrapper.get('.typing-input-article>span:first-child').classes()).toContain('success')
    expect((input.element as HTMLTextAreaElement).value).toBe('Hello')
  })
})
