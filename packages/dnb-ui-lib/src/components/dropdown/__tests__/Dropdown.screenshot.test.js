/**
 * Screenshot Test
 * This file will not run on "test:staged" because we dont require any related files
 */

import {
  testPageScreenshot,
  setupPageScreenshot
} from '../../../core/jest/jestSetupScreenshots'

describe('Dropdown screenshot', () => {
  setupPageScreenshot({ url: '/uilib/components/dropdown' })
  it('have to match the closed dropdown', async () => {
    const screenshot = await testPageScreenshot({
      selector: '[data-dnb-test="dropdown-closed"] .dnb-dropdown'
    })
    expect(screenshot).toMatchImageSnapshot()
  })
  it('have to match the closed dropdown with hover', async () => {
    const screenshot = await testPageScreenshot({
      selector: '[data-dnb-test="dropdown-closed"] .dnb-dropdown',
      simulateSelector: '[data-dnb-test="dropdown-closed"] .dnb-dropdown',
      simulate: 'hover'
    })
    expect(screenshot).toMatchImageSnapshot()
  })
  it('have to match the dropdown with click', async () => {
    const screenshot = await testPageScreenshot({
      selector: '[data-dnb-test="dropdown-closed"] .dnb-dropdown',
      simulate: 'click',
      waitFor: 10 // to make sure we make the screenshot afte the animation is show
    })
    expect(screenshot).toMatchImageSnapshot()
  })
  it('have to match the dropdown items', async () => {
    const screenshot = await testPageScreenshot({
      selector: '[data-dnb-test="dropdown-list"] .dnb-dropdown__options',
      simulateSelector:
        '[data-dnb-test="dropdown-list"] .dnb-dropdown__options li:nth-of-type(1)',
      simulate: 'hover'
    })
    expect(screenshot).toMatchImageSnapshot()
  })
})