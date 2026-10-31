import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, ExternalLink, Info, LoaderCircle } from 'lucide-react'
import AppPageHeader from '../../components/app/AppPageHeader.jsx'
import LibraryFooter from '../../components/app/LibraryFooter.jsx'
import LegalSearchForm from '../../components/app/LegalSearchForm.jsx'
import IKanoonAttribution from '../../components/app/IKanoonAttribution.jsx'
import { searchLegal } from '../../services/legalService.js'
import { legalErrorKey } from '../../utils/legalErrors.js'

const PAGE_SIZE = 10 // Indian Kanoon shows ten results to a page; fewer than that means the last page

function LegalSearchPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').trim()
  const page = Math.max(0, Math.min(20, Number(params.get('page')) || 0))
  const key = `${q}|${page}`

  // The answer is stored with the search it belongs to, so a search in progress is simply "the stored
  // key is not the current key" and an old answer can never show under a new search.
  const [answer, setAnswer] = useState({ key: '' })
  const loading = q.length >= 2 && answer.key !== key

  useEffect(() => {
    if (q.length < 2) return undefined
    const controller = new AbortController()
    searchLegal({ q, page, signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setAnswer({ key, result })
    })
    return () => controller.abort()
  }, [q, page, key])

  const result = answer.key === key ? answer.result : null
  const go = (nextQ, nextPage = 0) => setParams({ q: nextQ, ...(nextPage ? { page: String(nextPage) } : {}) })

  return (
    <main className="dash lib-page res-page">
      <AppPageHeader title={t('app.legal.title')} subtitle={t('app.legal.sub')} />
      <Link className="detail-back" to="/app/resources">
        <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
        {t('app.resources.article.back')}
      </Link>

      <LegalSearchForm key={q} initialValue={q} onSearch={(text) => go(text)} />

      <div className="legal-attribution">
        <IKanoonAttribution />
      </div>
      <p className="res-notice" role="note">
        <Info aria-hidden="true" strokeWidth={1.6} />
        <span>{t('app.legal.notice')}</span>
      </p>

      <section aria-live="polite" aria-busy={loading}>
        {q.length < 2 && <p className="res-empty">{t('app.legal.idle')}</p>}
        {loading && (
          <p className="legal-status">
            <LoaderCircle className="auth-spinner" aria-hidden="true" strokeWidth={2} />
            {t('app.legal.searching')}
          </p>
        )}
        {result && !result.ok && (
          <p className="legal-status legal-status--error" role="alert">{t(`app.legal.errors.${legalErrorKey(result.reason)}`)}</p>
        )}
        {result?.ok && (
          <>
            <h2 className="res-list__count">
              {t('app.legal.resultsFor', { q })}
              {result.total && <span> · {result.total}</span>}
            </h2>
            {result.results.length === 0 ? (
              <p className="res-empty">{t('app.legal.empty')}</p>
            ) : (
              <ul className="legal-results">
                {result.results.map((item) => (
                  <li key={item.id}>
                    <Link className="legal-results__title" to={`/app/resources/legal/${item.id}`} state={{ title: item.title, source: item.source }}>
                      {item.title}
                    </Link>
                    <p className="legal-results__meta">
                      {[item.source, item.date].filter(Boolean).join(' · ')}
                    </p>
                    {item.snippet && <p className="legal-results__snippet" lang="en">{item.snippet}</p>}
                    <a className="legal-results__ext" href={item.url} target="_blank" rel="noopener noreferrer">
                      {t('app.legal.openOnSite')}
                      <ExternalLink aria-hidden="true" strokeWidth={1.8} />
                      <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {(page > 0 || result.results.length >= PAGE_SIZE) && (
              <nav className="legal-pager" aria-label={t('app.legal.pages')}>
                <button type="button" className="adv-btn" disabled={page === 0} onClick={() => go(q, page - 1)}>
                  <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
                  {t('app.legal.previous')}
                </button>
                <span>{t('app.legal.page', { n: page + 1 })}</span>
                <button type="button" className="adv-btn" disabled={result.results.length < PAGE_SIZE || page >= 20} onClick={() => go(q, page + 1)}>
                  {t('app.legal.next')}
                  <ArrowRight aria-hidden="true" strokeWidth={1.8} />
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      <LibraryFooter disclaimer={t('app.resources.footer')} />
    </main>
  )
}

export default LegalSearchPage
