import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { LogoTicker } from "@/components/sections/logo-ticker";
import { auth } from "@clerk/nextjs/server";




const HomePage = async () => {

const { userId, isAuthenticated } = await auth();
  return (
  <>
  <Hero userId={userId} isAuthenticated={isAuthenticated} />
  <LogoTicker />
  <Features />
  <Footer />
  </>
  );
};

export default HomePage;

