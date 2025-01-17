import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, DataContext, Field } from '../../../'
import { JSONSchema7 } from 'json-schema'

describe('DataContext.Provider', () => {
  it('should provide value from defaultData but ignore changes', () => {
    const { rerender } = render(
      <DataContext.Provider defaultData={{ foo: 'original' }}>
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(screen.getByDisplayValue('original')).toBeInTheDocument()

    rerender(
      <DataContext.Provider defaultData={{ foo: 'changed' }}>
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(screen.queryByDisplayValue('original')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('changed')).not.toBeInTheDocument()
  })

  it('should provide value from data and update based on changes', () => {
    const { rerender } = render(
      <DataContext.Provider data={{ foo: 'original' }}>
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(screen.getByDisplayValue('original')).toBeInTheDocument()

    rerender(
      <DataContext.Provider data={{ foo: 'changed' }}>
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(screen.queryByDisplayValue('changed')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('original')).not.toBeInTheDocument()
  })

  it('should handle path change', () => {
    const { rerender } = render(
      <DataContext.Provider data={{ foo: 'original' }}>
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(screen.getByDisplayValue('original')).toBeInTheDocument()

    rerender(
      <DataContext.Provider data={{ fooBar: 'changed' }}>
        <Field.String path="/fooBar" />
      </DataContext.Provider>
    )

    expect(screen.getByDisplayValue('changed')).toBeInTheDocument()
  })

  it('should call "onChange" on internal value change', () => {
    const onChange = jest.fn()

    const { rerender } = render(
      <DataContext.Provider data={{ foo: 'original' }} onChange={onChange}>
        <Field.String path="/foo" value="Value" />
      </DataContext.Provider>
    )

    const element = document.querySelector('input')

    fireEvent.change(element, {
      target: { value: 'New Value' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ foo: 'New Value' })

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed-value' }}
        onChange={onChange}
      >
        <Field.String path="/fooBar" value="Rerendered Value" />
      </DataContext.Provider>
    )

    fireEvent.change(element, {
      target: { value: 'Second Value' },
    })

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith({ fooBar: 'Second Value' })
  })

  it('should work without any data provided, using an empty object as default when pointing to an objec subkey', () => {
    const onChange = jest.fn()

    render(
      <DataContext.Provider onChange={onChange}>
        <Field.String path="/foo" value="Value" />
      </DataContext.Provider>
    )

    const element = document.querySelector('input')

    fireEvent.change(element, {
      target: { value: 'New Value' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ foo: 'New Value' })
  })

  it('should work without any data provided, using an empty array as default when pointing to an array index subkey', () => {
    const onChange = jest.fn()

    render(
      <DataContext.Provider onChange={onChange}>
        <Field.String path="/0/foo" value="Value" />
      </DataContext.Provider>
    )

    const element = document.querySelector('input')

    fireEvent.change(element, {
      target: { value: 'New Value' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith([{ foo: 'New Value' }])
  })

  it('should call "onPathChange" on path change', () => {
    const onPathChange = jest.fn()

    const { rerender } = render(
      <DataContext.Provider
        data={{ foo: 'original' }}
        onPathChange={onPathChange}
      >
        <Field.String path="/foo" value="Value" />
      </DataContext.Provider>
    )

    const element = document.querySelector('input')

    fireEvent.change(element, {
      target: { value: 'New Value' },
    })

    expect(onPathChange).toHaveBeenCalledTimes(1)
    expect(onPathChange).toHaveBeenCalledWith('/foo', 'New Value')

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed' }}
        onPathChange={onPathChange}
      >
        <Field.String path="/fooBar" value="Rerendered Value" />
      </DataContext.Provider>
    )

    fireEvent.change(element, {
      target: { value: 'Second Value' },
    })

    expect(onPathChange).toHaveBeenCalledTimes(2)
    expect(onPathChange).toHaveBeenCalledWith('/fooBar', 'Second Value')
  })

  it('should call "onSubmit" on submit', () => {
    const onSubmit = jest.fn()

    const { rerender } = render(
      <DataContext.Provider data={{ foo: 'original' }} onSubmit={onSubmit}>
        <Field.String path="/foo" value="Value" />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    const inputElement = document.querySelector('input')
    const submitElement = document.querySelector('button')

    fireEvent.change(inputElement, {
      target: { value: 'New Value' },
    })
    fireEvent.click(submitElement)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'New Value' })

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed' }}
        onSubmit={onSubmit}
      >
        <Field.String path="/fooBar" value="Rerendered Value" />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    fireEvent.change(inputElement, {
      target: { value: 'Second Value' },
    })
    fireEvent.click(submitElement)

    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenCalledWith({ fooBar: 'Second Value' })
  })

  it('should call "onSubmitRequest" on invalid submit', () => {
    const onSubmitRequest = jest.fn()

    const { rerender } = render(
      <DataContext.Provider
        data={{ foo: 'original' }}
        onSubmitRequest={onSubmitRequest}
      >
        <Field.Number path="/foo" minimum={3} />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    const inputElement = document.querySelector('input')
    const submitElement = document.querySelector('button')

    fireEvent.change(inputElement, {
      target: { value: '1' },
    })
    fireEvent.click(submitElement)

    expect(onSubmitRequest).toHaveBeenCalledTimes(1)
    expect(onSubmitRequest).toHaveBeenCalledWith()

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed' }}
        onSubmitRequest={onSubmitRequest}
      >
        <Field.Number path="/fooBar" minimum={3} />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    fireEvent.change(inputElement, {
      target: { value: '2' },
    })
    fireEvent.click(submitElement)

    expect(onSubmitRequest).toHaveBeenCalledTimes(2)
    expect(onSubmitRequest).toHaveBeenCalledWith()
  })

  it('should call "onSubmitRequest" on invalid submit set by a schema', () => {
    const onSubmitRequest = jest.fn()

    const TestdataSchema: JSONSchema7 = {
      type: 'object',
      properties: {
        foo: { type: 'number', minimum: 3 },
      },
    }

    const { rerender } = render(
      <DataContext.Provider
        data={{ foo: 'original' }}
        onSubmitRequest={onSubmitRequest}
        schema={TestdataSchema}
      >
        <Field.Number path="/foo" />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    const inputElement = document.querySelector('input')
    const submitElement = document.querySelector('button')

    fireEvent.change(inputElement, {
      target: { value: '1' },
    })
    fireEvent.click(submitElement)

    expect(onSubmitRequest).toHaveBeenCalledTimes(1)
    expect(onSubmitRequest).toHaveBeenCalledWith()

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed' }}
        onSubmitRequest={onSubmitRequest}
        schema={TestdataSchema}
      >
        <Field.Number path="/fooBar" required />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    fireEvent.change(inputElement, {
      target: { value: '2' },
    })
    fireEvent.click(submitElement)

    expect(onSubmitRequest).toHaveBeenCalledTimes(2)
    expect(onSubmitRequest).toHaveBeenCalledWith()
  })

  it('should scroll on top when "scrollTopOnSubmit" is true', () => {
    const onSubmit = jest.fn()
    const scrollTo = jest.fn()

    jest.spyOn(window, 'scrollTo').mockImplementation(scrollTo)

    const { rerender } = render(
      <DataContext.Provider
        data={{ foo: 'original' }}
        onSubmit={onSubmit}
        scrollTopOnSubmit
      >
        <Field.String path="/foo" value="Value" />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    const inputElement = document.querySelector('input')
    const submitElement = document.querySelector('button')

    fireEvent.change(inputElement, {
      target: { value: 'New Value' },
    })
    fireEvent.click(submitElement)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'New Value' })
    expect(scrollTo).toHaveBeenCalledTimes(1)

    rerender(
      <DataContext.Provider
        data={{ fooBar: 'changed' }}
        onSubmit={onSubmit}
        scrollTopOnSubmit
      >
        <Field.String path="/fooBar" value="Rerendered Value" />
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </DataContext.Provider>
    )

    fireEvent.change(inputElement, {
      target: { value: 'Second Value' },
    })
    fireEvent.click(submitElement)

    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenCalledWith({ fooBar: 'Second Value' })
    expect(scrollTo).toHaveBeenCalledTimes(2)
    expect(scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 0,
    })
  })

  it('should store data to session storage when sessionStorageId is provided, but only after changes', async () => {
    const setItem = jest.spyOn(
      Object.getPrototypeOf(window.sessionStorage),
      'setItem'
    )

    render(
      <DataContext.Provider
        defaultData={{ foo: 'original' }}
        sessionStorageId="test-data"
      >
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(setItem).not.toHaveBeenCalledWith(
      'test-data',
      JSON.stringify({
        foo: 'original123',
      })
    )

    const inputElement = document.querySelector('input')
    await userEvent.type(inputElement, '123')

    expect(setItem).toHaveBeenCalledWith(
      'test-data',
      JSON.stringify({
        foo: 'original1',
      })
    )
    expect(setItem).toHaveBeenCalledWith(
      'test-data',
      JSON.stringify({
        foo: 'original12',
      })
    )
    expect(setItem).toHaveBeenCalledWith(
      'test-data',
      JSON.stringify({
        foo: 'original123',
      })
    )

    setItem.mockRestore()
  })

  it('should set initial data to data from session storage when sessionStorageId is provided', () => {
    window.sessionStorage.setItem(
      'sourcedata',
      JSON.stringify({
        lorem: 'Ipsum',
      })
    )

    render(
      <DataContext.Provider sessionStorageId="sourcedata">
        <Field.String path="/lorem" />
      </DataContext.Provider>
    )

    expect(screen.getByDisplayValue('Ipsum')).toBeInTheDocument()
  })

  it('should throw error if both data and sessionStorageId is provided', () => {
    const errorSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementation()

    render(
      <DataContext.Provider
        data={{ foo: 'bar' }}
        sessionStorageId="sourcedata"
      >
        <Field.String path="/foo" />
      </DataContext.Provider>
    )

    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
