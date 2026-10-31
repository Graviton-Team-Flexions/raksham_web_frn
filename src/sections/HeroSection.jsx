import { useTranslation } from 'react-i18next'
import { Shield } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import TrustIndicators from '../components/common/TrustIndicators.jsx'
import HeroIllustration from '../components/common/HeroIllustration.jsx'
import EmergencyHelplines from '../components/common/EmergencyHelplines.jsx'

function HeroSection() {
  const { t } = useTranslation()
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__inner wrap">
        <div className="hero__content">
          <p className="hero__badge">
            <Shield aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
            {t('hero.badge')}
          </p>
          <h1 className="hero__title" id="hero-title">
            <span>{t('tagline.line1')}</span>
            <span>
              {t('tagline.line2Prefix')} <em>{t('tagline.highlight')}</em>
            </span>
          </h1>
          <p className="hero__lead">{t('hero.lead')}</p>
          <div className="hero__actions">o
            <Button to="/auth/sign-in" arrow size="lg">{t('nav.getStarted')}</Button>
            <Button href="#how-it-works" variant="outline" size="lg">{t('hero.howItWorks')}</Button>
          </div>
          <TrustIndicators tone="dark" className="hero__trust" />
        </div>
        <HeroIllustration />
      </div>
      <div className="wrap hero__helplines">
        <EmergencyHelplines />
      </div>
    </section>
  )
}

export default HeroSection
