import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, FileText, IdCard, Landmark, MessageSquareText } from 'lucide-react'
import { OFFICIAL_SITES } from '../../data/resourceHub.js'

// Four shortcuts. The two complaint links open the official portal's home page (no deep link is
// verified yet). "Nearest police station" asks Sachi, because no official finder has been verified.
// "Useful forms" jumps to the templates in this page's Resource library.
function QuickLinks({ onForms }) {
  const { t } = useTranslation()

  const rows = [
    { id: 'complaint', icon: IdCard, href: OFFICIAL_SITES.cybercrime },
    { id: 'track', icon: MessageSquareText, href: OFFICIAL_SITES.cybercrime },
    { id: 'police', icon: Landmark, to: '/app/ask-sachi', state: { description: t('app.resources.quick.policeAsk') } },
    { id: 'forms', icon: FileText, onClick: onForms },
  ]

  return (
    <section className="res-quick" aria-labelledby="res-quick-title">
      <h2 id="res-quick-title">{t('app.resources.quick.title')}</h2>
      <ul>
        {rows.map(({ id, icon: Icon, href, to, state, onClick }) => {
          const label = t(`app.resources.quick.${id}`)
          const inner = (
            <>
              <Icon className="res-quick__icon" aria-hidden="true" strokeWidth={1.6} />
              <span>{label}</span>
              <ArrowRight className="res-quick__arrow" aria-hidden="true" strokeWidth={1.8} />
            </>
          )
          return (
            <li key={id}>
              {href && (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {inner}
                  <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
                </a>
              )}
              {to && <Link to={to} state={state}>{inner}</Link>}
              {onClick && <button type="button" onClick={onClick}>{inner}</button>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default QuickLinks
