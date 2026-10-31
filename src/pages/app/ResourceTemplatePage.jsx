import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Copy, Download, Info } from 'lucide-react'
import AppPageHeader from '../../components/app/AppPageHeader.jsx'
import LibraryFooter from '../../components/app/LibraryFooter.jsx'
import { documents, documentToText } from '../../data/resourceDocuments.js'
import { downloadPdf } from '../../utils/pdf.js'

// Shows one document's text so it can be read, copied or saved as a PDF.
function ResourceTemplatePage() {
  const { t, i18n } = useTranslation()
  const { templateId } = useParams()
  const doc = documents[templateId]
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied' | 'failed'
  const textRef = useRef(null)

  if (!doc) {
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

  const text = documentToText(doc)
  // Uses the clipboard API; if the browser refuses, selects the text and uses the older copy command.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
      return
    } catch {
      // fall through to the older method
    }
    try {
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      setCopyState(document.execCommand('copy') ? 'copied' : 'failed')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <main className="dash lib-page res-page">
      <AppPageHeader title={t(`app.resources.items.${templateId}.title`)} subtitle={t(`app.resources.items.${templateId}.description`)} />
      <Link className="detail-back" to="/app/resources">
        <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
        {t('app.resources.article.back')}
      </Link>

      <p className="res-notice" role="note">
        <Info aria-hidden="true" strokeWidth={1.6} />
        <span>
          {doc.note ?? t('app.resources.template.notice')}
          {i18n.language?.startsWith('hi') && ` ${t('app.resources.article.englishOnly')}`}
        </span>
      </p>

      <section className="detail-card">
        <pre ref={textRef} className="res-template" lang="en" tabIndex={0}>{text}</pre>
        <div className="modal__actions">
          <button type="button" className="adv-btn" onClick={copy}>
            {copyState === 'copied' ? <Check aria-hidden="true" strokeWidth={2.25} /> : <Copy aria-hidden="true" strokeWidth={1.75} />}
            {copyState === 'copied' ? t('app.resources.template.copied') : t('app.resources.template.copy')}
          </button>
          <button type="button" className="adv-btn adv-btn--solid" onClick={() => downloadPdf(`${templateId}.pdf`, doc)}>
            <Download aria-hidden="true" strokeWidth={1.75} />
            {t('app.resources.template.download')}
          </button>
        </div>
        {copyState === 'failed' && <p className="detail-card__note" role="alert">{t('app.resources.template.copyFailed')}</p>}
      </section>

      <LibraryFooter disclaimer={t('app.resources.footer')} />
    </main>
  )
}

export default ResourceTemplatePage
