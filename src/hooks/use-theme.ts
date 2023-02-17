import { OverriddenTheme } from "@/styles/theme";
import { useTheme as useChakraTheme } from "@chakra-ui/react";

export const useTheme = () => {
  return useChakraTheme<OverriddenTheme>();
};
