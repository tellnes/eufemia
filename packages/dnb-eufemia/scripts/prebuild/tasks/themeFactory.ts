/**
 * Insert all the component themes into the main themes lib files
 *
 */

import fs from 'fs-extra'
import globby from 'globby'
import packpath from 'packpath'
import path, { basename } from 'path'
import prettier from 'prettier'
import { ErrorHandler, log } from '../../lib'
import { asyncForEach } from '../../tools'

type ThemePackageFiles = Array<string>
type ThemeSources = Record<string, Array<{ source: string }>>
type RelatedFiles = Array<{ name: string; files: Array<string> }>
type FileContent = string
type FallbackFilesParams = {
  fileContent: FileContent
  files: Array<string>
  themesWithRelatedFiles: RelatedFiles
  currentThemeName: string
}

const prettierrc = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../.prettierrc'), 'utf-8')
)

const runThemeFactory = async () => {
  log.start('> PrePublish: Starting the themes factory ...')

  const processToNamesIgnoreList = [
    '!**/__tests__/',
    '!**/stories/',
    '!**/style/',
    '!**/helper-classes/',
    '!**/*_not_in_use*',
  ]

  // make themes
  await runFactory({
    // input
    filesToFindGlob: [
      path.resolve(
        __dirname,
        '../../../src/{components,fragments}/**/style/themes/**/*-theme-*.scss'
      ),
      ...processToNamesIgnoreList,
    ],
    // output
    targetFile: 'components', // ui-theme-components.scss
    scssOutputPath: path.resolve(__dirname, '../../../src/style/themes'),
  }).then(() => {
    if (require.main === module) {
      log.succeed(
        '> PrePublish: "themeFactory" Created the themes files with all the components, elements, fragments and extensions'
      )
    }
  })

  await runFactory({
    // input
    filesToFindGlob: [
      path.resolve(
        __dirname,
        '../../../src/elements/**/style/themes/**/*-theme-*.scss'
      ),
      ...processToNamesIgnoreList,
    ],
    // output
    targetFile: 'elements', // ui-theme-elements.scss
    scssOutputPath: path.resolve(__dirname, '../../../src/style/themes'),
  }).then(() => {
    if (require.main === module) {
      log.succeed(
        '> PrePublish: "themeFactory" Created the themes files with all the components, elements, fragments and extensions'
      )
    }
  })

  await runFactory({
    // input
    filesToFindGlob: [
      path.resolve(
        __dirname,
        '../../../src/extensions/**/style/themes/**/*-theme-*.scss'
      ),
      ...processToNamesIgnoreList,
    ],
    // output
    targetFile: 'extensions', // ui-theme-extensions.scss
    scssOutputPath: path.resolve(__dirname, '../../../src/style/themes'),
  }).then(() => {
    if (require.main === module) {
      log.succeed(
        '> PrePublish: "themeFactory" Created the themes files with all the components, elements, fragments and extensions'
      )
    }
  })
}

export const editAdvice = `
/**
 * ATTENTION: This file is auto generated by using "themeFactory".
 * But you still can change the content of this file on the very top.
 */

// Add "ui" themes, if file don't exists
$THEME_FALLBACK: 'ui';

// Import shared styles
@import '../../dnb-ui-<file>.scss';
`

const insertBelowTitle =
  'NB: The content below is auto generated by the "themeFactory".'

export const insertBelowAdvice = `
/**
 * ${insertBelowTitle}
 * You may want to update it by running "yarn build" locally.
 */
`

export const runFactory = async ({
  filesToFindGlob, // input
  scssOutputPath = '', // output
  customContent = '',
  targetFile = 'basis', // ui-theme-basis.scss
  returnResult = false,
}) => {
  const themeSources = await getThemeSources(filesToFindGlob)
  const themesWithRelatedFiles =
    await collecetRelatedThemeFiles(themeSources)

  const collectedOutput = {}

  try {
    const write = async (file: string, fileContent: string) => {
      if (!fs.existsSync(path.dirname(file))) {
        await fs.mkdir(path.dirname(file))
      }
      await fs.writeFile(
        file,
        await prettier.format(fileContent, {
          ...prettierrc,
          filepath: file,
        })
      )
    }

    await asyncForEach(themesWithRelatedFiles, async ({ name, files }) => {
      const file = `${scssOutputPath}/theme-${name}/${name}-theme-${targetFile}.scss`

      let fileContent = ''

      if (!fs.existsSync(file)) {
        fileContent = `${editAdvice.replace(
          '<file>',
          targetFile
        )}\n\n${customContent}\n\n${insertBelowAdvice}\n\n${files.join(
          ''
        )}`

        await write(file, fileContent)
      }

      fileContent = await fs.readFile(file, 'utf-8')

      const updatedFiles = getFallbackFiles({
        files,
        fileContent,
        themesWithRelatedFiles,
        currentThemeName: name,
      })

      fileContent = fileContent.replace(
        new RegExp(`(\\/\\*\\*[^]*${insertBelowTitle}[^]*\\*\\/)([^]*)`),
        `$1\n\n${updatedFiles.join('')}\n`
      )

      if (returnResult) {
        if (!collectedOutput[file]) {
          collectedOutput[file] = []
        }
        collectedOutput[file].push(fileContent)
      } else {
        await write(file, fileContent)
      }
    })
  } catch (e) {
    log.fail(`There was an error when creating ${scssOutputPath}!`)
    ErrorHandler(e)
  }

  if (returnResult) {
    return collectedOutput
  }
}

/**
 * If a fallback is defined: $THEME_FALLBACK: 'ui';
 * use "themesWithRelatedFiles" and put it inside the current theme.
 * But omit files that have the same name already.
 */
function getFallbackFiles({
  fileContent,
  files,
  themesWithRelatedFiles,
  currentThemeName,
}: FallbackFilesParams) {
  const fallbackThemeName = getFallbackThemeName({ fileContent })

  if (fallbackThemeName) {
    const fallbackIndex = themesWithRelatedFiles.findIndex(
      ({ name }) => fallbackThemeName === name
    )
    if (fallbackIndex >= 0) {
      files = [
        ...files,
        ...themesWithRelatedFiles[fallbackIndex].files.filter((file) => {
          return !files.includes(
            file.replace(`-${fallbackThemeName}`, `-${currentThemeName}`)
          )
        }),
      ]
    }
  }

  return files
}

async function getExistingThemePackageFiles() {
  const themes: ThemePackageFiles = []

  const list = await globby('**/src/style/themes/**/*.scss')

  list.forEach((file) => {
    const themeName = file.match(/\/themes\/theme-(.*)\//)?.[1] || null
    if (themeName !== null && !themes.includes(themeName)) {
      themes.push(themeName)
    }
  })

  return themes
}

function getFallbackThemeName({ fileContent }: { fileContent: string }) {
  let fallbackThemeName = null

  const regexp = /\$THEME_FALLBACK: '([^']*)';/
  const fallback =
    fileContent.match(regexp)?.[0]?.replace(regexp, '$1') || null
  if (fallback) {
    fallbackThemeName = fallback
  }

  return fallbackThemeName
}

async function getThemeSources(filesToFindGlob: Array<string>) {
  filesToFindGlob = await globby(filesToFindGlob)
  filesToFindGlob.sort()

  const groups: ThemeSources = {}
  filesToFindGlob
    .map((source) => {
      return Object.freeze({
        source,
        name: basename(source),
      })
    })
    .forEach((object) => {
      const themeName = /(.*)-theme-(.*)\.scss/g.exec(object.name)[2]
      groups[themeName] = groups[themeName] || []
      groups[themeName].push(object)
    })

  return groups
}

async function collecetRelatedThemeFiles(themeSources: ThemeSources) {
  // make a group of all gathered themes we later will iterate through
  const relatedFiles: RelatedFiles = []
  Object.entries(themeSources).forEach(([name, list]) => {
    const files = list.reduce((acc, { source }) => {
      const path = packpath.self()
      acc.push(
        `\n@import '${source.replace(
          new RegExp(`${path}/src/`, 'g'),
          '../../../'
        )}';`
      )
      return acc
    }, [])

    relatedFiles.push({
      name,
      files,
    })
  })

  const packageFiles = await getExistingThemePackageFiles()
  packageFiles.forEach((themeName) => {
    const index = relatedFiles.findIndex(({ name }) => {
      return name === themeName
    })
    if (index === -1) {
      relatedFiles.push({ name: themeName, files: [] })
    }
  })

  return relatedFiles
}

if (require.main === module && process.env.NODE_ENV !== 'test') {
  log.start()
  runThemeFactory().then(() => {
    log.succeed()
  })
}

export { runThemeFactory }
