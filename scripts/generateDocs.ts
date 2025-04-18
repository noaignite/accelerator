import fs from 'node:fs'
import path from 'node:path'
import {
  type ClassDeclaration,
  type FunctionDeclaration,
  type InterfaceDeclaration,
  type JSDoc,
  type SourceFile,
  type TypeAliasDeclaration,
  type VariableStatement,
  Project,
} from 'ts-morph'

type DeclarationTypes =
  | FunctionDeclaration
  | VariableStatement
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration

/**
 * Config
 */
const githubUrl = 'https://github.com/noaignite/accelerator/tree/main'
const rootDir = '..'
const packagesDir = '../packages'
const outputDir = './src/content'
const ignoreDirs = ['.turbo', 'dist', 'node_modules', 'template-*']
const copyPackageFileNames = ['CHANGELOG.md', 'README.md']
const copyDocsFilePaths = ['./CONTRIBUTING.md', './README.md', './docs/CHANGELOG.md']
const renameFileNames: Record<string, string> = {
  'README.md': 'index.md',
}

/**
 * Initialize a `ts-morph` project and add source files.
 */
const project = new Project()
project.addSourceFilesAtPaths([
  `${packagesDir}/*/src/**/*.{ts,tsx}`,
  `!${packagesDir}/*/src/**/*index.{ts,tsx}`,
  `!${packagesDir}/*/src/**/*.test.{ts,tsx}`,
])

/**
 * Ensures that a directory exists, creating it if it does not.
 */
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

/**
 * Copy `source` to `destination`, creating its directory if needed, and log
 * the result.
 */
function copyFile(source: string, destination: string) {
  ensureDirectoryExists(path.dirname(destination))

  try {
    fs.copyFileSync(source, destination)
    console.info(`Copied ${path.basename(source)} to: ${destination}`)
  } catch (error) {
    console.error(`Failed to copy ${path.basename(source)} to: ${destination}`, error)
  }
}

/**
 * Write `content` to `destination`, creating its directory if needed, and log
 * the result.
 */
function writeToFile(destination: string, content: string) {
  ensureDirectoryExists(path.dirname(destination))

  try {
    fs.writeFileSync(destination, content, { encoding: 'utf-8' })
    console.info(`Wrote file to: ${destination}`)
  } catch (error) {
    console.error(`Failed to write to: ${destination}`, error)
  }
}

/**
 * Recursively searches for files whose base names appear in `fileNames`,
 * starting from `directory`, and skips any directories listed in `ignoreDirectories`.
 */
function findFiles(directory: string, fileNames: string[], ignoreDirectories?: string[]) {
  let foundFiles: string[] = []
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  // Traverse the directory contents
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      if (ignoreDirectories?.includes(entry.name)) continue

      // Recurse into directories
      foundFiles.push(...findFiles(fullPath, fileNames, ignoreDirectories))
    } else if (entry.isFile() && fileNames.includes(entry.name)) {
      // Add found files to the list
      foundFiles.push(fullPath)
    }
  }

  return foundFiles
}

/**
 * Attempts to retrieve the name from a declaration.
 */
function getDeclarationName(declaration: DeclarationTypes) {
  let name: string | undefined
  if ('getName' in declaration) {
    name = declaration.getName()
  } else {
    // TODO: Is this really correct? How can there be nested declarations?
    for (const dec of declaration.getDeclarations()) {
      name = dec.getName()
    }
  }

  return name
}

/**
 * Converts a JSDoc comment into Markdown format.
 */
function convertJsDocToMarkdown(doc: JSDoc, name: string) {
  let markdown = `### \`${name}\`\n\n`

  const srcUrl = `${githubUrl}/${path.relative(rootDir, doc.getSourceFile().getFilePath())}`
  markdown += `[See source on Github](${srcUrl})\n\n`

  const comment = doc.getComment()
  if (comment) {
    markdown += `${comment}\n`
  }

  // So that we know if a tag is being concatinated for the first time enabling
  // us to add a tag headline.
  const registerdTags: Record<string, boolean> = {}

  // Add JSDoc tags
  doc.getTags().forEach((tag) => {
    const tagName = tag.getTagName()
    const tagText = tag.getComment() ?? ''

    switch (tagName) {
      case 'param': {
        const paramName = tag.getChildAtIndex(1).getText()
        markdown += `- @${tagName} \`${paramName}\` ${tagText}\n`
        break
      }
      case 'see': {
        // `getComment()` strips out the protocol. How to only get the url?
        const url = tag.getText().split(' ')[1]?.trim()
        if (!registerdTags[tagName]) {
          markdown += `\n#### See\n\n`
        }
        markdown += `- [${url}](${url})\n`
        break
      }
      case 'returns':
      case 'throws': {
        markdown += `- @${tagName} ${tagText}\n`
        break
      }
      case 'example':
        markdown += `\n#### Example\n\n${tagText}\n\n`
        break
    }

    registerdTags[tagName] = true
  })

  return markdown
}

/**
 * Extracts JSDoc comments from a source file and returns them in Markdown format.
 */
function extractJsDocsFromFile(sourceFile: SourceFile) {
  let markdownContent = ''

  const declarations: DeclarationTypes[] = [
    ...sourceFile.getFunctions(),
    ...sourceFile.getVariableStatements(),
    ...sourceFile.getClasses(),
    ...sourceFile.getInterfaces(),
    ...sourceFile.getTypeAliases(),
  ].filter((declaration) => declaration.isExported())

  declarations.forEach((declaration) => {
    const name = getDeclarationName(declaration)
    const jsDocs = declaration.getJsDocs()

    if (jsDocs.length > 0) {
      jsDocs.forEach((jsDoc) => {
        markdownContent += convertJsDocToMarkdown(jsDoc, name ?? '')
      })
    }
  })

  if (markdownContent !== '') {
    const name = sourceFile.getBaseNameWithoutExtension()
    markdownContent = `---\ntitle: ${name}\n---\n\n` + markdownContent
  }

  return markdownContent
}

/**
 * Iterate over source files, extract JSDoc, and write each as a generated
 * Markdown file.
 */
function generateMarkdown() {
  project.getSourceFiles().forEach((sourceFile) => {
    const markdownContent = extractJsDocsFromFile(sourceFile)
    if (!markdownContent) return

    // Build the path relative to the packages folder, strip out "src/"
    const relativePath = path.relative(packagesDir, sourceFile.getFilePath()).replace(/src\//, '')

    // Change .ts/.tsx to .generated.md and prepend the outputDir
    const outputFilePath = path
      .join(outputDir, relativePath)
      .replace(/\.(ts|tsx)$/, '.generated.md')

    writeToFile(outputFilePath, markdownContent)
  })
}

/**
 * Copies both package and documentation files into the configured output
 * directory.
 */
function copyFiles() {
  const jobs = [
    {
      // Source files + their base for relative paths
      sources: findFiles(packagesDir, copyPackageFileNames, ignoreDirs),
      baseDir: packagesDir,
      preserveSubdirectories: true,
    },
    {
      // Docs lives at various root‑relative paths
      sources: copyDocsFilePaths.map((p) => path.join(rootDir, p)),
      baseDir: rootDir,
      preserveSubdirectories: false,
    },
  ]

  jobs.forEach(({ sources, baseDir, preserveSubdirectories }) => {
    sources.forEach((source) => {
      // Determine the relative file path to use under outputDir
      const relativeFilePath = preserveSubdirectories
        ? path.relative(baseDir, source)
        : path.basename(source)

      // Apply any filename renames
      const originalName = path.basename(relativeFilePath)
      const finalName = renameFileNames[originalName] ?? originalName

      // Build the full destination path
      const destination = preserveSubdirectories
        ? path.join(outputDir, path.dirname(relativeFilePath), finalName)
        : path.join(outputDir, finalName)

      copyFile(source, destination)
    })
  })
}

function generateDocs() {
  generateMarkdown()
  copyFiles()
}

generateDocs()
