import fs from 'node:fs'
import path from 'node:path'
import { Project } from 'ts-morph'

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

// Function to convert JSDoc comment into Markdown format
function convertJsDocToMarkdown(doc, functionName) {
  let markdown = `### \`${functionName}\`\n\n`

  const comment = doc.getComment()
  if (comment) {
    markdown += `${comment}\n\n`
  }

  // Add TSDoc tags
  doc.getTags().forEach((tag) => {
    const tagName = tag.getTagName()
    const tagText = tag.getComment() ?? ''

    if (tagName === 'param') {
      const paramName = tag.getChildAtIndex(1).getText()
      markdown += `* @${tagName} \`${paramName}\` ${tagText}\n`
    } else if (['returns', 'throws'].includes(tagName)) {
      markdown += `* @${tagName} ${tagText}\n`
    } else if (tagName === 'example') {
      markdown += `\n#### Example\n\n${tagText}\n`
    }
  })

  return markdown
}

// Helper function to ensure a directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Function to extract TSDoc and write to .mdx
function generateDocs() {
  // Iterate over the source files
  project.getSourceFiles().forEach((sourceFile) => {
    let markdownContent = ''

    // Iterate over each function in the file
    sourceFile.getFunctions().forEach((func) => {
      const functionName = func.getName()
      const jsDocs = func.getJsDocs()

      if (jsDocs.length > 0) {
        // Process all TSDoc comments
        jsDocs.forEach((jsDoc) => {
          markdownContent += convertJsDocToMarkdown(jsDoc, functionName ?? '')
        })
      }
    })

    if (markdownContent) {
      // Get the file's path relative to sourceDir
      let relativePath = path.relative(sourceDir, sourceFile.getFilePath())
      // Check if 'src/' is in the path and remove it
      relativePath = relativePath.replace(/src\//, '')

      // Get the directory where the mdx file should be created (remove the
      // file extensions)
      const outputFilePath = path.join(outputDir, relativePath).replace(/\.(ts|tsx)$/, '.mdx')
      const outputDirectory = path.dirname(outputFilePath)

      // Ensure the output directory exists
      ensureDirectoryExists(outputDirectory)

      // Write the MDX file to the mirrored directory structure
      fs.writeFileSync(outputFilePath, markdownContent, { encoding: 'utf-8' })
      console.info(`Generated: ${outputFilePath}`)
    }
  })
}

// Run the script
generateDocs()
