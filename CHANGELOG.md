### Versions

## 0.9.7

###### _2020-06-25_

### `@oakwood/oui@v0.9.7`

- [MediaLoader] Fix MediaLoader from not forwarding external ref on the child element

## 0.9.6

###### _2020-06-17_

### `@oakwood/oui@v0.9.6`

- [MediaLoader] New "lazyRootMargin" prop for customizing load-in distance threshold
- [MediaLoader] Bump default lazy load-in distance threshold from 2000px to 3000px which is based on Chromium 4G threshold
- [MediaLoader] Rename "rootMargin" prop to "revealRootMargin"
- [MediaLoader] Rename "in" prop to "reveal"

### Core

- [core] Upgrade @babel/\* dependencies

### Docs

- [docs] Upgrade dependencies

## 0.9.5

###### _2020-06-05_

### `@oakwood/oui@v0.9.5`

- [AspectRatio] Update to a more generic selector when setting object-fit cover
- [MediaLoader] Fix bug where loaded callback would run even after unmount
- [MediaLoader] Now conditionally transitions either children or placeholder and no longer both
- [MediaLoader] Small update to prop interface
- [MediaLoader] Performance enhancements

### Core

- [core] Upgrade dependencies

### Docs

- [docs] Add new & update old stories for MediaLoader
- [docs] Upgrade dependencies

## 0.9.4

###### _2020-05-15_

### `@oakwood/oui@v0.9.4`

- [npm] Bump @maeertin/medialoaded from v1.2.0 to v1.2.1

## 0.9.3

###### _2020-05-15_

### `@oakwood/oui@v0.9.3`

- [npm] Bump @maeertin/medialoaded from v1.1.0 to v1.2.0
- [npm] Bump react-intersection-observer from v8.26.1 to v8.26.2

## 0.9.2

###### _2020-05-15_

### `@oakwood/oui@v0.9.2`

- [MediaLoader] Add new placeholder transition component props for more flexibility

### Docs

- [docs] Use a bigger image in MediaLoader custom placeholder story

## 0.9.1

###### _2020-04-24_

### `@oakwood/oui@v0.9.1`

- [BackgroundMedia] Less config needed

## 0.9.0

###### _2020-04-24_

### `@oakwood/oui@v0.9.0`

- [BackgroundMedia] Introduce new component for creating stylish background image effects

### `@oakwood/oui-utils@v0.9.0`

- [utils] Remove local Mui util definitions and export them directly from it's package
- [npm] @material-ui/core now a peerDependency

### Core

- [core] Update to new react import style
- [core] Bump eslint from v5.9.0 to v6.8.0
- [core] Bump eslint-config-airbnb from v17.1.1 to v18.1.0

### Docs

- [docs] Create story for new BackgroundMedia component
- [docs] Configure alphabetical story sorting
- [docs] Configure @storybook/addon-a11y
- [docs] Upgrade dependencies

## 0.8.3

###### _2020-03-27_

### `@oakwood/oui@v0.8.3`

- [Rwiper] Init hook no longer listens to navigation, pagination, scrollbar & on props

## 0.8.2

###### _2020-03-19_

### `@oakwood/oui@v0.8.2`

- [Media] Add object-fit cover for videos, style child img tag when component is picture & small refactor
- [Rwiper] Only trigger swiper slideTo if activeSlide is not of nullish value

### Core

- [core] Upgrade dependencies

## 0.8.1

###### _2020-03-09_

### `@oakwood/oui@v0.8.1`

- [Rwiper] Remove import of Swiper and let instance be passed down as a prop

### Docs

- [docs] Add documentation for custom Rwiper props

## 0.8.0

###### _2020-02-26_

### `@oakwood/oui@v0.8.0`

- [Media] Import Mui utils from Mui package
- [MediaLoader] Import Mui utils from Mui package
- [Rwiper] Add new react wrapper component for Swiper.js

### `@oakwood/oui-utils@v0.8.0`

- [utils] Add new useSmoothing util which smoothes out desired value over time

### Docs

- [docs] Add Rwiper documentation

## 0.7.1

###### _2020-02-07_

### `@oakwood/oui@v0.7.1`

- [AspectRatio] Now correctly sets object-fit style to video tags as well
- [npm] Upgrade to @maeertin/medialoaded@1.1.0

### `@oakwood/oui-utils@v0.7.1`

- [utils] mapRange now takes a sixth argument which will clamp the value if set to true

## 0.7.0

###### _2020-01-29_

### `@oakwood/oui@v0.7.0`

- [AspectRatio] Add root node styles to accommodate for passed component prop
- [ScrollProgress] onChange arguments no longer grouped into an object

## 0.6.3

###### _2020-01-14_

### `@oakwood/oui@v0.6.3`

- [AspectRatio] component prop now validates to elementType instead of string
- [MediaLoader] component prop now validates to elementType instead of string

## 0.6.2

###### _2020-01-09_

### `@oakwood/oui@v0.6.2`

- [npm] Upgrade to @maeertin/medialoaded@1.0.0 which can handle media erroring

## 0.6.1

###### _2020-01-08_

### `@oakwood/oui@v0.6.1`

- [MediaLoader] Switch out imagesLoaded for mediaLoaded package

### Docs

- [misc] Add additional stories showcasing functionality

## 0.6.0

###### _2019-12-11_

### `@oakwood/oui@v0.6.0`

- [components] Update all components to merge in theme global props & overrides
- [MediaLoader] Refactor component with extended opt-in functionality
- [AspectRatio] New component which was extracted from MediaLoader
- [Media] Remove warning package dependency
- [index.js] Update common exports file pattern
- [npm] Replace classnames for clsx for smaller build footprint

### `@oakwood/oui-utils@v0.6.0`

- [utils] Rename map to mapRange for clarity
- [utils] Add elementAcceptingRef & elementTypeAcceptingRef utils
- [utils] Add chainPropTypes util
- [utils] Fix faulty refType
- [npm] Add babel-runtime dependency

### Docs

- [misc] Update story naming convention
- [npm] Upgrade dependencies

### Core

- [npm] Add peerDependencies within packages/\* to root package.json as devDependencies
- [npm] Upgrade dependencies

## 0.5.2

###### _2019-11-18_

### `@oakwood/oui@v0.5.2`

- [Media] Fix ref forwarding for MediaWithWidth by replacing deprecated withWidth HOC for useMediaQuery hook

## 0.5.1

###### _2019-11-14_

### `@oakwood/oui@v0.5.1`

- [utils] Fix import paths as they were migrated to oui-utils

## 0.5.0

###### _2019-11-13_

Migrate all utils previously found under oui/utils over to oui-utils package for a more straight forward separation of package contents

### `@oakwood/oui@v0.5.0`

- [utils] Remove all utils

### `@oakwood/oui-utils@v0.5.0`

- [utils] Add utils previously found under oui/utils
- [utils] Add new mediaType util

## 0.4.1

###### _2019-11-07_

### `@oakwood/oui@v0.4.1`

- [ScrollProgress] Add component prop for overriding the rendered node

### Docs

- [ScrollProgress] Add example with component prop usage

## 0.4.0

###### _2019-11-01_

### `@oakwood/oui@v0.4.0`

- [MediaLoader] Fix ref issue where argument ref would be overriden
- [utils] Add setRef & useForkRef helpers

### `@oakwood/oui-utils@v0.4.0`

- [utils] Add refType propType

## 0.3.0

###### _2019-10-29_

### `@oakwood/oui@v0.3.0`

- [utils] Add createChainedFunction helper
- [utils] Add debounce helper

## 0.2.0

###### _2019-10-28_

### `@oakwood/oui@v0.2.0`

- [utils] Add new component related utils

### `@oakwood/oui-utils@v0.2.0`

- [utils] Migrate component related utils to @oakwood/oui

## 0.1.0

###### _2019-10-28_

- Add `.editorconfig` file
- Add `.prettierignore` file

### `@oakwood/oui-utils@v0.1.0`

- [utils] Add deepmerge helper function
