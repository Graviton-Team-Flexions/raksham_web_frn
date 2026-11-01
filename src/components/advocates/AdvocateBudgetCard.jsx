import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Briefcase, Building2, Check, Gavel, Home, Languages, Scale, ShieldCheck, Users, Video } from 'lucide-react'
import AdvocatePortrait from './AdvocatePortrait.jsx'
import { formatFee } from '../../data/advocateDirectory.js'

const AREA_ICONS = {
  family: Scale,
  civil: Users,
  criminal: Gavel,
  consumer: ShieldCheck,
  property: Home,
  labour: Briefcase,
  cyber: Building2,
  constitutional: Scale,
}

// One advocate, with the fee as the headline and a bar for how much of the budget it uses.
function AdvocateBudgetCard({ advocate, budget, lowest, profileTo, requestTo }) {
  const { t } = useTranslation()
  const name = t('advocates.name', { n: advocate.id })
  const percent = Math.min(100, Math.round((advocate.fee / budget) * 100))
  const usage = t('advocates.budgetUsed', { percent, budget: formatFee(budget) })

  return (
    <article className="adv-fcard">
      {lowest && <span className="adv-fcard__ribbon">{t('advocates.lowest')}</span>}
      <div className="adv-fcard__top">
        <div className="adv-fcard__photo">
          <AdvocatePortrait look={advocate.look} label={t('advocates.portraitAlt', { name })} />
        </div>
        <div>
          <h3 className="adv-fcard__name">{name}</h3>
          <div className="adv-fcard__badges">
            <span className="advf-verified">
              <Check aria-hidden="true" strokeWidth={3} />
              {t('advocates.verified')}
            </span>
            <span className="advf-sample">{t('advocates.sample')}</span>
          </div>
        </div>
      </div>

      <p className="adv-fcard__price">
        {formatFee(advocate.fee)}
        <small> {t('advocates.perConsultation')}</small>
      </p>
      <div className="adv-meter" role="img" aria-label={usage}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="adv-fcard__meta">{usage}</p>

      <ul className="adv-chips" aria-label={t('advocates.areasLabel')}>
        {advocate.areas.map((area) => {
          const Icon = AREA_ICONS[area]
          return (
            <li key={area} className="adv-chip">
              <Icon aria-hidden="true" strokeWidth={1.6} />
              {t(`advocates.areas.${area}`)}
            </li>
          )
        })}
      </ul>
      <p className="adv-fcard__meta adv-fcard__meta--icons">
        <Languages aria-hidden="true" strokeWidth={1.6} />
        {advocate.languages.map((code) => t(`advocates.languages.${code}`)).join(', ')}
        <Video aria-hidden="true" strokeWidth={1.6} />
        {advocate.modes.map((mode) => t(`advocates.modes.${mode}`)).join(' · ')}
      </p>

      <div className="adv-fcard__actions">
        <Link className="adv-fbtn adv-fbtn--line" to={profileTo}>{t('advocates.view')}</Link>
        <Link className="adv-fbtn adv-fbtn--yellow" to={requestTo}>{t('advocates.request')}</Link>
      </div>
    </article>
  )
}

export default AdvocateBudgetCard
