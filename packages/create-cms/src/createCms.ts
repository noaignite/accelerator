/* eslint-disable no-console -- Allow as it is a CLI tool */

import { sync as spawnSync } from 'cross-spawn'
import { bold, lightBlue, magenta, red } from 'kolorist'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  h?: boolean
  help?: boolean
}>(process.argv.slice(2), {
  default: { help: false },
  alias: { h: 'help', t: 'template' },
  string: ['_'],
})
const cwd = process.cwd()

const helpMessage = `
Usage: create-cms

Scaffold NoA Ignite templates within a turborepo project.
`

type ColorFunc = (str: string | number) => string

// `node:fs` commands as are stricly typed arrays
type NodeFsCommand = ['writeFileSync', ...Parameters<typeof fs.writeFileSync>]
// `spawnSync` commands are loosely typed strings
type SpawnSyncCommand = `${string} ${string}`
type Command = NodeFsCommand | SpawnSyncCommand

type Template = {
  name: string
  display: string
  targetDir?: string
  customCommands?: Command[]
  color: ColorFunc
}

const TEMPLATES: Template[] = [
  {
    name: 'sanity-complete-studio',
    display: 'Sanity Studio (base studio with templates)',
    // customCommands: [
    //   'npm create sanity@latest -- --template clean --typescript'
    // ],
    color: magenta,
  },
  {
    name: 'sanity-schema-types',
    display: 'Sanity Schema Types (blocks, components, objects, utils, documents etc...)',
    color: lightBlue,
  },
]

const moveFiles: Record<string, string | undefined> = {
  '_.npmrc': '../../.npmrc',
  '_.nvmrc': '../../.nvmrc',
  '_.prettierignore': '../../.prettierignore',
  '_prettier.config.js': '../../prettier.config.js',
  '_tsconfig.json': '../../tsconfig.json',
}

async function createCms() {
  const help = argv.help
  if (help) {
    console.log(helpMessage)
  }

  let result: {
    rootDir: string
    templates: Template[]
    overwrite: string
  }

  // Step 1. Prompt the user

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'rootDir',
          message: `Where do you want to install Sanity Template Directory ${bold('(ex: [turborepo-root]/apps/studio)')} ?`,
          initial: '.',
          format: formatTargetDir,
        },
        {
          type: (_, { rootDir }: { rootDir: string }) => {
            const rootPath = path.join(cwd, rootDir)
            if (!fs.existsSync(rootPath)) {
              throw new Error(
                [
                  `${red('✖')} ${bold(rootPath)} was not found.`,
                  `${red('✖')} Operation cancelled`,
                ].join('\n'),
              )
            }
            return null
          },
          name: 'rootDirChecker',
        },
        {
          type: 'select',
          name: 'templates',
          message: 'Select one template to install:',
          choices: TEMPLATES.map((template) => {
            const templateColor = template.color
            return {
              title: templateColor(template.display || template.name),
              value: template,
            }
          }),
        },
        {
          type: (_, { templates }: { templates?: Template[] }) => {
            if (templates?.length === 0) {
              throw new Error(
                [
                  `${red('✖')} No templates were selected`,
                  `${red('✖')} Operation cancelled`,
                ].join('\n'),
              )
            }
            return null
          },
          name: 'templatesChecker',
        },
        {
          type: 'select',
          name: 'overwrite',
          message: 'Please choose how to proceed if selected templates already exist:',
          choices: [
            {
              title: 'Remove existing files and continue',
              value: 'yes',
            },
            {
              title: 'Ignore files and continue',
              value: 'ignore',
            },
            {
              title: 'Cancel operation',
              value: 'no',
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === 'no') {
              throw new Error(`${red('✖')} Operation cancelled`)
            }
            return null
          },
          name: 'overwriteChecker',
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} Operation cancelled`)
        },
      },
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    return
  }

  // User choices associated with prompts
  const { rootDir, templates, overwrite } = result

  const rootPath = path.join(cwd, rootDir)
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo?.name ?? 'npm'

  // Step 2. Copy the templates

  console.log(`\nScaffolding templates in ${rootPath}...`)

  for (const template of templates) {
    const callerPath = fileURLToPath(import.meta.url)
    const templateDir = `template-${template.name}`
    const templateSrc = path.resolve(callerPath, '../..', templateDir)
    const templateDest = path.join(rootPath, template.targetDir ?? `packages/${template.name}`)

    // Exit if no template files found
    if (!fs.existsSync(templateSrc)) {
      continue
    }

    if (fs.existsSync(templateDest) && overwrite === 'yes') {
      emptyDir(templateDest)
    } else {
      fs.mkdirSync(templateDest, { recursive: true })
    }

    const write = (file: string, content?: string) => {
      const targetPath = path.join(templateDest, moveFiles[file] ?? file)
      if (content) {
        fs.writeFileSync(targetPath, content)
      } else {
        copy(path.join(templateSrc, file), targetPath)
      }
    }

    const files = fs.readdirSync(templateSrc)
    for (const file of files) {
      write(file)
    }
  }

  // Step 3. Run the custom commands

  console.log(`\nDone. Now running template commands.`)

  // Flatten all selected template commands
  const customCommands = templates
    .map((t) => t.customCommands)
    .flat()
    .filter(Boolean) as Command[]

  // Run commands from project root
  if (rootPath !== cwd) {
    spawnSync('cd', [rootPath], { stdio: 'inherit' })
  }

  for (const customCommand of customCommands) {
    // `node:fs` commands as are stricly typed arrays
    if (Array.isArray(customCommand)) {
      const [command, ...args] = customCommand
      const formattedArgs = args.map((arg) =>
        typeof arg === 'string' ? formatCommand(arg) : arg,
      ) as typeof args
      fs[command](...formattedArgs)
      continue
    }

    // `spawnSync` commands are loosely typed strings
    const formattedCommand = formatCommand(customCommand)
    const [command, ...args] = splitCommand(formattedCommand) as [string, ...string[]]
    spawnSync(command, args, { stdio: 'inherit' })
  }

  // Step 4. Install dependencies

  console.log(`\nDone. Now installing dependencies.\n`)

  spawnSync(pkgManager, ['install'], { stdio: 'inherit' })

  // Step 5. Print goodbye message

  const cdProjectName = path.relative(cwd, rootPath)
  console.log(`\nDone. Now run:\n`)
  if (rootPath !== cwd) {
    console.log(`  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`)
  }
  console.log(`  ${pkgManager} run dev`)
  console.log()
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function formatCommand(command: string) {
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo?.name ?? 'npm'
  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version?.startsWith('1.')

  const formattedCommand = command
    .replaceAll('npm pkg ', () => {
      if (pkgManager === 'yarn') {
        return 'yarn config '
      }
      // `bun pkg` is not supported yet, use `npm pkg`.
      // @see https://github.com/oven-sh/bun/issues/9840
      if (pkgManager === 'bun') {
        return 'npm pkg '
      }
      return `${pkgManager} pkg `
    })
    .replaceAll('npm create ', () => {
      // `bun create` uses it's own set of templates,
      // the closest alternative is using `bun x` directly on the package
      if (pkgManager === 'bun') {
        return 'bun x create-'
      }
      return `${pkgManager} create `
    })
    // Only Yarn 1.x doesn't support `@version` in the `create` command
    .replaceAll('@latest', () => (isYarn1 ? '' : '@latest'))
    .replaceAll('npm exec ', () => {
      // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
      if (pkgManager === 'pnpm') {
        return 'pnpm dlx '
      }
      if (pkgManager === 'yarn' && !isYarn1) {
        return 'yarn dlx '
      }
      if (pkgManager === 'bun') {
        return 'bun x '
      }
      // Use `npm exec` in all other cases,
      // including Yarn 1.x and other custom npm clients.
      return 'npm exec '
    })
    .replaceAll('npm install ', () => {
      if (pkgManager === 'yarn') {
        return 'yarn add '
      }
      return `${pkgManager} install `
    })
    .replaceAll('npm uninstall ', () => {
      if (pkgManager === 'yarn') {
        return 'yarn remove '
      }
      return `${pkgManager} uninstall `
    })
    .replaceAll('npm run ', () => `${pkgManager} run `)

  return formattedCommand
}

function splitCommand(command: string) {
  const regex = /"([^"]+)"|\S+/g
  // Split by whitespaces ignoring those within double quotes
  return command.match(regex)?.map((token) => token.replaceAll('"', ''))
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  if (!pkgSpec) return undefined
  const pkgSpecArr = pkgSpec.split('/')

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

createCms().catch((error: unknown) => {
  console.error(error)
})
