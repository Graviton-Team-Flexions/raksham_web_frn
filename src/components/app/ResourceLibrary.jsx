import { useTranslation } from 'react-i18next'
import ResourceRow from './ResourceRow.jsx'
import { libraryFilters, libraryItems } from '../../data/resourceHub.js'
import { libraryAction, libraryTone } from '../../utils/resourceActions.js'

const ResourceLibrary = ({ filter, onFilterChange, sectionRef }) => {
  const { t } = useTranslation()
  const items = libraryItems.filter((item) => filter === 'all' || item.kind === filter)

  return (
    <section className="res-library" aria-labelledby="res-library-title" ref={sectionRef}>
      <div className="res-section-head">
        <h2 id="res-library-title">{t('app.resources.library.title')}</h2>
        <div className="res-pills" role="group" aria-label={t('app.resources.library.filtersLabel')}>
          {libraryFilters.map((id) => (
            <button
              key={id}
              type="button"
              className={`res-pill${filter === id ? ' is-active' : ''}`}
              aria-pressed={filter === id}
              onClick={() => onFilterChange(id)}
            >
              {t(`app.resources.library.filters.${id}`)}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="res-empty">{t('app.resources.library.empty')}</p>
      ) : (
        <ul className="res-rows">
          {items.map((item) => (
            <ResourceRow
              key={item.id}
              tone={libraryTone(item)}
              title={t(`app.resources.items.${item.id}.title`)}
              description={t(`app.resources.items.${item.id}.description`)}
              action={libraryAction(item)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ResourceLibrary
