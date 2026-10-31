import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

// One resource as a horizontal row: icon, title and description on the left, one action on the right.
// `action`: { kind: 'pdf' | 'route' | 'external' | 'tel', label (key under app.resources.actions),
//             icon?, onClick? (pdf), to? (route), href? (external), number? (tel) }
// `tone` colours the icon: 'pdf' red, 'template' blue, anything else neutral.
function ResourceRow({ icon: Icon = FileText, tone = 'neutral', title, description, action }) {
  const { t } = useTranslation()
  const ActionIcon = action.icon
  const content = (
    <>
      {t(`app.resources.actions.${action.label}`)}
      {ActionIcon && <ActionIcon aria-hidden="true" strokeWidth={1.8} />}
    </>
  )

  let control
  if (action.kind === 'pdf') {
    control = (
      <button type="button" className="res-row__action" onClick={action.onClick}>
        {content}
        <span className="sr-only">: {title}</span>
      </button>
    )
  } else if (action.kind === 'external') {
    control = (
      <a className="res-row__action" href={action.href} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="sr-only">: {title} ({t('app.resources.actions.newTab')})</span>
      </a>
    )
  } else if (action.kind === 'tel') {
    control = (
      <a className="res-row__action" href={`tel:${action.number}`}>
        {content}
        <span className="sr-only">: {title}</span>
      </a>
    )
  } else {
    control = (
      <Link className="res-row__action" to={action.to} state={action.state}>
        {content}
        <span className="sr-only">: {title}</span>
      </Link>
    )
  }

  return (
    <li className="res-row">
      <span className={`res-row__icon res-row__icon--${tone}`} aria-hidden="true">
        <Icon strokeWidth={1.6} />
      </span>
      <div className="res-row__text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {control}
    </li>
  )
}

export default ResourceRow
