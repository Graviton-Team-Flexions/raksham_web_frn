import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { BookArt } from './ResourceArt.jsx'
import { featuredGuide } from '../../data/resourceHub.js'

function FeaturedBanner() {
  const { t } = useTranslation()
  const id = featuredGuide.id
  return (
    <section className="res-banner" aria-labelledby="res-featured-title">
      <span className="res-banner__art">
        <BookArt />
      </span>
      <div className="res-banner__text">
        <h2 id="res-featured-title">{t(`app.resources.items.${id}.title`)}</h2>
        <p>{t(`app.resources.items.${id}.description`)}</p>
      </div>
      <Link className="res-banner__cta" to={`/app/resources/articles/${id}`}>
        {t('app.resources.featuredCta')}
        <ArrowRight aria-hidden="true" strokeWidth={2} />
      </Link>
    </section>
  )
}

export default FeaturedBanner
