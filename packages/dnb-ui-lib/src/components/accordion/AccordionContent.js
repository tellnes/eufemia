/**
 * Web Accordion Component
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  isTrue,
  validateDOMAttributes,
  processChildren,
  getPreviousSibling,
  AnimateHeight
} from '../../shared/component-helper'
import classnames from 'classnames'
import AccordionContext from './AccordionContext'
import { createSpacingClasses } from '../space/SpacingHelper'

export default class AccordionContent extends React.PureComponent {
  static contextType = AccordionContext

  static propTypes = {
    instance: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  }

  static defaultProps = {
    instance: null,
    className: null,
    children: null
  }

  static getContent(props) {
    return processChildren(props)
  }

  constructor(props, context) {
    super(props)
    this._ref = React.createRef()

    this.state = {
      isInitial: !context.expanded,
      isAnimating: false,
      keepContentInDom: null
    }

    this.anim = new AnimateHeight()

    this.anim.onStart(() => {
      this.setState({
        isAnimating: true
      })
    })

    this.anim.onEnd(() => {
      this.setState({
        isAnimating: false
      })

      if (this.context.expanded) {
        this.setState({
          keepContentInDom: true
        })
      } else {
        this.setState({
          keepContentInDom: false
        })
      }
    })

    if (
      props.instance &&
      Object.prototype.hasOwnProperty.call(props.instance, 'current')
    ) {
      props.instance.current = this
    }
  }

  componentDidMount() {
    this.anim.setElem(
      this._ref.current,
      getPreviousSibling(
        'dnb-accordion-group--single-container',
        this._ref.current
      )
    )
  }

  componentWillUnmount() {
    this.anim.remove()
  }

  componentDidUpdate(prevProps) {
    const { expanded, prevent_rerender } = this.context
    if (expanded !== this.state._expanded) {
      const isInitial = !expanded && this.state.isInitial
      this.setState(
        {
          _expanded: expanded,
          isInitial: false,
          keepContentInDom: expanded || !isTrue(prevent_rerender)
        },
        () => {
          if (expanded) {
            this.anim.open({ animate: !isInitial })
          } else {
            this.anim.close({ animate: !isInitial })
          }
        }
      )
    }

    if (
      AccordionContent.getContent(prevProps) !==
      AccordionContent.getContent(this.props)
    ) {
      this.anim.setContainerHeight()
    }
  }

  setContainerHeight() {
    this.anim?.setContainerHeight()
  }

  renderContent() {
    const children = AccordionContent.getContent(this.props)
    const {
      expanded,
      prerender,
      prevent_rerender,
      prevent_rerender_conditional
    } = this.context

    let content = children

    if (typeof content === 'string') {
      content = <p className="dnb-p">{content}</p>
    }

    content =
      expanded ||
      prerender ||
      this.state.keepContentInDom ||
      this.state.isAnimating
        ? children
        : null

    if (isTrue(prevent_rerender)) {
      // update the cache if children is not the same anymore
      if (
        isTrue(prevent_rerender_conditional) &&
        this._cache !== content
      ) {
        this._cache = content
      }

      if (this._cache) {
        content = this._cache
      } else {
        this._cache = content
      }
    }

    return content
  }

  render() {
    const {
      className,
      instance, // eslint-disable-line
      ...rest
    } = this.props
    const { keepContentInDom, isAnimating } = this.state

    const { id, expanded, disabled } = this.context

    const content = this.renderContent()

    const wrapperParams = {
      className: classnames(
        'dnb-accordion__content',
        !expanded && 'dnb-accordion__content--hidden',
        isAnimating && 'dnb-accordion__content--is-animating',
        className
      ),
      ...rest
    }

    const innerParams = {
      id: `${id}-content`,
      role: 'region',
      'aria-labelledby': `${id}-header`,
      className: classnames(
        'dnb-accordion__content__inner',
        keepContentInDom === false &&
          'dnb-accordion__content__inner--remove-content',
        createSpacingClasses(rest)
      )
    }

    if (expanded) {
      innerParams['aria-expanded'] = true
    }

    if (!expanded || disabled) {
      innerParams.disabled = true
      innerParams['aria-hidden'] = true
    }

    // to remove spacing props
    validateDOMAttributes(this.props, wrapperParams)
    validateDOMAttributes(null, innerParams)

    return (
      <div {...wrapperParams} ref={this._ref}>
        <div {...innerParams}>{content}</div>
      </div>
    )
  }
}