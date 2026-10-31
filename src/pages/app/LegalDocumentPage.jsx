import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ExternalLink, Info, LoaderCircle } from 'lucide-react'
import AppPageHeader from '../../components/app/AppPageHeader.jsx'
import LibraryFooter from '../../components/app/LibraryFooter.jsx'
import IKanoonAttribution from '../../components/app/IKanoonAttribution.jsx'
import { getLegalDocument } from '../../services/legalService.js'
import { legalErrorKey } from '../../utils/legalErrors.js'

// One judgment or law, shown as plain text (never as HTML), with a link to read it on Indian Kanoon.
function LegalDocumentPage() {
  const { t } = useTranslation()
  const { docId } = useParams()
  const { state } = useLocation()
  const [answer, setAnswer] = useState({ id: '' })
  const loading = answer.id !== docId

  useEffect(() => {
    const controller = new AbortController()
    getLegalDocument(docId, { signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setAnswer({ id: docId, result })
    })
    return () => controller.abort()
  }, [docId])

  const result = answer.id === docId ? answer.result : null
  const doc = result?.ok ? result : null
  const title = doc?.title || state?.title || t('app.legal.untitled', { id: docId })
  const source = doc?.source || state?.source

  return (
    <main className="dash lib-page res-page">
      <AppPageHeader title={title} subtitle={source} />
      <Link className="detail-back" to="/app/resources/search" onClick={(event) => { if (window.history.length > 1) { event.preventDefault(); window.history.back() } }}>
        <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
        {t('app.legal.backToSearch')}
      </Link>

      <div className="legal-attribution">
        <IKanoonAttribution />
      </div>
      <p className="res-notice" role="note">
        <Info aria-hidden="true" strokeWidth={1.6} />
        <span>{t('app.legal.notice')}</span>
      </p>

      <section className="detail-card" aria-live="polite" aria-busy={loading}>
        {loading && (
          <p className="legal-status">
            <LoaderCircle className="auth-spinner" aria-hidden="true" strokeWidth={2} />
            {t('app.legal.opening')}
          </p>
        )}
        {result && !result.ok && (
          <p className="legal-status legal-status--error" role="alert">{t(`app.legal.errors.${legalErrorKey(result.reason)}`)}</p>
        )}
        {doc && (
          <>
            <pre className="res-template legal-text" lang="en" tabIndex={0}>{doc.text}</pre>
            {doc.truncated && <p className="detail-card__note">{t('app.legal.truncated')}</p>}
            <a className="res-article-page__link" href={doc.url} target="_blank" rel="noopener noreferrer">
              {t('app.legal.readFull')}
              <ExternalLink aria-hidden="true" strokeWidth={1.8} />
              <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
            </a>
          </>
        )}
      </section>

      <LibraryFooter disclaimer={t('app.resources.footer')} />
    </main>
  )
}

export default LegalDocumentPage
