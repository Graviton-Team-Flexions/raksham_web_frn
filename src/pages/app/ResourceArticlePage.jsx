import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ExternalLink, Info } from 'lucide-react'
import AppPageHeader from '../../components/app/AppPageHeader.jsx'
import LibraryFooter from '../../components/app/LibraryFooter.jsx'
import { articleBodies } from '../../data/resourceArticles.js'
import { articles, featuredGuide } from '../../data/resourceHub.js'

const knownArticles = [featuredGuide, ...articles]

function ResourceArticlePage() {
  const { t, i18n } = useTranslation()
  const { articleId } = useParams()
  const meta = knownArticles.find((article) => article.id === articleId)
  const body = articleBodies[articleId]

  if (!meta || !body) {
    return (
      <main className="dash lib-page res-page">
        <AppPageHeader title={t('app.resources.title')} />
        <section className="lib-empty">
          <h2>{t('app.resources.article.missingTitle')}</h2>
          <p>{t('app.resources.article.missingBody')}</p>
          <Link className="dash-continue__cta" to="/app/resources">{t('app.resources.article.back')}</Link>
        </section>
        <LibraryFooter disclaimer={t('app.resources.footer')} />
      </main>
    )
  }

  return (
    <main className="dash lib-page res-page">
      <AppPageHeader
        title={t(`app.resources.items.${meta.id}.title`)}
        subtitle={t('app.resources.latest.minutes', { count: meta.minutes })}
      />
      <Link className="detail-back" to="/app/resources">
        <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
        {t('app.resources.article.back')}
      </Link>

      <p className="res-notice" role="note">
        <Info aria-hidden="true" strokeWidth={1.6} />
        <span>
          {t('app.resources.article.notice')}
          {i18n.language?.startsWith('hi') && ` ${t('app.resources.article.englishOnly')}`}
        </span>
      </p>

      <article className="res-article-page" lang="en">
        <p className="res-article-page__intro">{body.intro}</p>
        {body.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
            {section.list && (
              <ul>
                {section.list.map((text) => <li key={text}>{text}</li>)}
              </ul>
            )}
            {section.steps && (
              <ol>
                {section.steps.map((text) => <li key={text}>{text}</li>)}
              </ol>
            )}
            {section.links?.map((link) => (
              <a key={link.href} className="res-article-page__link" href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ExternalLink aria-hidden="true" strokeWidth={1.8} />
                <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
              </a>
            ))}
          </section>
        ))}
      </article>

      <LibraryFooter disclaimer={t('app.resources.footer')} />
    </main>
  )
}

export default ResourceArticlePage
