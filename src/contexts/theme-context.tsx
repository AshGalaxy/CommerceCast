/**
 * Thin re-export shim — keeps existing `@/contexts/theme-context` import paths
 * working across the codebase while the real implementation is now next-themes.
 *
 * next-themes handles:
 *  • SSR safety (no window access on server)
 *  • Blocking inline script → zero FOUC
 *  • localStorage persistence
 *  • System preference detection (prefers-color-scheme)
 *  • Hydration-safe class toggling on <html>
 */
export { useTheme } from 'next-themes';
