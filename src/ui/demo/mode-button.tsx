import type { ButtonProps } from "@chakra-ui/react";
import { Button, forwardRef, Icon, Tooltip } from "@chakra-ui/react";
import { Group } from "iconoir-react";

export const ModeButton = forwardRef<ButtonProps, "button">((props, ref) => {
  return (
    <Tooltip hasArrow label="Coming soon 👀">
      <Button leftIcon={<Icon as={Group} />} ref={ref} size="sm" {...props}>
        Enable Multiplayer Mode
      </Button>
    </Tooltip>
  );
});
