import nextra from 'nextra'

function formatGeneratedName(name) {
  return name.replace(/\.generated/, '')
}

function traverseChildren(pageMapItem, callback) {
  if (pageMapItem.children) {
    pageMapItem.children.forEach((child) => {
      traverseChildren(child, callback)
    })
  }

  return callback(pageMapItem)
}

function formatPageMapItemChild(child) {
  const name = formatGeneratedName(child.name)
  // Remove `.generated` from `name`.
  if (child.name?.endsWith('.generated')) {
    child.name = name
  }
  // `sidebarTitle` should be the same as `name`.
  if (child.frontMatter?.sidebarTitle) {
    child.frontMatter.sidebarTitle = name
  }
  // TODO: Is there a way override the url?
  // if (child.route?.endsWith('.generated')) {
  //   child.route = formatGeneratedPath(child.route)
  // }
}

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  transformPageMap: (pageMap) => {
    const newPageMap = pageMap.flatMap((pageMapItem) => {
      if (pageMapItem.children) {
        traverseChildren(pageMapItem, formatPageMapItemChild)
      }

      return [pageMapItem]
    })

    return newPageMap
  },
})

export default withNextra()
