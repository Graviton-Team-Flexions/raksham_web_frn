import { useTranslation } from 'react-i18next'
import { Check, Info } from 'lucide-react'
import SectionEyebrow from '../components/common/SectionEyebrow.jsx'
import Button from '../components/ui/Button.jsx'
import HumanHelpIllustration from '../components/common/HumanHelpIllustration.jsx'
import { humanHelpPoints } from '../data/content.js'

function HumanHelpSection() {
  const { t } = useTranslation()
  return (
    <section className="human" id="human-help" aria-labelledby="human-title">
      <div className="wrap">
        <div className="human__panel">
          <div className="human__grid">
            <div className="human__content">
              <div className="human__meta">
                <SectionEyebrow className="eyebrow--spaced">{t('human.eyebrow')}</SectionEyebrow>
                <span className="human__preview">{t('human.preview')}</span>
                <span className="human__status">{t('human.status')}</span>
              </div>
              <h2 className="human__title" id="human-title">
                {t('human.titleLine1')}
                <br />
                <em>{t('human.titleHighlight')}</em>
                {t('human.titleRest')}
              </h2>
              <p className="human__lead">{t('human.lead')}</p>
              <ul className="human__points">
                {humanHelpPoints.map((point) => (
                  <li key={point}>
                    <span className="human__check" aria-hidden="true">
                      <Check strokeWidth={3} />
                    </span>
                    {t(`human.points.${point}`)}
                  </li>
                ))}
              </ul>
              <Button href="#advocates" variant="outline" arrow>{t('human.learnMore')}</Button>
            </div>
            <HumanHelpIllustration />
          </div>
          <p className="human__disclaimer">
            <Info aria-hidden="true" strokeWidth={1.75} />
            {t('human.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HumanHelpSection
