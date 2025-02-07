import Appbar from "./components/Appbar";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { CTA } from "./components/cta";
import { Footer } from "./components/footer";
import bg from "./img/Hero-Bg1.jpg";
import Redirect from "./components/Redirect";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: `url(${bg.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <Appbar />
          <Redirect />
          <Hero />
        </div>
      </div>

      <main>
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
