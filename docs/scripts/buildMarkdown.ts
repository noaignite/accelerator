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

const sourceDir = '../packages'
const outputDir = './src/pages/@noaignite'

// Initialize the project
const project = new Project()

// Add source files from the directory
project.addSourceFilesAtPaths([
  `${sourceDir}/**/*.{ts,tsx}`,
  `!${sourceDir}/**/*index.{ts,tsx}`,
  `!${sourceDir}/**/{.turbo,dist,node_modules,template-*}/**/*.{ts,tsx}`,
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

  const comment = doc.getComment()
  if (comment) {
    markdown += `${comment}\n\n`
  }

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
      case 'returns':
      case 'throws':
        markdown += `- @${tagName} ${tagText}\n`
        break
      case 'example':
        markdown += `\n#### Example\n\n${tagText}\n`
        break
    }
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

  return markdownContent
}

/**
 * Writes the Markdown content to the appropriate directory and file.
 */
function writeMarkdownToFile(filePath: string, markdownContent: string): void {
  const outputFilePath = path.join(outputDir, filePath).replace(/\.(ts|tsx)$/, '.generated.mdx')
  const outputDirectory = path.dirname(outputFilePath)

  // Ensure the output directory exists
  ensureDirectoryExists(outputDirectory)

  try {
    fs.writeFileSync(outputFilePath, markdownContent, { encoding: 'utf-8' })
    console.info(`Generated: ${outputFilePath}`)
  } catch (error) {
    console.error(`Failed to write file: ${outputFilePath}`, error)
  }
}

/**
 * Main function to iterate over source files, extract JSDoc, and write to .mdx files.
 */
function buildMarkdown() {
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

// Run the script
buildMarkdown()
