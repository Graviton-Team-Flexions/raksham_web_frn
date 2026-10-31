import { Download, ExternalLink } from 'lucide-react'
import { helplines } from '../data/helplines.js'
import { documents } from '../data/resourceDocuments.js'
import { articles, featuredGuide, governmentPortals, libraryItems, popularResources } from '../data/resourceHub.js'
import { downloadPdf } from './pdf.js'

// What a Resource library item does when its button is pressed: download a generated PDF,
// or open the template page. See ResourceRow for the action shape.
export function libraryAction(item) {
  if (item.action === 'template') {
    return { kind: 'route', label: 'openTemplate', icon: ExternalLink, to: `/app/resources/templates/${item.id}` }
  }
  return { kind: 'pdf', label: 'downloadPdf', icon: Download, onClick: () => downloadPdf(`${item.id}.pdf`, documents[item.id]) }
}

export const libraryTone = (item) => (item.action === 'template' ? 'template' : 'pdf')

const externalAction = (href) => ({ kind: 'external', label: 'openSite', icon: ExternalLink, href })

// Every resource that belongs to one category tab, as rows for the list view. (The "All resources"
// tab uses the designed page layout instead.)
export function resourceEntries(category, t) {
  const text = (id) => ({ title: t(`app.resources.items.${id}.title`), description: t(`app.resources.items.${id}.description`) })
  const entries = []
  const add = (list, build) =>
    list.filter((item) => item.categories.includes(category)).forEach((item) => entries.push({ key: item.id, tone: 'neutral', ...build(item) }))

  add([featuredGuide, ...articles], (a) => ({
    ...text(a.id),
    action: { kind: 'route', label: 'read', to: `/app/resources/articles/${a.id}` },
  }))
  add(libraryItems, (item) => ({ ...text(item.id), tone: libraryTone(item), action: libraryAction(item) }))
  add(popularResources, (item) => ({ ...text(item.id), action: externalAction(item.href) }))
  add(governmentPortals, (item) => ({ ...text(item.id), action: externalAction(item.href) }))

  if (category === 'helplines' || category === 'safety') {
    helplines.forEach((number) =>
      entries.push({
        key: `tel-${number}`,
        tone: 'neutral',
        title: `${number} · ${t(`helplines.items.${number}.name`)}`,
        description: t(`helplines.items.${number}.description`),
        action: { kind: 'tel', label: 'call', number },
      }),
    )
  }
  return entries
}
