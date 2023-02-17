import { MainContent } from "@/ui/demo/main-content";
import { ModeButton } from "@/ui/demo/mode-button";
import { SidebarContent } from "@/ui/demo/sidebar";
import { Layout } from "@/ui/layout";

const WordlePage = () => {
  return (
    <Layout gap={4} p={8} sidebar={<SidebarContent />}>
      <ModeButton alignSelf="end" />
      <MainContent flexGrow={1} />
    </Layout>
  );
};

export default WordlePage;
