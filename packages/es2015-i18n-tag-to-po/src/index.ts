import * as fs from 'fs'
import toPo from './toPo'

const paths = process.argv.slice(2)

paths.forEach((path) => {
  const filesContent = fs.readFileSync(path, { encoding: 'utf8' })

  const lastIndex = path.lastIndexOf('.')

  // Add the string before the last .
  // Return updated string, this will update the src attribute value
  const convertedToPo = toPo(filesContent)

  fs.writeFile(`${path.substring(0, lastIndex)}.po`, convertedToPo, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.log(err)
    else {
      // eslint-disable-next-line no-console
      console.log('File written successfully\n')
      // eslint-disable-next-line no-console
      console.log('The written has the following contents:')
    }
  })
})
