import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import SachiWidget from '../components/app/SachiWidget.jsx'
import HeroSection from '../sections/HeroSection.jsx'
import WhyRakshamSection from '../sections/WhyRakshamSection.jsx'
import LegalCategoriesSection from '../sections/LegalCategoriesSection.jsx'
import HowItWorksSection from '../sections/HowItWorksSection.jsx'
import HumanHelpSection from '../sections/HumanHelpSection.jsx'
import AdvocateFinderSection from '../sections/AdvocateFinderSection.jsx'
import OfficialResourcesSection from '../sections/OfficialResourcesSection.jsx'
import PrivacySafetySection from '../sections/PrivacySafetySection.jsx'

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhyRakshamSection />
        <LegalCategoriesSection />
        <HowItWorksSection />
        <HumanHelpSection />
        <AdvocateFinderSection />
        <OfficialResourcesSection />
        <PrivacySafetySection />
      </main>
      <Footer />
      <SachiWidget />
    </>
  )
}

export default HomePage
