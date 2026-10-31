// Content map of the Resources page. Titles and descriptions live in the locale files under
// `app.resources.items.<id>`; article text and document text are in resourceArticles.js and
// resourceDocuments.js (English only for now).
//
// Every outside link below is an official site named in the project specification (section 22).
// No deep links were verified, so each opens the site's home page. Replace with reviewed deep links
// when they exist. Do not add a link that has not been checked.
export const OFFICIAL_SITES = {
  indiaGov: 'https://www.india.gov.in/',
  erss112: 'https://112.gov.in/',
  cybercrime: 'https://cybercrime.gov.in/',
  wcd: 'https://wcd.gov.in/',
  nalsa: 'https://nalsa.gov.in/',
  indiaCode: 'https://www.indiacode.nic.in/',
}

// Tab order. Which items each tab shows is decided by the `categories` list on every item below.
export const resourceCategories = ['all', 'articles', 'helplines', 'portals', 'guides', 'safety']

// `art` picks the illustration on the card (see ResourceArt). Replace with photos by adding an `image` field.
export const articles = [
  { id: 'digital-arrest-scams', minutes: 5, art: 'scam', categories: ['articles', 'safety'] },
  { id: 'rights-police-enquiry', minutes: 4, art: 'gavel', categories: ['articles', 'guides'] },
  { id: 'report-cybercrime', minutes: 6, art: 'laptop', categories: ['articles', 'guides', 'safety'] },
]

export const featuredGuide = { id: 'cybercrime-safety-guide', minutes: 5, categories: ['articles', 'guides', 'safety'] }

// Resource library rows. `action`: 'pdf' downloads a generated PDF, 'template' opens the template page.
export const libraryItems = [
  { id: 'cybercrime-complaint-checklist', kind: 'checklists', action: 'pdf', categories: ['guides', 'safety'] },
  { id: 'basic-legal-rights', kind: 'guides', action: 'pdf', categories: ['guides'] },
  { id: 'sample-complaint-format', kind: 'templates', action: 'template', categories: ['guides'] },
]

export const libraryFilters = ['all', 'guides', 'checklists', 'templates']

export const popularResources = [
  { id: 'it-act', href: OFFICIAL_SITES.indiaCode, categories: ['guides'] },
  { id: 'bns', href: OFFICIAL_SITES.indiaCode, categories: ['guides'] },
  { id: 'womens-safety', href: OFFICIAL_SITES.wcd, categories: ['safety'] },
]

export const governmentPortals = [
  { id: 'india-gov', href: OFFICIAL_SITES.indiaGov, categories: ['portals'] },
  { id: 'erss-112', href: OFFICIAL_SITES.erss112, categories: ['portals'] },
  { id: 'cybercrime-portal', href: OFFICIAL_SITES.cybercrime, categories: ['portals', 'safety'] },
  { id: 'wcd', href: OFFICIAL_SITES.wcd, categories: ['portals', 'safety'] },
  { id: 'nalsa', href: OFFICIAL_SITES.nalsa, categories: ['portals'] },
  { id: 'india-code', href: OFFICIAL_SITES.indiaCode, categories: ['portals', 'guides'] },
]
