import React, { useContext } from 'react'
import StringComponent, { Props as StringComponentProps } from './String'
import SharedContext from '../../../shared/Context'

export type Props = StringComponentProps

function FirstName(props: Props) {
  const sharedContext = useContext(SharedContext)

  const stringValueProps: Props = {
    ...props,
    label: props.label ?? sharedContext?.translation.Forms.firstNameLabel,
  }
  return <StringComponent {...stringValueProps} />
}

FirstName._supportsEufemiaSpacingProps = true
export default FirstName