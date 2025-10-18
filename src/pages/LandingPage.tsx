import Hero from '@/components/LandingPage/Hero';
import Features from '@/components/LandingPage/Features';
import About from '@/components/LandingPage/About';
import Testimonial from '@/components/LandingPage/Testimonial';
import CTA from '@/components/LandingPage/Cta';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* About Section */}
      <About />

      {/* Testimonials Section */}
      <Testimonial />

      {/* CTA Section */}
      <CTA />

      <Footer />
    </div>
  );
}
