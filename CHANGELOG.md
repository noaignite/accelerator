### Versions

## 0.9.0
###### *2020-04-24*

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
###### *2020-03-27*

### `@oakwood/oui@v0.8.3`
- [Rwiper] Init hook no longer listens to navigation, pagination, scrollbar & on props

## 0.8.2
###### *2020-03-19*

### `@oakwood/oui@v0.8.2`
- [Media] Add object-fit cover for videos, style child img tag when component is picture & small refactor
- [Rwiper] Only trigger swiper slideTo if activeSlide is not of nullish value

### Core
- [core] Upgrade dependencies

## 0.8.1
###### *2020-03-09*

### `@oakwood/oui@v0.8.1`
- [Rwiper] Remove import of Swiper and let instance be passed down as a prop

### Docs
- [docs] Add documentation for custom Rwiper props

## 0.8.0
###### *2020-02-26*

### `@oakwood/oui@v0.8.0`
- [Media] Import Mui utils from Mui package
- [MediaLoader] Import Mui utils from Mui package
- [Rwiper] Add new react wrapper component for Swiper.js

### `@oakwood/oui-utils@v0.8.0`
- [utils] Add new useSmoothing util which smoothes out desired value over time

### Docs
- [docs] Add Rwiper documentation

## 0.7.1
###### *2020-02-07*

### `@oakwood/oui@v0.7.1`
- [AspectRatio] Now correctly sets object-fit style to video tags as well
- [npm] Upgrade to @maeertin/medialoaded@1.1.0

### `@oakwood/oui-utils@v0.7.1`
- [utils] mapRange now takes a sixth argument which will clamp the value if set to true

## 0.7.0
###### *2020-01-29*

### `@oakwood/oui@v0.7.0`
- [AspectRatio] Add root node styles to accommodate for passed component prop
- [ScrollProgress] onChange arguments no longer grouped into an object

## 0.6.3
###### *2020-01-14*

### `@oakwood/oui@v0.6.3`
- [AspectRatio] component prop now validates to elementType instead of string
- [MediaLoader] component prop now validates to elementType instead of string

## 0.6.2
###### *2020-01-09*

### `@oakwood/oui@v0.6.2`
- [npm] Upgrade to @maeertin/medialoaded@1.0.0 which can handle media erroring

## 0.6.1
###### *2020-01-08*

### `@oakwood/oui@v0.6.1`
- [MediaLoader] Switch out imagesLoaded for mediaLoaded package

### Docs
- [misc] Add additional stories showcasing functionality

## 0.6.0
###### *2019-12-11*

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
- [npm] Add peerDependencies within packages/* to root package.json as devDependencies
- [npm] Upgrade dependencies

## 0.5.2
###### *2019-11-18*

### `@oakwood/oui@v0.5.2`
- [Media] Fix ref forwarding for MediaWithWidth by replacing deprecated withWidth HOC for useMediaQuery hook

## 0.5.1
###### *2019-11-14*

### `@oakwood/oui@v0.5.1`
- [utils] Fix import paths as they were migrated to oui-utils

## 0.5.0
###### *2019-11-13*

Migrate all utils previously found under oui/utils over to oui-utils package for a more straight forward separation of package contents

### `@oakwood/oui@v0.5.0`
- [utils] Remove all utils

### `@oakwood/oui-utils@v0.5.0`
- [utils] Add utils previously found under oui/utils
- [utils] Add new mediaType util

## 0.4.1
###### *2019-11-07*

### `@oakwood/oui@v0.4.1`
- [ScrollProgress] Add component prop for overriding the rendered node

### Docs
- [ScrollProgress] Add example with component prop usage

## 0.4.0
###### *2019-11-01*

### `@oakwood/oui@v0.4.0`
- [MediaLoader] Fix ref issue where argument ref would be overriden
- [utils] Add setRef & useForkRef helpers

### `@oakwood/oui-utils@v0.4.0`
- [utils] Add refType propType

## 0.3.0
###### *2019-10-29*

### `@oakwood/oui@v0.3.0`
- [utils] Add createChainedFunction helper
- [utils] Add debounce helper

## 0.2.0
###### *2019-10-28*

### `@oakwood/oui@v0.2.0`
- [utils] Add new component related utils

### `@oakwood/oui-utils@v0.2.0`
- [utils] Migrate component related utils to @oakwood/oui

## 0.1.0
###### *2019-10-28*

- Add `.editorconfig` file
- Add `.prettierignore` file

### `@oakwood/oui-utils@v0.1.0`
- [utils] Add deepmerge helper function
