import * as React from 'react';
export type GlobalStatusTitle = React.ReactNode | boolean;
export type GlobalStatusText =
  | string
  | ((...args: any[]) => any)
  | React.ReactNode;
export type GlobalStatusItems = string | ((...args: any[]) => any) | any[];
export type GlobalStatusIcon =
  | string
  | ((...args: any[]) => any)
  | React.ReactNode;
export type GlobalStatusState = 'error' | 'info';
export type GlobalStatusShow = 'auto' | any | any | 'true' | 'false';
export type GlobalStatusAutoscroll = string | boolean;
export type GlobalStatusAutoclose = string | boolean;
export type GlobalStatusNoAnimation = string | boolean;
export type GlobalStatusDelay = string | number;
export type GlobalStatusHideCloseButton = string | boolean;
export type GlobalStatusOmitSetFocus = string | boolean;
export type GlobalStatusOmitSetFocusOnUpdate = string | boolean;
export type GlobalStatusSkeleton = string | boolean;
export type GlobalStatusSpace =
  | string
  | number
  | boolean
  | {
      /**
       * Use spacing values like: `small`, `1rem`, `1` or , `16px`. Will use `margin-top`.
       */
      top?: string | number | boolean;

      /**
       * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-right`.
       */
      right?: string | number | boolean;

      /**
       * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-bottom`.
       */
      bottom?: string | number | boolean;

      /**
       * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-left`.
       */
      left?: string | number | boolean;
    };
export type GlobalStatusTop = string | number | boolean;
export type GlobalStatusRight = string | number | boolean;
export type GlobalStatusBottom = string | number | boolean;
export type GlobalStatusLeft = string | number | boolean;
export type GlobalStatusChildren =
  | string
  | ((...args: any[]) => any)
  | React.ReactNode;
/**
 * NB: Do not change the docs (comments) in here. The docs are updated during build time by "generateTypes.js" and "fetchPropertiesFromDocs.js".
 */

export interface GlobalStatusProps extends React.HTMLProps<HTMLElement> {
  /**
   * The main ID. Defaults to the prop
   */
  id?: string;
  status_id?: string;

  /**
   * The title appears as a part of the status content. Use `false` to hide / remove the title and icon. Defaults to `En feil har skjedd`.
   */
  title?: GlobalStatusTitle;
  default_title?: string;

  /**
   * The text appears as the status content. Besides plain text, you can send in a React component as well. Defaults to `null`.
   */
  text?: GlobalStatusText;

  /**
   * The items (list items) appear as a part of the status content. you can both use an JSON array, or a vanilla array with a string or an object content. Se "Item Object" example below.
   */
  items?: GlobalStatusItems;

  /**
   * The icon shown before the status title. Defaults to `exclamation`.
   */
  icon?: GlobalStatusIcon;

  /**
   * The icon size of the title icon shows. Defaults to `medium`.
   */
  icon_size?: string;

  /**
   * Defines the visual appearance of the status. There are two main statuses `error` and `info`. The default status is `error`.
   */
  state?: GlobalStatusState;

  /**
   * Set to `true` or `false` to manually make the global status visible. Defaults to `true`.
   */
  show?: GlobalStatusShow;

  /**
   * Set to `true` to automatically scroll the page to the appeared global status. Defaults to `true`.
   */
  autoscroll?: GlobalStatusAutoscroll;

  /**
   * Set to `true` to automatically close the global status if there are no more left items in the provider stack. Defaults to `true`.
   */
  autoclose?: GlobalStatusAutoclose;

  /**
   * Set to `true` to disable the show/hide/slide/fade/grow/shrink animation. Defaults to `false`.
   */
  no_animation?: GlobalStatusNoAnimation;

  /**
   * Defines the delay on how long the automated visibility should wait before it appears to the user. Defaults to `200ms`.
   */
  delay?: GlobalStatusDelay;

  /**
   * Text of the close button. Defaults to `Lukk`.
   */
  close_text?: React.ReactNode;

  /**
   * Set to `true` if the close button should be hidden for the user. Defaults to `false`.
   */
  hide_close_button?: GlobalStatusHideCloseButton;

  /**
   * Set to `true` to omit setting the focus during visibility. Defaults to `false`. Additionally, there is `omit_set_focus_on_update` which is set to `true` by default.
   */
  omit_set_focus?: GlobalStatusOmitSetFocus;
  omit_set_focus_on_update?: GlobalStatusOmitSetFocusOnUpdate;

  /**
   * Defines the anchor text showing up after every item, in case there is a `status_id` defined. Defaults to `Gå til %s`. The `%s` represents the optional and internal handled label addition.
   */
  status_anchor_text?: React.ReactNode;
  skeleton?: GlobalStatusSkeleton;

  /**
   * Has to be an object with either: `top`, `right`, `bottom` or `left`. Use spacing values like: `small`, `1rem`, `1` or , `16px`.
   */
  space?: GlobalStatusSpace;

  /**
   * Use spacing values like: `small`, `1rem`, `1` or , `16px`. Will use `margin-top`.
   */
  top?: GlobalStatusTop;

  /**
   * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-right`.
   */
  right?: GlobalStatusRight;

  /**
   * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-bottom`.
   */
  bottom?: GlobalStatusBottom;

  /**
   * Use spacing values like: `small`, `1rem`, `1` or , `16px`. will use `margin-left`.
   */
  left?: GlobalStatusLeft;
  class?: string;
  className?: string;

  /**
   * The text appears as the status content. Besides plain text, you can send in a React component as well. Defaults to `null`.
   */
  children?: GlobalStatusChildren;

  /**
   * Gets triggered once the GlobalStatus is getting new content by the user. Returns `{ id, status_id, ...properties }`.
   */
  on_adjust?: (...args: any[]) => any;

  /**
   * Gets triggered the first time the GlobalStatus appears on the screen. In other words, it has to have been hidden before. Returns `{ id, status_id, ...properties }`.
   */
  on_open?: (...args: any[]) => any;

  /**
   * Gets triggered for the first time and for every new content update the GlobalStatus gets. Returns `{ id, status_id, ...properties }`.
   */
  on_show?: (...args: any[]) => any;

  /**
   * Gets triggered once the GlobalStatus disappears from the screen. Works only if `no_animation` is not `true`. Returns `{ id, status_id, ...properties }`.
   */
  on_close?: (...args: any[]) => any;

  /**
   * Gets triggered once the GlobalStatus is getting closed/hidden by the user. Returns `{ id, status_id, ...properties }`.
   */
  on_hide?: (...args: any[]) => any;
}
export default class GlobalStatus extends React.Component<
  GlobalStatusProps,
  any
> {
  static defaultProps: object;
  render(): JSX.Element;
}