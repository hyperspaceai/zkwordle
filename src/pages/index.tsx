import { GamesPlayed } from "@/ui/demo/game/GamesPlayed";
import { Navbar } from "@/ui/demo/game/Navbar";
import { MainContent } from "@/ui/demo/main-content";
import { Footer } from "@/ui/footer";
import { Layout } from "@/ui/layout";

const HomePage = () => {
  return (
    <Layout>
      <Navbar />
      <GamesPlayed />
      <MainContent />
      <Footer />
    </Layout>
  );
};

export default HomePage;
