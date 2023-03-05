import { Box, Flex, Text } from "@chakra-ui/react";

interface ProgressBarProps {
  index: number;
  size: number;
  label: string;
  isCurrentDayStatRow: boolean;
}

export const ProgressBar = ({ index, size, label, isCurrentDayStatRow }: ProgressBarProps) => {
  return (
    <Flex alignItems="center" justify="flex-start">
      <Box alignItems="center" display="flex" justifyContent="center" w="2">
        {index + 1}
      </Box>
      <Box ml="2" w="full">
        <Box bg={isCurrentDayStatRow ? "brand.primary" : "gray.600"} p="0.5" w={`${8 + size}%`}>
          <Text color="gray.100" fontSize="xs" fontWeight="medium" textAlign="center">
            {label}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};
