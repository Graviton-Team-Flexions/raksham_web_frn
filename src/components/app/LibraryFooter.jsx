import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

// `disclaimer` is the left-hand line; pages with their own wording pass it in.
function LibraryFooter({ disclaimer }) {
  const { t } = useTranslation()
  return (
    <footer className="dash-footer dash-footer--rule">
      <p>{disclaimer ?? t('app.footer.disclaimer')}</p>
      {/* Opens the existing feedback form on the public site. */}
      <p>
        {t('app.library.spotOutdated')}
        <Link to="/#footer-feedback">
          {t('app.library.reportIt')}
          <ArrowRight aria-hidden="true" strokeWidth={2} />
        </Link>
      </p>
    </footer>
  )
}

export default LibraryFooter
