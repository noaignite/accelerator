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
  Node,
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
const packageDir = process.cwd()
const repoRoot = path.resolve(packageDir, '..', '..')
const sourceDir = path.join(packageDir, 'src')
const outputDir = path.join(packageDir, 'dist/docs')
const githubUrl = 'https://github.com/noaignite/accelerator/tree/main'

/**
 * Initialize a `ts-morph` project and add source files.
 */
const project = new Project()
project.addSourceFilesAtPaths([
  `${sourceDir}/**/*.{ts,tsx}`,
  `!${sourceDir}/**/*index.{ts,tsx}`,
  `!${sourceDir}/**/*.test.{ts,tsx}`,
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
 * Removes `directory` and recreates it empty.
 */
function resetDirectory(directory: string) {
  fs.rmSync(directory, { recursive: true, force: true })
  ensureDirectoryExists(directory)
}

/**
 * Write `content` to `destination`, creating its directory if needed, and log
 * the result.
 */
function writeToFile(destination: string, content: string) {
  ensureDirectoryExists(path.dirname(destination))
  fs.writeFileSync(destination, content, { encoding: 'utf-8' })
  console.info(`Wrote file to: ${destination}`)
}

/**
 * Reads a file and returns its contents.
 */
function readFromFile(source: string) {
  return fs.readFileSync(source, { encoding: 'utf-8' })
}

/**
 * Retrieve the name from a declaration.
 */
function getDeclarationName(declaration: DeclarationTypes) {
  if ('getName' in declaration) {
    return declaration.getName()
  }

  for (const dec of declaration.getDeclarations()) {
    return dec.getName()
  }

  return undefined
}

/**
 * Converts a JSDoc comment into Markdown format.
 */
function convertJsDocToMarkdown(doc: JSDoc, name: string) {
  let markdown = `### \`${name}\`\n\n`

  const srcUrl = `${githubUrl}/${path.relative(repoRoot, doc.getSourceFile().getFilePath())}`
  markdown += `[See source on Github](${srcUrl})\n\n`

  const comment = doc.getComment()
  if (comment) {
    markdown += `${comment}\n`
  }

  const registeredTags: Record<string, boolean> = {}

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
        const url = tag.getText().split(' ')[1]?.trim()
        if (!registeredTags[tagName]) {
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

    registeredTags[tagName] = true
  })

  return markdown
}

/**
 * Extracts JSDoc comments from a source file and returns them in Markdown format.
 */
function extractJsDocsFromFile(sourceFile: SourceFile) {
  let markdownContent = ''

  const declarations: DeclarationTypes[] = sourceFile
    .getStatements()
    .filter(
      (statement): statement is DeclarationTypes =>
        Node.isFunctionDeclaration(statement) ||
        Node.isVariableStatement(statement) ||
        Node.isClassDeclaration(statement) ||
        Node.isInterfaceDeclaration(statement) ||
        Node.isTypeAliasDeclaration(statement),
    )
    .filter((declaration) => declaration.isExported())

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

    const outputFilePath = path.join(
      outputDir,
      path.relative(sourceDir, sourceFile.getFilePath()).replace(/\.(ts|tsx)$/, '.md'),
    )

    writeToFile(outputFilePath, markdownContent)
  })
}

/**
 * Copies the package README into the generated docs folder as `index.md`.
 */
function copyReadme() {
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) return

  writeToFile(path.join(outputDir, 'index.md'), readFromFile(readmePath))
}

/**
 * Builds the package-local docs output.
 */
function buildPackageDocs() {
  resetDirectory(outputDir)
  generateMarkdown()
  copyReadme()
}

buildPackageDocs()
