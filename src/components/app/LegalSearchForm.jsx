import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

// A search box for court judgments and laws. `onSearch` receives the trimmed text; short or empty
// searches are ignored. Used on the Resources page and on the search results page.
function LegalSearchForm({ initialValue = '', onSearch, id = 'legal-search' }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(initialValue)

  const submit = (event) => {
    event.preventDefault()
    const text = value.trim()
    if (text.length >= 2) onSearch(text)
  }

  return (
    <form className="res-search" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor={id}>{t('app.legal.label')}</label>
      <div className="res-search__field">
        <Search aria-hidden="true" strokeWidth={1.75} />
        <input
          id={id}
          type="search"
          value={value}
          maxLength={200}
          placeholder={t('app.legal.placeholder')}
          autoComplete="off"
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <button type="submit" className="res-search__button" disabled={value.trim().length < 2}>
        {t('app.legal.submit')}
      </button>
    </form>
  )
}

export default LegalSearchForm
