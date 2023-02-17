import type { ThemeOverride } from "@chakra-ui/react";
import { extendTheme as _extendTheme } from "@chakra-ui/react";

export const extendTheme = <T extends ThemeOverride>(t: T) => {
  return _extendTheme(t) as T;
};
