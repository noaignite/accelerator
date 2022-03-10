/* eslint-disable no-console */
const chalk = require('chalk')
const commander = require('commander')
const execSync = require('child_process').execSync
const fse = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')
const validateProjectName = require('validate-npm-package-name')
const packageJson = require('./package.json')

const repoUrl = 'https://github.com/noaignite/create-ignite-app.git'
let projectName
let projectPath

function validateAppPath() {
  try {
    fse.mkdirSync(projectPath)
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(
        chalk.red(
          `Cannot create a project named ${chalk.green(
            `"${projectName}"`,
          )} because a file with that name already exists in the current directory.`,
        ),
      )
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

function validateAppName() {
  const validationResult = validateProjectName(projectName)
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${projectName}"`,
        )} because of npm naming restrictions:\n`,
      ),
    )
    ;[...(validationResult.errors || []), ...(validationResult.warnings || [])].forEach((error) => {
      console.error(chalk.red(`  * ${error}`))
    })
    console.error(chalk.red('\nPlease choose a different project name.'))
    process.exit(1)
  }
}

async function updatePackageFile() {
  const packagePath = path.resolve(projectPath, './package.json')
  const packageData = await fse.readFile(packagePath, 'utf8')
  const { author, bugs, description, license, repository, ...packageDataOther } =
    JSON.parse(packageData)

  const newPackageData = {
    ...packageDataOther,
    name: projectName,
    version: '0.1.0',
    private: true,
  }

  await fse.writeFile(packagePath, JSON.stringify(newPackageData, null, 2), 'utf8')

  return newPackageData
}

async function createApp() {
  validateAppPath()
  validateAppName()

  console.log(`\nCreating a new Ignite app in ${chalk.green(projectPath)}.\n`)
  spawn.sync('git', ['clone', '--depth', '1', repoUrl, projectName], { stdio: 'inherit' })

  process.chdir(projectPath)

  console.log(`\nInstalling dependencies. This could take a few minutes.\n`)
  spawn.sync('yarnpkg', ['install'], { stdio: 'inherit' })

  await updatePackageFile()

  execSync(`rm -rf .git`).toString().trim()
  execSync(`git init`).toString().trim()
  execSync(`git add .`).toString().trim()
  execSync(`git commit -m "chore: initialize project using create-ignite-app"`).toString().trim()
  console.log(`Initialized a git repository.`)
  console.log(`Created git commit.`)

  console.log()
  console.log(`Success! Created ${projectName} at ${chalk.green(projectPath)}.`)
  console.log(`Inside your project you can run several commands, here are some to get you started:`)

  console.log()
  console.log(`  ${chalk.cyan('yarn storybook')}`)
  console.log(`    Starts the Storybook server.`)

  console.log()
  console.log(`  ${chalk.cyan('yarn dev')}`)
  console.log(`    Starts the Next.js development server.`)

  console.log(`\nWe suggest that you begin by typing:\n`)
  console.log(`  ${chalk.cyan('cd')} ${projectName}`)
  console.log(`  ${chalk.cyan('yarn storybook')}`)

  console.log(`\nHappy coding!`)
}

function init() {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((name) => {
      projectName = name
      projectPath = path.join(process.cwd(), name)
    })
    .allowUnknownOption()
    .parse(process.argv)

  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`)
    console.log()
    console.log('For example:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`)
    process.exit(1)
  }

  createApp()
}

module.exports = {
  init,
}
