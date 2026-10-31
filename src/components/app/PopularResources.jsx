import { useTranslation } from 'react-i18next'
import { ArrowRight, Bookmark, FileText } from 'lucide-react'
import { popularResources } from '../../data/resourceHub.js'

// Three official sites, shown as rows that open in a new tab (home pages of the official sites).
function PopularResources() {
  const { t } = useTranslation()
  return (
    <section className="res-popular" aria-labelledby="res-popular-title">
      <h2 id="res-popular-title">
        <Bookmark aria-hidden="true" strokeWidth={1.8} />
        {t('app.resources.popular.title')}
      </h2>
      <ul>
        {popularResources.map(({ id, href }) => (
          <li key={id}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <span className="res-popular__icon" aria-hidden="true">
                <FileText strokeWidth={1.6} />
              </span>
              <span className="res-popular__text">
                <strong>{t(`app.resources.items.${id}.title`)}</strong>
                <small>{t(`app.resources.items.${id}.description`)}</small>
              </span>
              <ArrowRight aria-hidden="true" strokeWidth={1.8} />
              <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PopularResources
