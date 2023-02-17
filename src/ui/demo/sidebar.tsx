import { Link, Text } from "@chakra-ui/react";

import { Sidebar } from "@/ui/sidebar";

const LEARN_MORE_URL = "https://hyperspace.foundation/";

export const SidebarContent = () => {
  return (
    <Sidebar title="ZK-WASM Demo">
      <Text>This website has an embedded Zero Knowledge runtime.</Text>
      <Text>TODO</Text>
      <Link href={LEARN_MORE_URL}>Learn More →</Link>
    </Sidebar>
  );
};
