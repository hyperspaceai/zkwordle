import { useTheme as useChakraTheme } from "@chakra-ui/react";

import type { OverriddenTheme } from "@/styles/theme";

export const useTheme = () => {
  return useChakraTheme<OverriddenTheme>();
};
