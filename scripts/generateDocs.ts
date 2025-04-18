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

const githubUrl = 'https://github.com/noaignite/accelerator/tree/main'
const rootDir = '..'
const sourceDir = '../packages'
const outputDir = './src/content'
const ignoreDirs = ['.turbo', 'dist', 'node_modules', 'template-*']

// Initialize the project
const project = new Project()

// Add source files from the directory
project.addSourceFilesAtPaths([
  `${sourceDir}/*/src/**/*.{ts,tsx}`,
  `!${sourceDir}/*/src/**/*index.{ts,tsx}`,
  `!${sourceDir}/*/src/**/*.test.{ts,tsx}`,
])

/**
 * Ensures that a directory exists, creating it if it does not.
 */
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Attempts to retrieve the name from a declaration.
 */
function getDeclarationName(declaration: DeclarationTypes): string | undefined {
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
function convertJsDocToMarkdown(doc: JSDoc, name: string): string {
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
function extractJsDocsFromFile(sourceFile: SourceFile): string {
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
 * Writes the Markdown content to the appropriate directory and file.
 */
function writeMarkdownToFile(filePath: string, markdownContent: string): void {
  const outputFilePath = path.join(outputDir, filePath).replace(/\.(ts|tsx)$/, '.generated.md')
  const outputDirectory = path.dirname(outputFilePath)

  // Ensure the output directory exists
  ensureDirectoryExists(outputDirectory)

  try {
    // Write the file to the outputDir
    fs.writeFileSync(outputFilePath, markdownContent, { encoding: 'utf-8' })
    console.info(`Generated: ${outputFilePath}`)
  } catch (error) {
    console.error(`Failed to write file: ${outputFilePath}`, error)
  }
}

/**
 * Main function to iterate over source files, extract JSDoc, and write to .mdx files.
 */
function generateMarkdown() {
  project.getSourceFiles().forEach((sourceFile) => {
    const markdownContent = extractJsDocsFromFile(sourceFile)

    if (markdownContent) {
      // Get the file's path relative to sourceDir
      let relativePath = path.relative(sourceDir, sourceFile.getFilePath())
      relativePath = relativePath.replace(/src\//, '')

      // Write the Markdown content to the output file
      writeMarkdownToFile(relativePath, markdownContent)
    }
  })
}

/**
 * Recursively finds all README.md files in a directory.
 */
function findReadmeFiles(dir: string): string[] {
  let readmeFiles: string[] = []

  // Read the directory contents
  const filesAndDirs = fs.readdirSync(dir)

  // Traverse the directory contents
  for (const item of filesAndDirs) {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      // Skip ignored directories
      if (ignoreDirs.includes(item)) {
        continue
      }

      // Recurse into directories
      readmeFiles = readmeFiles.concat(findReadmeFiles(fullPath))
    } else if (stats.isFile() && item.toLowerCase() === 'readme.md') {
      // Add README.md files to the list
      readmeFiles.push(fullPath)
    }
  }

  return readmeFiles
}

function copyFile(source: string, destination: string) {
  try {
    fs.copyFileSync(source, destination)
    console.info(`Copied ${path.basename(source)} to: ${destination}`)
  } catch (error) {
    console.error(`Failed to copy ${path.basename(source)} to: ${destination}`, error)
  }
}

function copyFiles() {
  // Copy all package README.md files
  const readmeFiles = findReadmeFiles(sourceDir)

  readmeFiles.forEach((filePath) => {
    const relativePath = path.relative(sourceDir, filePath)
    const outputFilePath = path.join(outputDir, path.dirname(relativePath), 'index.md')

    ensureDirectoryExists(path.dirname(outputFilePath))
    copyFile(filePath, outputFilePath)
  })

  // Copy specified monorepo root files
  const monorepoRootFiles = ['CONTRIBUTING.md', 'README.md']

  monorepoRootFiles.forEach((filename) => {
    const sourcePath = path.resolve(rootDir, filename)
    const destinationPath = path.join(outputDir, filename === 'README.md' ? 'index.md' : filename)
    copyFile(sourcePath, destinationPath)
  })
}

function generateDocs() {
  generateMarkdown()
  copyFiles()
}

generateDocs()
