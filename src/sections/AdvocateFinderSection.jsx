import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Info, User } from 'lucide-react'
import SectionEyebrow from '../components/common/SectionEyebrow.jsx'
import RingCarousel from '../components/advocates/RingCarousel.jsx'
import AdvocateBudgetCard from '../components/advocates/AdvocateBudgetCard.jsx'
import { advocateAreas, BUDGET_MAX, BUDGET_MIN, BUDGET_STEP, directoryAdvocates, findAdvocates, formatFee } from '../data/advocateDirectory.js'

// Advocate discovery for visitors: pick a budget and a practice area, see who fits, cheapest first.
// Sample profiles only. Profiles and requests live in the app, where the simulated flow is.
function AdvocateFinderSection() {
  const { t } = useTranslation()
  const [budget, setBudget] = useState(BUDGET_MAX)
  const [area, setArea] = useState('all')
  const matches = useMemo(() => findAdvocates(directoryAdvocates, { budget, area }), [budget, area])
  const reset = () => {
    setBudget(BUDGET_MAX)
    setArea('all')
  }

  return (
    <section className="advf" id="advocates" aria-labelledby="advf-title">
      <div className="wrap">
        <div className="advf__head">
          <div>
            <SectionEyebrow>{t('advocates.eyebrow')}</SectionEyebrow>
            <h2 className="advf__title" id="advf-title">{t('advocates.title')}</h2>
            <p className="advf__sub">{t('advocates.sub')}</p>
          </div>
          <div className="advf__links">
            <Link className="advf__signin" to="/auth/sign-in">
              <User aria-hidden="true" strokeWidth={1.8} />
              {t('advocates.signInAdvocate')}
            </Link>
            <Link className="advf__all" to="/app/advocates">
              {t('advocates.seeAll')}
              <ArrowRight aria-hidden="true" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <p className="advf__banner" role="note">
          <Info aria-hidden="true" strokeWidth={1.6} />
          <span><strong>{t('advocates.preview')}</strong> {t('advocates.previewText')}</span>
        </p>

        <form className="advf__filter" role="search" aria-label={t('advocates.filter.aria')} onSubmit={(event) => event.preventDefault()}>
          <label className="advf__field advf__field--budget">
            <span>
              {t('advocates.filter.budget')}
              <strong>{formatFee(budget)}</strong>
            </span>
            <input
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              style={{ '--fill': `${((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100}%` }}
            />
            <small aria-hidden="true"><span>{formatFee(BUDGET_MIN)}</span><span>{formatFee(BUDGET_MAX)}</span></small>
          </label>
          <label className="advf__field">
            <span>{t('advocates.filter.area')}</span>
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="all">{t('advocates.filter.allAreas')}</option>
              {advocateAreas.map((key) => (
                <option key={key} value={key}>{t(`advocates.areas.${key}`)}</option>
              ))}
            </select>
          </label>
          <div className="advf__result">
            <p aria-live="polite">
              <BadgeCheck aria-hidden="true" strokeWidth={1.8} />
              {t('advocates.filter.match', { count: matches.length, total: directoryAdvocates.length })}
            </p>
            {(budget !== BUDGET_MAX || area !== 'all') && (
              <button type="button" className="advf__reset" onClick={reset}>{t('advocates.filter.reset')}</button>
            )}
          </div>
        </form>

        {matches.length === 0 ? (
          <div className="advf__empty" role="status">
            <p>{t('advocates.empty')}</p>
            <button type="button" className="advf__reset" onClick={reset}>{t('advocates.filter.reset')}</button>
          </div>
        ) : (
          <RingCarousel
            key={`${budget}-${area}`}
            label={t('advocates.listLabel')}
            items={matches}
            renderItem={(advocate) => (
              <AdvocateBudgetCard
                advocate={advocate}
                budget={budget}
                lowest={advocate.id === matches[0].id && matches.length > 1}
                profileTo="/app/advocates"
                requestTo="/app/advocates"
              />
            )}
          />
        )}

        <p className="advf__disclaimer">
          <Info aria-hidden="true" strokeWidth={1.75} />
          {t('human.disclaimer')}
        </p>
      </div>
    </section>
  )
}

export default AdvocateFinderSection
