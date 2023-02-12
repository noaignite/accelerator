// Based on: https://github.com/mui/material-ui/blob/v4.9.7/scripts/copy-files.js
/* eslint-disable no-console */
const path = require('path')
const fse = require('fs-extra')
const glob = require('glob')

const packagePath = process.cwd()
const buildPath = path.join(packagePath, './build')
const srcPath = path.join(packagePath, './src')

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file)
  const targetPath = path.resolve(buildPath, path.basename(file))
  await fse.copy(sourcePath, targetPath)
  console.log(`Copied ${sourcePath} to ${targetPath}`)
}

/**
 * Puts a package.json into every immediate child directory of rootDir.
 * That package.json contains information about esm for bundlers so that imports
 * like import Typography from '@mui/material/Typography' are tree-shakeable.
 *
 * @param {string} rootDir
 */
async function createModulePackages({ from, to }) {
  const directoryPackages = glob.sync('*/index.{js,ts,tsx}', { cwd: from }).map(path.dirname)

  await Promise.all(
    directoryPackages.map(async (directoryPackage) => {
      const packageJsonPath = path.join(to, directoryPackage, 'package.json')
      const topLevelPathImportsAreCommonJSModules = await fse.pathExists(
        path.resolve(path.dirname(packageJsonPath), '../esm'),
      )

      const packageJson = {
        sideEffects: false,
        module: topLevelPathImportsAreCommonJSModules
          ? path.posix.join('../esm', directoryPackage, 'index.js')
          : './index.js',
        main: topLevelPathImportsAreCommonJSModules
          ? './index.js'
          : path.posix.join('../node', directoryPackage, 'index.js'),
        types: './index.d.ts',
      }

      const [typingsEntryExist, moduleEntryExists, mainEntryExists] = await Promise.all([
        fse.pathExists(path.resolve(path.dirname(packageJsonPath), packageJson.types)),
        fse.pathExists(path.resolve(path.dirname(packageJsonPath), packageJson.module)),
        fse.pathExists(path.resolve(path.dirname(packageJsonPath), packageJson.main)),
        fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2)),
      ])

      const manifestErrorMessages = []
      if (!typingsEntryExist) {
        // TODO: re-add check once all has been migrated to TypeScript.
        // manifestErrorMessages.push(`'types' entry '${packageJson.types}' does not exist`)
      }
      if (!moduleEntryExists) {
        manifestErrorMessages.push(`'module' entry '${packageJson.module}' does not exist`)
      }
      if (!mainEntryExists) {
        manifestErrorMessages.push(`'main' entry '${packageJson.main}' does not exist`)
      }
      if (manifestErrorMessages.length > 0) {
        // TODO: AggregateError
        throw new Error(`${packageJsonPath}:\n${manifestErrorMessages.join('\n')}`)
      }

      return packageJsonPath
    }),
  )
}

async function createPackageFile() {
  const packageData = await fse.readFile(path.resolve(packagePath, './package.json'), 'utf8')
  const { scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(packageData)

  const newPackageData = {
    ...packageDataOther,
    private: false,
    ...(packageDataOther.main
      ? {
          main: fse.existsSync(path.resolve(buildPath, './node/index.js'))
            ? './node/index.js'
            : './index.js',
          module: fse.existsSync(path.resolve(buildPath, './esm/index.js'))
            ? './esm/index.js'
            : './index.js',
        }
      : {}),
  }

  const typeDefinitionsFilePath = path.resolve(buildPath, './index.d.ts')
  if (await fse.pathExists(typeDefinitionsFilePath)) {
    newPackageData.types = './index.d.ts'
  }

  const targetPath = path.resolve(buildPath, './package.json')

  await fse.writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8')
  console.log(`Created package.json in ${targetPath}`)

  return newPackageData
}

async function run() {
  try {
    await createPackageFile()

    await Promise.all(
      ['../../LICENSE', './README.md', './CHANGELOG.md'].map((file) => includeFileInBuild(file)),
    )

    await createModulePackages({ from: srcPath, to: buildPath })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
