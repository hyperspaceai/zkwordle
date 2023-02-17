import { ModeButton } from "@/ui/demo/mode-button";
import ProofContent from "@/ui/demo/proof-content";
import { SidebarContent } from "@/ui/demo/sidebar";
import { Layout } from "@/ui/layout";

const ProofPage = () => {
  return (
    <Layout gap={4} p={8} sidebar={<SidebarContent />}>
      <ModeButton alignSelf="end" />

      <ProofContent flexGrow={1} />
    </Layout>
  );
};
export default ProofPage;
