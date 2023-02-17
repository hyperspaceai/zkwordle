import type { Theme, ThemeOverride } from "@chakra-ui/react";
import { extendTheme, theme as defaultTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { mode, transparentize } from "@chakra-ui/theme-tools";

import { colors } from "./colors";
import { config } from "./config";

export type OverriddenTheme = Theme & typeof themeOverrides;

export const themeOverrides = (<T extends ThemeOverride>(t: T) => t)({
  borders: {
    debug: "1px solid red",
  },
  config,
  colors,
  components: {
    Tooltip: {
      baseStyle: {
        rounded: "lg",
      },
    },
  },
  fonts: {
    body: `'Be Vietnam Pro',  ${defaultTheme.fonts.body}`,
    heading: `'Be Vietnam Pro',  ${defaultTheme.fonts.heading}`,
    mono: `'JetBrains Mono', ${defaultTheme.fonts.mono}`,
  },
  styles: {
    global: (props) => ({
      ":root": {
        colorScheme: mode("light", "dark")(props),
      },
      "::selection": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        bgColor: transparentize(props.theme.colors.brand.primary, 0.8),
      },
      body: {
        bg: mode("gray.100", "black")(props),
        bgImage: "url(/shapes.svg)",
        bgRepeat: "no-repeat",
        bgPos: "right bottom",
        color: mode("black", "gray.100")(props),
        fontFamily: "body",
        letterSpacing: "tight",
        lineHeight: "base",
        minH: "100vh",
        textRendering: "optimizeLegibility",
        transitionDuration: "normal",
        transitionProperty: "background-color",
        MozOsxFontSmoothing: "grayscale",
        WebkitFontSmoothing: "antialiased",
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props),
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.200", "whiteAlpha.300")(props),
        wordWrap: "break-word",
      },
    }),
  },
});

export const theme = extendTheme(
  themeOverrides,
  withDefaultColorScheme({ colorScheme: "pink" }),
  //
) as OverriddenTheme;
