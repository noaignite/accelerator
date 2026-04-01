# @noaignite/react-utils Skill Spec

`@noaignite/react-utils` is a React utility package focused on shared UI implementation details rather than end-user components. Its skill surface is best modeled as one package-level routing skill plus focused, task-oriented core skills for composition, refs, state/effects, browser events, overlays, interactions, and responsive logic.

## Domains

| Domain                                         | Description                                                                                 | Skills                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Component Factories and Block Rendering        | Typed component factories, required context, icons, local error boundaries, block renderers | `react-utils`, `component-factories-and-block-rendering` |
| Refs and Element Wiring                        | Ref merging, forwarded DOM ownership, element ref extraction                                | `refs-and-element-wiring`                                |
| Controllable State, Stable Effects, and Timers | Controlled state, stable callbacks, SSR-safe effects, timers                                | `controllable-state-stable-effects-and-timers`           |
| Native Events and Observers                    | Native event listeners and DOM observation                                                  | `native-events-and-observers`                            |
| Overlays, Focus, and Dismissal                 | Dismissable layers, focus restoration, inert behavior                                       | `overlays-focus-and-dismissal`                           |
| Gestures, Scroll, and Sticky Interactions      | Pointer gestures, drag scroll, scroll progress, sticky state                                | `gestures-scroll-and-sticky-interactions`                |
| Responsive Viewport and Directionality         | Element/window size, media queries, visual viewport, RTL                                    | `responsive-viewport-and-directionality`                 |

## Skill Inventory

| Skill                                          | Type | What it covers                                                                                    | Package                |
| ---------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------- | ---------------------- |
| `react-utils`                                  | core | Package-level entry point and decision tree                                                       | `packages/react-utils` |
| `component-factories-and-block-rendering`      | core | `createPolymorph`, `createRequiredContext`, `createSvgIcon`, `ErrorBoundary`, `createRenderBlock` | `packages/react-utils` |
| `refs-and-element-wiring`                      | core | `useForkRef`, `setRef`, `getReactElementRef`                                                      | `packages/react-utils` |
| `controllable-state-stable-effects-and-timers` | core | `useControlled`, `useStableCallback`, `useIsomorphicEffect`, `useInterval`, `useTimeout`          | `packages/react-utils` |
| `native-events-and-observers`                  | core | `useEvent`, `useIntersectionObserver`, `useResizeObserver`, `useMutationObserver`                 | `packages/react-utils` |
| `overlays-focus-and-dismissal`                 | core | `useDismiss`, `useFocusReturn`, `useInert`                                                        | `packages/react-utils` |
| `gestures-scroll-and-sticky-interactions`      | core | `useGesture`, `usePressHold`, `useDragScroll`, `useScrollProgress`, `useSticky`                   | `packages/react-utils` |
| `responsive-viewport-and-directionality`       | core | `useElementSize`, `useWindowSize`, `useVisualViewport`, `useMediaQuery`, `useRTL`                 | `packages/react-utils` |

## Key Failure Modes

| Skill                                          | Failure modes                                                                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `component-factories-and-block-rendering`      | Manual polymorphic prop unions, context usage outside provider, mixing adapter logic with rendering               |
| `refs-and-element-wiring`                      | Overwriting consumer refs, mishandling callback refs, reading refs from non-elements                              |
| `controllable-state-stable-effects-and-timers` | Switching ownership mode mid-lifecycle, stale timer closures, direct `useLayoutEffect` in SSR-capable shared code |
| `native-events-and-observers`                  | Choosing the wrong observer type, forgetting SSR-safe global targets, unbounded observer updates                  |
| `overlays-focus-and-dismissal`                 | Missing focus return, leaving background interactive, running dismissal listeners while closed                    |
| `gestures-scroll-and-sticky-interactions`      | Unconstrained directional gestures, bespoke drag-scroll reimplementation, assuming `useSticky` adds sticky CSS    |
| `responsive-viewport-and-directionality`       | Assuming concrete values on first render, using window size instead of container size, ignoring local RTL         |

## Recommended File Structure

- Root artifacts: `_artifacts/domain_map.yaml`, `_artifacts/skill_spec.md`, `_artifacts/skill_tree.yaml`
- Package-local skills: `packages/react-utils/skills/react-utils/**/SKILL.md`
- Nested structure is appropriate because the package has one cohesive surface area with several clear subdomains.

## Notes

- `createRenderBlock` is included in v1 even though it is more specialized than the rest of the package.
- The package has no separate framework adapter packages, so no additional framework skills are needed.
- A package-level router skill is still useful because the package exports many similarly low-level hooks.
