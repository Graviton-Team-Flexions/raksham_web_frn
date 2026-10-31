// SAMPLE DOCUMENT TEXT, English only, used to generate the downloadable PDFs and the template page.
// General information written for the demo; it has NOT been reviewed by a legal expert and does not
// claim to match any particular police or portal form.
//
// Section shape: { heading, lines: string[] }  (a line starting with "[ ]" is printed as a tick box)
export const documents = {
  'cybercrime-complaint-checklist': {
    title: 'Cybercrime Complaint Checklist',
    subtitle: 'A list of details to keep ready before you report online fraud or harassment.',
    sections: [
      {
        heading: 'About you',
        lines: ['[ ] Your full name', '[ ] Phone number and email address you can be reached on', '[ ] Your address'],
      },
      {
        heading: 'What happened',
        lines: [
          '[ ] Date and time it started',
          '[ ] A short, plain description in your own words',
          '[ ] How the other person contacted you (call, message, email, social media, website)',
        ],
      },
      {
        heading: 'Details of the other person or website',
        lines: [
          '[ ] Phone numbers',
          '[ ] Email addresses',
          '[ ] Usernames and profile links',
          '[ ] Website or app names and links',
        ],
      },
      {
        heading: 'If money was lost',
        lines: [
          '[ ] Amount',
          '[ ] Date and time of each payment',
          '[ ] Transaction ID or reference number',
          '[ ] Your bank, card or UPI app used',
          '[ ] The account number or UPI ID the money went to',
        ],
      },
      {
        heading: 'Evidence to keep (do not delete the originals)',
        lines: [
          '[ ] Screenshots of messages, profiles and payment screens',
          '[ ] Call history showing the numbers',
          '[ ] Emails, saved in full',
          '[ ] Any documents or photos the other person sent',
        ],
      },
      {
        heading: 'Actions already taken',
        lines: [
          '[ ] Told my bank',
          '[ ] Called 1930 (national cyber crime helpline)',
          '[ ] Reported on cybercrime.gov.in',
          '[ ] Blocked the contact, after saving the evidence',
        ],
      },
      {
        heading: 'Keep safe',
        lines: [
          'Store copies somewhere only you can open.',
          'Write down any complaint or reference number you receive.',
          'If you feel in danger, call 112.',
        ],
      },
    ],
  },

  'basic-legal-rights': {
    title: 'Know Your Basic Legal Rights',
    subtitle: 'A short, general guide. It is not legal advice.',
    sections: [
      {
        heading: 'Asking questions',
        lines: [
          'You can ask officials who they are and what they need from you.',
          'If you are asked to come to a police station or office, ask whether you are free to leave.',
        ],
      },
      {
        heading: 'Getting help',
        lines: [
          'You can ask to speak to a family member, a friend or a lawyer.',
          'If you cannot afford a lawyer, free legal aid may be available. The national legal services authority has a helpline (15100).',
        ],
      },
      {
        heading: 'Paperwork',
        lines: [
          'Read anything before you sign it, and ask for a copy.',
          'Keep your own record of dates, places and names.',
        ],
      },
      {
        heading: 'Reporting a problem',
        lines: [
          'Online fraud: call 1930 and report at cybercrime.gov.in.',
          'Women\'s helpline: 181.',
          'Child helpline: 1098.',
        ],
      },
      {
        heading: 'In an emergency',
        lines: ['Call 112.', 'Rules and your options depend on your situation. Speak to a qualified advocate about your own case.'],
      },
    ],
  },

  'sample-complaint-format': {
    title: 'Sample Complaint Format',
    subtitle: 'A simple layout you can adapt for a cybercrime or fraud complaint.',
    note: 'This is a sample layout only. Change it to fit your situation. Raksham has not checked it against the requirements of any police station or portal.',
    sections: [
      { heading: 'To', lines: ['The Officer-in-Charge / Concerned Authority', '[Name of police station, cyber cell or portal]', '[Address, if known]'] },
      { heading: 'From', lines: ['[Your full name]', '[Your address]', '[Your phone number and email]'] },
      { heading: 'Date', lines: ['[Date of writing]'] },
      { heading: 'Subject', lines: ['Complaint regarding online fraud / cybercrime'] },
      {
        heading: 'What happened',
        lines: [
          'I am writing to report the following incident.',
          'On [date] at about [time], I was contacted by [phone number / email / profile name] through [call / message / website / app].',
          '[Describe in your own words what the person said or did, and what you did in response.]',
        ],
      },
      {
        heading: 'Details of the other party (if known)',
        lines: ['[Phone numbers, emails, usernames, profile or website links]'],
      },
      {
        heading: 'Loss, if any',
        lines: [
          'Amount: [amount]',
          'Date and time of payment: [date, time]',
          'Transaction ID: [reference number]',
          'Payment method and account/UPI ID paid to: [details]',
        ],
      },
      { heading: 'Evidence attached', lines: ['[List screenshots, messages, receipts, call history and any other documents]'] },
      {
        heading: 'Request',
        lines: ['I request that this complaint be registered and the matter investigated. I can provide any further information needed.'],
      },
      { heading: 'Declaration', lines: ['The information above is true to the best of my knowledge.', '', '[Signature]', '[Name]'] },
    ],
  },
}

// Plain-text version, for the "copy text" button on the template page.
export function documentToText({ title, subtitle, note, sections }) {
  const parts = [title]
  if (subtitle) parts.push(subtitle)
  if (note) parts.push(`Note: ${note}`)
  for (const section of sections) parts.push('', section.heading.toUpperCase(), ...section.lines)
  return parts.join('\n')
}
