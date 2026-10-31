import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// The official "powered by IKanoon" logo, required wherever Indian Kanoon data is shown
// (https://api.indiankanoon.org/terms/). Their terms say it must be shown in full, unaltered, not
// resized and not covered, so no size is set here: the image appears at its own size. A phone-sized
// version is offered by Indian Kanoon for small screens. If the image cannot load, a text credit shows.
const SITE = 'https://indiankanoon.org'
const LOGO_DESKTOP = `${SITE}/static/pics/ikanoon6_powered_transparent.png`
const LOGO_MOBILE = `${SITE}/static/pics/ikanoon_mobile_powered_transparent.png`

function IKanoonAttribution() {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  return (
    <a className="ik-attribution" href={SITE} target="_blank" rel="noopener noreferrer">
      {failed ? (
        <span>{t('app.legal.poweredBy')}</span>
      ) : (
        <picture>
          <source media="(max-width: 768px)" srcSet={LOGO_MOBILE} />
          <img src={LOGO_DESKTOP} alt={t('app.legal.poweredBy')} onError={() => setFailed(true)} />
        </picture>
      )}
      <span className="sr-only"> ({t('app.resources.actions.newTab')})</span>
    </a>
  )
}

export default IKanoonAttribution
