import React from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import FeaturesSection from '../components/FeaturesSection';
import TeamSection from '../components/TeamSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="landing-content">
        <HeroSection />
        <IntroSection />
        <FeaturesSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
