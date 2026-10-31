import { useTranslation } from 'react-i18next'
import { BookOpen, FileText, LayoutGrid, Landmark, Phone, ShieldCheck } from 'lucide-react'
import { resourceCategories } from '../../data/resourceHub.js'

const ICONS = {
  all: LayoutGrid,
  articles: FileText,
  helplines: Phone,
  portals: Landmark,
  guides: BookOpen,
  safety: ShieldCheck,
}

// The category buttons under the page header. The chosen one is black.
function ResourceTabs({ active, onChange }) {
  const { t } = useTranslation()
  return (
    <nav className="res-tabs" aria-label={t('app.resources.tabsLabel')}>
      {resourceCategories.map((id) => {
        const Icon = ICONS[id]
        return (
          <button
            key={id}
            type="button"
            className={`res-tab${active === id ? ' is-active' : ''}`}
            aria-pressed={active === id}
            onClick={() => onChange(id)}
          >
            <Icon aria-hidden="true" strokeWidth={1.7} />
            {t(`app.resources.tabs.${id}`)}
          </button>
        )
      })}
    </nav>
  )
}

export default ResourceTabs
