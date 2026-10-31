import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import LegalSearchForm from '../../components/app/LegalSearchForm.jsx'
import AppPageHeader from '../../components/app/AppPageHeader.jsx'
import LibraryFooter from '../../components/app/LibraryFooter.jsx'
import ResourceTabs from '../../components/app/ResourceTabs.jsx'
import FeaturedBanner from '../../components/app/FeaturedBanner.jsx'
import QuickLinks from '../../components/app/QuickLinks.jsx'
import LatestArticles from '../../components/app/LatestArticles.jsx'
import ResourceLibrary from '../../components/app/ResourceLibrary.jsx'
import PopularResources from '../../components/app/PopularResources.jsx'
import ResourceRow from '../../components/app/ResourceRow.jsx'
import { resourceEntries } from '../../utils/resourceActions.js'

function ResourcesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [libraryFilter, setLibraryFilter] = useState('all')
  const libraryRef = useRef(null)

  const entries = useMemo(() => (category === 'all' ? [] : resourceEntries(category, t)), [category, t])

  // "Download useful forms": show the templates in the library and bring them into view.
  const showForms = () => {
    setCategory('all')
    setLibraryFilter('templates')
    requestAnimationFrame(() => libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <main className="dash lib-page res-page">
      <AppPageHeader title={t('app.resources.title')} subtitle={t('app.resources.sub')} />
      <LegalSearchForm id="legal-search-hub" onSearch={(text) => navigate(`/app/resources/search?q=${encodeURIComponent(text)}`)} />
      <ResourceTabs active={category} onChange={setCategory} />

      {category === 'all' ? (
        <div className="res-layout">
          <div className="res-col">
            <FeaturedBanner />
            <LatestArticles onViewAll={() => setCategory('articles')} />
            <ResourceLibrary filter={libraryFilter} onFilterChange={setLibraryFilter} sectionRef={libraryRef} />
          </div>
          <div className="res-col">
            <QuickLinks onForms={showForms} />
            <PopularResources />
          </div>
        </div>
      ) : (
        <section className="res-list" aria-live="polite">
          <h2 className="res-list__count">{t('app.resources.list.count', { count: entries.length })}</h2>
          {entries.length === 0 ? (
            <p className="res-empty">{t('app.resources.list.empty')}</p>
          ) : (
            <ul className="res-rows">
              {entries.map(({ key, ...entry }) => (
                <ResourceRow key={key} icon={FileText} {...entry} />
              ))}
            </ul>
          )}
        </section>
      )}

      <LibraryFooter disclaimer={t('app.resources.footer')} />
    </main>
  )
}

export default ResourcesPage
