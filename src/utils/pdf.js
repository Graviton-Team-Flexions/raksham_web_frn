// A minimal PDF writer for the plain-text documents on the Resources page (no library needed).
// It handles English text in the built-in Helvetica font; characters outside basic Latin become "?".
const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 56
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const AVG_CHAR = 0.52 // average Helvetica character width as a fraction of the font size (a safe estimate)

const plain = (text) =>
  String(text)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/•/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E]/g, '?')

const escapeText = (text) => text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

function wrap(text, size) {
  const limit = Math.floor(CONTENT_WIDTH / (size * AVG_CHAR))
  const lines = []
  let line = ''
  for (const word of plain(text).split(/\s+/).filter(Boolean)) {
    if (line && `${line} ${word}`.length > limit) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

// Turns { title, subtitle?, note?, sections: [{ heading, lines }] } into the bytes of a PDF file.
export function buildPdf({ title, subtitle, note, sections }) {
  // 1. Lay the text out as positioned lines, starting a new page when one is full.
  const pages = [[]]
  let y = PAGE_HEIGHT - MARGIN
  const place = (text, { size = 11, bold = false, gap = 0, indent = 0 } = {}) => {
    const lineHeight = size * 1.45
    y -= gap
    if (y - lineHeight < MARGIN) {
      pages.push([])
      y = PAGE_HEIGHT - MARGIN
    }
    y -= lineHeight
    pages.at(-1).push({ text, size, bold, x: MARGIN + indent, y })
  }
  const paragraph = (text, options) => wrap(text, options?.size ?? 11).forEach((line, i) => place(line, { ...options, gap: i === 0 ? options?.gap : 0 }))

  paragraph(title, { size: 20, bold: true })
  if (subtitle) paragraph(subtitle, { size: 11, gap: 4 })
  if (note) paragraph(`Note: ${note}`, { size: 10, gap: 6 })
  for (const section of sections) {
    paragraph(section.heading, { size: 13, bold: true, gap: 14 })
    section.lines.forEach((line) => {
      const box = line.startsWith('[ ]')
      const text = box ? `[   ] ${line.slice(3).trim()}` : line
      wrap(text, 11).forEach((part, i) => place(part, { size: 11, gap: i === 0 ? 3 : 0, indent: i === 0 || !box ? 0 : 22 }))
    })
  }
  const footer = 'General information only. Not legal advice. Prepared by Raksham.'
  pages.forEach((page, index) => {
    page.push({ text: `${footer}  Page ${index + 1} of ${pages.length}`, size: 8, bold: false, x: MARGIN, y: 28 })
  })

  // 2. Write the PDF objects: catalog, page tree, two fonts, then a page and its content for each page.
  const objects = []
  const pageIds = pages.map((_, i) => 5 + i * 2)
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  pages.forEach((page, i) => {
    const stream = page
      .map(({ text, size, bold, x, y: top }) => `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${Math.round(top * 100) / 100} Td (${escapeText(text)}) Tj ET`)
      .join('\n')
    objects[pageIds[i]] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageIds[i] + 1} 0 R >>`
    objects[pageIds[i] + 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  })

  // 3. Assemble the file with the byte-offset table PDF readers need. The text is plain ASCII, so
  // character counts equal byte counts.
  let file = '%PDF-1.4\n'
  const offsets = []
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = file.length
    file += `${id} 0 obj\n${objects[id]}\nendobj\n`
  }
  const xrefAt = file.length
  file += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let id = 1; id < objects.length; id++) file += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  file += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`

  return new TextEncoder().encode(file)
}

// Saves a generated document to the person's device.
export function downloadPdf(filename, doc) {
  const url = URL.createObjectURL(new Blob([buildPdf(doc)], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Release the file's temporary address after the browser has had time to start the download;
  // revoking it at once can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
