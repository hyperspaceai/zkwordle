import { GamesPlayed } from "@/ui/demo/game/GamesPlayed";
import { Navbar } from "@/ui/demo/game/Navbar";
import ProofContent from "@/ui/demo/proof-content";
import { Footer } from "@/ui/footer";
import { Layout } from "@/ui/layout";

const ProofPage = () => {
  return (
    <Layout>
      <Navbar />
      <GamesPlayed />
      <ProofContent />
      <Footer />
    </Layout>
  );
};
export default ProofPage;
