type ES2015TranslationParsedJSON = Record<string, Record<string, string>>

function createConvertToPoEntry(filePath: string) {
  return function convertToPoEntry([key, value]: [string, string]) {
    return String.raw`#: src/${filePath}
msgid "${key}"
msgstr "${value !== '' ? value : key}"
`
  }
}

function toPo(json: string) {
  const parsed: ES2015TranslationParsedJSON = JSON.parse(json)

  const translationsByFiles = Object.entries(parsed)

  const result = translationsByFiles.map(([filePath, translations]) => {
    const convertToPoEntry = createConvertToPoEntry(filePath)

    const entries = Object.entries(translations).map(convertToPoEntry)
    return String.raw({ raw: entries.join('\n') })
  })

  return String.raw({ raw: result.join('\n') })
}

export default toPo
