import fs from 'node:fs'
import path from 'node:path'
import {
  Node,
  Project,
  type ClassDeclaration,
  type FunctionDeclaration,
  type InterfaceDeclaration,
  type JSDoc,
  type SourceFile,
  type TypeAliasDeclaration,
  type VariableStatement,
} from 'ts-morph'
import { injectFrontmatter, readFromFile, resetDirectory, writeFileTo } from './docsUtils.ts'

type DeclarationTypes =
  | FunctionDeclaration
  | VariableStatement
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration

type ExportedDoc = {
  docPath: string
}

/**
 * Config
 */
const packageDir = process.cwd()
const repoRoot = path.resolve(packageDir, '..', '..')
const sourceDir = path.join(packageDir, 'src')
const outputDir = path.join(packageDir, 'dist/docs')
const githubUrl = 'https://github.com/noaignite/accelerator/tree/main'
const packageName = JSON.parse(
  fs.readFileSync(path.join(packageDir, 'package.json'), { encoding: 'utf-8' }),
).name as string
const rootDocs = [
  {
    source: './README.md',
    destination: 'index.md',
    title: 'Getting Started',
  },
]

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
 * Converts a path to a POSIX-style path for Markdown links.
 */
function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
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
 * Returns the docs file path for a source file.
 */
function getDocPath(sourceFile: SourceFile) {
  return path.join(
    outputDir,
    path.relative(sourceDir, sourceFile.getFilePath()).replace(/\.(ts|tsx)$/, '.md'),
  )
}

/**
 * Returns the exported declaration statements that can produce generated docs.
 */
function getExportedDeclarations(sourceFile: SourceFile) {
  return sourceFile
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
}

/**
 * Collects all exported declarations that have docs generated for them.
 */
function getExportedDocs() {
  const exportedDocs = new Map<string, ExportedDoc>()

  project.getSourceFiles().forEach((sourceFile) => {
    const docPath = getDocPath(sourceFile)
    const declarations = getExportedDeclarations(sourceFile)

    declarations.forEach((declaration) => {
      const name = getDeclarationName(declaration)
      const jsDocs = declaration.getJsDocs()

      if (name && jsDocs.length > 0) {
        exportedDocs.set(docPath, { docPath })
      }
    })
  })

  return [...exportedDocs.values()].sort((a, b) => a.docPath.localeCompare(b.docPath))
}

/**
 * Builds the generated "available exports" section for the package README.
 */
function buildAvailableExportsSection(exportedDocs: ExportedDoc[]) {
  if (exportedDocs.length === 0) {
    return '## Available exports\n\n_No generated export docs found._'
  }

  const lines = ['## Available exports', '']

  exportedDocs.forEach(({ docPath }) => {
    const relativeDocPath = path.relative(outputDir, docPath)
    const label = path.basename(docPath, path.extname(docPath))
    lines.push(`* [${label}](./${toPosixPath(relativeDocPath)})`)
  })

  return lines.join('\n')
}

/**
 * Extracts JSDoc comments from a source file and returns them in Markdown format.
 */
function buildMarkdownFromFile(sourceFile: SourceFile) {
  let content = ''
  const declarations = getExportedDeclarations(sourceFile)

  declarations.forEach((declaration) => {
    const name = getDeclarationName(declaration)
    const jsDocs = declaration.getJsDocs()

    if (jsDocs.length > 0) {
      jsDocs.forEach((jsDoc) => {
        content += convertJsDocToMarkdown(jsDoc, name ?? '')
      })
    }
  })

  if (content !== '') {
    const name = sourceFile.getBaseNameWithoutExtension()
    content = injectFrontmatter(content, `${packageName}: ${name}`, name)
  }

  return content
}

/**
 * Iterate over source files, extract JSDoc, and write each as a generated
 * Markdown file.
 */
function writePackageDocs() {
  project.getSourceFiles().forEach((sourceFile) => {
    const content = buildMarkdownFromFile(sourceFile)
    if (!content) return

    const outputFilePath = getDocPath(sourceFile)

    writeFileTo(outputFilePath, content)
  })
}

/**
 * Copies the package README into the generated docs folder as `index.md`.
 */
function copyRootDocs() {
  const exportedDocs = getExportedDocs()

  rootDocs.forEach(({ source: relativePath, destination, title }) => {
    const source = path.join(packageDir, relativePath)
    if (!fs.existsSync(source)) return

    let content = readFromFile(source)
    content = content.replaceAll(
      '<!-- package-docs:exports -->',
      buildAvailableExportsSection(exportedDocs),
    )
    content = injectFrontmatter(content, title)
    writeFileTo(path.join(outputDir, destination), content)
  })
}

/**
 * Builds the package-local docs output.
 */
function buildPackageDocs() {
  resetDirectory(outputDir)
  writePackageDocs()
  copyRootDocs()
}

buildPackageDocs()
