import { readable } from 'svelte/store';
import { browser } from '$app/environment';

import * as defaultTheme from 'tailwindcss/defaultTheme';
const screens = {
  mobile: { min: '0', max: '640px' },
  ...defaultTheme.screens
};

// type contains all breakpoints, from all keys of the tailwindConfig.theme?.screens object
export type Breakpoint = keyof typeof screens;
type Breakpoints = Record<Breakpoint, boolean>;

const breakpoints = Object.entries(screens).map(([key, value]) => ({
  key: key as Breakpoint,
  value: value as string | { min?: string; max?: string }
}));

const emptyBreakpoints = Object.fromEntries(
  breakpoints.map(({ key }) => [key, false])
) as Breakpoints;

export const breakpoint = readable<Record<Breakpoint, boolean>>(emptyBreakpoints, (set) => {
  const breakpoint = emptyBreakpoints;
  const listeners: { mql: MediaQueryList; listener: (event: MediaQueryListEvent) => void }[] = [];

  for (const { key, value } of breakpoints) {
    let mediaQuery = '';
    if (typeof value === 'string') {
      mediaQuery = `(min-width: ${value})`;
    } else if (typeof value === 'object') {
      if (value.max && value.min) {
        mediaQuery = `(min-width: ${value.min}) and (max-width: ${value.max})`;
      } else if (value.max) {
        mediaQuery = `(max-width: ${value.max})`;
      } else if (value.min) {
        mediaQuery = `(min-width: ${value.min})`;
      }
    }

    if (browser) {
      const mql = window.matchMedia(mediaQuery);
      const listener = (event: MediaQueryListEvent) => {
        if (event.matches) {
          breakpoint[key] = true;
        } else {
          breakpoint[key] = false;
        }
        set(breakpoint);
      };
      mql.addEventListener('change', listener);
      breakpoint[key] = mql.matches;
      listeners.push({ mql, listener });
    }
  }

  return () => {
    for (const { mql, listener } of listeners) {
      mql.removeEventListener('change', listener);
    }
  };
});
