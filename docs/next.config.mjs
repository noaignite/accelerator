import nextra from 'nextra'

function traverseChildren(pageMapItem, callback) {
  if (pageMapItem.children) {
    pageMapItem.children.forEach((child) => {
      traverseChildren(child, callback)
    })
  }

  return callback(pageMapItem)
}

function formatGeneratedPageName(name) {
  return name.replace(/\.generated/, '')
}

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  transformPageOpts: (pageOpts) => {
    const { pageMap } = pageOpts

    pageOpts.pageMap = pageMap.flatMap((pageMapItem) => {
      if (pageMapItem.kind === 'Folder' && pageMapItem.name === '@noaignite') {
        traverseChildren(pageMapItem, (child) => {
          if (child.kind === 'MdxPage' && child.name.endsWith('.generated')) {
            child.name = formatGeneratedPageName(child.name)
          }

          if (child.kind === 'Meta') {
            child.data = Object.fromEntries(
              Object.entries(([key, value]) => {
                const formatted = formatGeneratedPageName(key)

                return [formatted, formatted]
              }),
            )
          }

          return child
        })
      }

      return [pageMapItem]
    })

    return pageOpts
  },
})

export default withNextra()
