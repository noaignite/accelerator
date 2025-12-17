# @noaignite/react-utils

## 0.14.5

### Patch Changes

- d66f00b: createPolymorph: fix so `Props` can be typed as `object` again
  - @noaignite/utils@3.5.2

## 0.14.4

### Patch Changes

- f8d7e83: createPolymorph: fix union preservation when extending another polymorph

## 0.14.3

### Patch Changes

- 1429bb5: createPolymorph: fix so that extracted component props match polymorphic props

## 0.14.2

### Patch Changes

- f068cb3: createPolymorph: eliminate unintentional `any` type widening

## 0.14.1

### Patch Changes

- 76fb511: useControlled: `value` return type signature is now only `T`, previously `T | undefined`

## 0.14.0

### Minor Changes

- 32c8b81: Add the observer as the secondary callback arg

## 0.13.1

### Patch Changes

- Updated dependencies [4b628b5]
  - @noaignite/utils@3.5.2

## 0.13.0

### Minor Changes

- fba2271: add useDismiss hook

### Patch Changes

- @noaignite/utils@3.5.1

## 0.12.1

### Patch Changes

- 1a6a692: Update tsup config and package exports
- Updated dependencies [1a6a692]
  - @noaignite/utils@3.5.1

## 0.12.0

### Minor Changes

- 247ff8f: Add new useControlled hook

### Patch Changes

- ab5bb47: Add missing 'use client' directive
- f250796: Fix faulty check for `isRefObject`
- Updated dependencies [269cb8e]
- Updated dependencies [47502b3]
  - @noaignite/utils@3.5.0

## 0.11.0

### Minor Changes

- 759368c: add createPolymorph helper

### Patch Changes

- d88ed47: fix double-negation in condition
- 7362013: bump react from 18 to 19
- 7bdd79e: fix threshold value in useIntersectionObserver being checked as reference
- 25b9e22: fix double-negation in conditional inside useTimeout hook
- Updated dependencies [06e90d3]
- Updated dependencies [bb1ebc9]
  - @noaignite/utils@3.4.0

## 0.10.0

### Minor Changes

- cb9b64e: add useGesture hook
- 17c785b: add useDragScroll hook
- cb9b64e: limit event map in useEvent to HTMLElement
- 6d3b3d8: add usePressHold hook

### Patch Changes

- cb9b64e: change extension of useEvent from .tsx to .ts
- Updated dependencies [e51d5d3]
- Updated dependencies [189cd03]
- Updated dependencies [6f4eb57]
- Updated dependencies [0554c4f]
- Updated dependencies [7bec3e0]
- Updated dependencies [910044d]
  - @noaignite/utils@3.3.0

## 0.9.0

### Minor Changes

- cf69875: add useSticky hook
- f214535: add useWindowSize hook
- e5af57e: add useElementSize hook
- a34f3c6: add useVisualViewport hook
- 0110ff7: createRenderBlock - `blockType` is now passed to block component
- 0110ff7: createRenderBlock - adapter `context` argument (prev `additionalData`) is now always an object
- 0110ff7: createRenderBlock - export new `BlockTypeMap` & `BlockAdapter` types

## 0.8.0

### Minor Changes

- c359223: add getReactElementRef helper
- ece8e69: add useMediaQuery hook
- b586290: add useInert hook
- c9a3e72: add useForkRef hook
- 49d7a6b: add setRef helper
- 7522638: add new globals option to createRenderBlock
- 87ee1a6: add useFocusReturn hook
- 033a3cb: add useRtl hook

## 0.7.0

### Minor Changes

- c9ec852: createRenderBlock has a new defaultProps option
- 233cac3: add useInterval hook
- 3054df1: add `isRefObject` predicate & `useEvent` hook
- 407e5a1: add useTimeout hook

### Patch Changes

- Updated dependencies [09a9c15]
- Updated dependencies [6b42861]
- Updated dependencies [0198485]
  - @noaignite/utils@3.2.0

## 0.6.0

### Minor Changes

- a2d0531: add useMutationObserver hook
- 7e377bc: add useIntersectionObserver hook
- 177d1b6: add useIsomorphic effect hook
- 699787f: add useResizeObserver hook

## 0.5.1

### Patch Changes

- 50c8eea: wrap provider & consumer to register them as client components
- 3d2c339: re-enable tsup bundle setting thanks to esbuild-plugin-preserve-directives plugin

## 0.5.0

### Minor Changes

- 85dd0d6: Add initial version of `createRequiredContext`

## 0.4.0

### Minor Changes

- 6136389: add new createSvgIcon helper

## 0.3.0

### Minor Changes

- a0ad5df: drop support for commonJS

## 0.2.0

### Minor Changes

- 45b96d3: disable `bundle` as this causes issues with the 'use client' directive

## 0.1.0

### Minor Changes

- 11b2554: add react helper functions

  - Add createRenderBlock helper
