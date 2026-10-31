import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { ArticleArt } from './ResourceArt.jsx'
import { articles } from '../../data/resourceHub.js'

function ArticleCard({ article }) {
  const { t } = useTranslation()
  const title = t(`app.resources.items.${article.id}.title`)
  return (
    <li>
      <Link className="res-article" to={`/app/resources/articles/${article.id}`}>
        <span className="res-article__image">
          <ArticleArt name={article.art} />
          <span className="res-article__time">{t('app.resources.latest.minutes', { count: article.minutes })}</span>
        </span>
        <span className="res-article__body">
          <h3>{title}</h3>
          <p>{t(`app.resources.items.${article.id}.description`)}</p>
        </span>
      </Link>
    </li>
  )
}

// The three newest articles. "View all articles" switches the page to the Articles category.
function LatestArticles({ onViewAll }) {
  const { t } = useTranslation()
  return (
    <section className="res-articles" aria-labelledby="res-articles-title">
      <div className="res-section-head">
        <h2 id="res-articles-title">{t('app.resources.latest.title')}</h2>
        <button type="button" className="res-link" onClick={onViewAll}>
          {t('app.resources.latest.all')}
          <ArrowRight aria-hidden="true" strokeWidth={2} />
        </button>
      </div>
      <ul className="res-articles__grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ul>
    </section>
  )
}

export default LatestArticles
