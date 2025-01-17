import ComponentBox from '../../../../../../shared/tags/ComponentBox'
import {
  FieldBlock,
  Field,
  TestElement,
} from '@dnb/eufemia/src/extensions/forms'
import { Flex, Slider } from '@dnb/eufemia/src'

export const Default = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock label="Label text">Input features goes here</FieldBlock>
    </ComponentBox>
  )
}

export const WithInfo = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock label="Label text" info="For your information">
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const Horizontal = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock label="Label text" layout="horizontal">
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const HorizontalWithInfo = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock
        label="Label text"
        layout="horizontal"
        info="For your information"
      >
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const Widths = () => {
  return (
    <ComponentBox
      scope={{ FieldBlock, TestElement }}
      data-visual-test="forms-field-block-widths"
    >
      <FieldBlock label="Default width (no width props)">
        <TestElement>Input feature</TestElement>
      </FieldBlock>
      <FieldBlock
        label="Small (affects outer block element)"
        width="small"
      >
        <TestElement>Input</TestElement>
      </FieldBlock>
      <FieldBlock
        label="Medium (affects outer block element)"
        width="medium"
      >
        <TestElement>Input feature</TestElement>
      </FieldBlock>
      <FieldBlock
        label="Large (affects outer block element)"
        width="large"
      >
        <TestElement>Input feature</TestElement>
      </FieldBlock>

      <FieldBlock
        label="Small (affects contents only)"
        contentsWidth="small"
      >
        <TestElement>Input</TestElement>
      </FieldBlock>
      <FieldBlock
        label="Medium (affects contents only)"
        contentsWidth="medium"
      >
        <TestElement>Input feature</TestElement>
      </FieldBlock>
      <FieldBlock
        label="Large (affects contents only)"
        contentsWidth="large"
      >
        <TestElement>Input feature</TestElement>
      </FieldBlock>
    </ComponentBox>
  )
}

export const WithDescription = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock label="Label text" labelDescription="Description text">
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const WithSecondary = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock label="Label text" labelSecondary="Secondary text">
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const WithDescriptionAndSecondary = () => {
  return (
    <ComponentBox scope={{ FieldBlock }}>
      <FieldBlock
        label="Label text"
        labelDescription="Description text"
        labelSecondary="42"
      >
        Input features goes here
      </FieldBlock>
    </ComponentBox>
  )
}

export const GroupMultipleFields = () => {
  return (
    <ComponentBox scope={{ FieldBlock, Field }}>
      <FieldBlock label="Label text" info="For your information">
        <Flex.Horizontal>
          <Field.String width="small" minLength={3} />
          <Field.Number minimum={10} />
        </Flex.Horizontal>
      </FieldBlock>
    </ComponentBox>
  )
}

export const HorizontalAutoSize = () => {
  return (
    <ComponentBox
      scope={{
        Field,
        FieldBlock,
      }}
    >
      <FieldBlock label="Label">
        <Flex.Container>
          <Flex.Item size={{ small: 12, large: 'auto' }}>
            <Field.String
              path="/firstName"
              label="First name"
              width="medium"
              minLength={2}
            />
          </Flex.Item>
          <Flex.Item size={{ small: 12, large: 'auto' }}>
            <Field.String
              path="/lastName"
              label="Last name"
              width="medium"
              required
            />
          </Flex.Item>
          <Flex.Item size={{ small: 12, large: 'auto' }}>
            <FieldBlock width="large">
              <Slider
                min={1900}
                max={new Date().getFullYear()}
                step={1}
                value={2010}
                label="Birth year"
                label_direction="vertical"
                tooltip
                alwaysShowTooltip
              />
            </FieldBlock>
          </Flex.Item>
        </Flex.Container>
      </FieldBlock>
    </ComponentBox>
  )
}
