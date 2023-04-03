/* eslint-disable no-console */
const execSync = require('child_process').execSync
const path = require('path')
const chalk = require('chalk')
const commander = require('commander')
const fse = require('fs-extra')
const spawn = require('cross-spawn')
const validateProjectName = require('validate-npm-package-name')
const packageJson = require('./package.json')

const repoUrl = 'https://github.com/noaignite/create-ignite-app.git'
let branchName = 'main'
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
    version: '1.0.0',
    private: true,
  }

  await fse.writeFile(packagePath, JSON.stringify(newPackageData, null, 2), 'utf8')

  return newPackageData
}

async function createApp() {
  validateAppPath()
  validateAppName()

  console.log(`\nCreating a new Ignite app in ${chalk.green(projectPath)}.\n`)
  spawn.sync('git', ['clone', '--depth', '1', '--branch', branchName, repoUrl, projectName], {
    stdio: 'inherit',
  })

  process.chdir(projectPath)

  await updatePackageFile()

  execSync(`rm CHANGELOG.md`).toString().trim()
  execSync(`rm -rf .git`).toString().trim()

  execSync(`git init`).toString().trim()
  execSync(`git add .`).toString().trim()
  execSync(`git commit -m "chore: initialize project using @noaignite/create-app"`)
    .toString()
    .trim()

  console.log()
  console.log(`Initialized a git repository.`)
  console.log(`Created git commit.`)

  console.log()
  console.log(`Installing dependencies. This could take a few minutes.\n`)
  spawn.sync('yarnpkg', ['install'], { stdio: 'inherit' })

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
    .action((name, options) => {
      projectName = name
      projectPath = path.join(process.cwd(), name)

      if (options.branch) {
        branchName = options.branch
      }
    })
    .option('--branch <branch>', 'branch name')
    .allowUnknownOption()
    .on('--help', () => {
      console.log(`    Only ${chalk.green('<project-directory>')} is required.`)
      console.log()
      console.log(`    A desired ${chalk.cyan('--branch')} can be specified.`)
      console.log()
      console.log(`    If you have any problems, do not hesitate to file an issue:`)
      console.log(`      ${chalk.cyan('https://github.com/noaignite/accelerator/issues/new')}`)
      console.log()
    })
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
