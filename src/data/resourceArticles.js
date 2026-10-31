import { OFFICIAL_SITES } from './resourceHub.js'

// SAMPLE ARTICLE TEXT, English only. This is general safety information written for the demo and has
// NOT been reviewed by a legal expert. It avoids section numbers, deadlines and legal claims on
// purpose. Numbers come from the helpline list in the project specification (candidates to verify).
//
// Section shape: { heading, paragraphs?: string[], list?: string[], steps?: string[], links?: [{ label, href }] }
const cybercrimeSite = { label: 'National Cyber Crime Reporting Portal (official)', href: OFFICIAL_SITES.cybercrime }

export const articleBodies = {
  'cybercrime-safety-guide': {
    intro: 'Online scams usually work by making you afraid or rushed. Slowing down is the best protection.',
    sections: [
      {
        heading: 'Common red flags',
        list: [
          'An unexpected call or message saying it is from the police, a bank, a courier or a government office.',
          'Pressure to act right now, or to keep the matter secret.',
          'A request to move money to "verify" or "protect" it.',
          'Links or apps you did not ask for, especially screen-sharing or remote-access apps.',
          'Threats of arrest, fines or a blocked account.',
        ],
      },
      {
        heading: 'If you think it is a scam',
        steps: [
          'Stop replying. Do not click links or install anything.',
          'Never share OTPs, PINs, passwords or card details.',
          'Do not send money.',
          'If you already sent money, call 1930 straight away and tell your bank.',
          'Report it on the official portal.',
        ],
        links: [cybercrimeSite],
      },
      {
        heading: 'Keep evidence',
        paragraphs: [
          'Take screenshots of messages, profiles and payment screens. Note phone numbers, links, usernames, transaction IDs, dates and times. Do not delete the originals.',
        ],
      },
      {
        heading: 'Protect yourself',
        list: [
          'Use a different strong password for each important account.',
          'Turn on two-step verification.',
          'Keep your phone and apps updated.',
          'Check privacy settings on social media.',
          'If something feels wrong, talk to someone you trust before acting.',
        ],
      },
    ],
  },

  'digital-arrest-scams': {
    intro: 'In this scam, a caller pretends to be an official and tries to frighten you into paying. Knowing the pattern makes it easier to stay calm.',
    sections: [
      {
        heading: 'What it looks like',
        paragraphs: [
          'The caller says they are from the police, customs, a courier company or an investigation agency. They claim you are linked to a crime, and may tell you to stay on a video call while they pressure you to pay or share details.',
        ],
      },
      {
        heading: 'Red flags',
        list: [
          'You are told not to hang up or not to tell anyone.',
          'You are asked to pay money or move your savings to "clear" your name.',
          'The caller sends official-looking documents or uses a uniform on video.',
          'You are asked for ID numbers, OTPs or to install an app.',
        ],
      },
      {
        heading: 'What to do right away',
        steps: [
          'End the call. You are allowed to hang up.',
          'Do not pay and do not share OTPs or ID details.',
          'Check for yourself: contact the agency using a number from its official website, not one the caller gave you.',
          'Tell a family member or friend what happened.',
          'If you already paid, call 1930 immediately and tell your bank.',
        ],
        links: [cybercrimeSite],
      },
      {
        heading: 'If you feel in danger',
        paragraphs: ['If you feel threatened or unsafe, call 112.'],
      },
    ],
  },

  'rights-police-enquiry': {
    intro: 'This is a general guide for staying calm and informed. Every situation is different, so speak to a qualified advocate about your own case.',
    sections: [
      {
        heading: 'Stay calm and ask',
        list: [
          'Be polite and stay calm.',
          'Ask the officers for their name and rank, and note them down.',
          'Ask what the enquiry is about.',
          'Ask clearly whether you are free to leave.',
        ],
      },
      {
        heading: 'Get support',
        list: [
          'You can ask to contact a family member, a friend or a lawyer.',
          'If you cannot afford a lawyer, free legal aid may be available. The national legal services authority runs a helpline (15100).',
        ],
        links: [{ label: 'National Legal Services Authority (official)', href: OFFICIAL_SITES.nalsa }],
      },
      {
        heading: 'Paperwork',
        list: [
          'Read anything before you sign it.',
          'If you do not understand it, say so and ask for it to be explained.',
          'Ask for a copy of any document you sign.',
        ],
      },
      {
        heading: 'Keep a record',
        paragraphs: [
          'As soon as you can, write down the date, time, place, who was present and what was said. This can help an advocate advise you.',
        ],
      },
      {
        heading: 'If you feel unsafe',
        paragraphs: ['Call 112.'],
      },
    ],
  },

  'report-cybercrime': {
    intro: 'A short walk-through of how to report online fraud or harassment. Act quickly if money was lost.',
    sections: [
      {
        heading: 'Step by step',
        steps: [
          'Stop engaging with the other person and do not delete anything.',
          'Collect the details. The Cybercrime Complaint Checklist in the Resource library lists what to keep.',
          'If money was lost, call 1930 immediately and tell your bank.',
          'Report online at the official National Cyber Crime Reporting Portal.',
          'Write down any complaint or reference number you receive, and keep screenshots of the confirmation.',
          'You can also approach your local police station, or ask an advocate for help.',
        ],
        links: [cybercrimeSite],
      },
      {
        heading: 'What to keep ready',
        list: [
          'Your contact details.',
          'A short, dated description of what happened.',
          'Phone numbers, emails, usernames, profile or website links of the other party.',
          'Payment details: amount, date, time, transaction ID, bank or UPI app.',
          'Screenshots and other evidence.',
        ],
      },
      {
        heading: 'If you feel in danger',
        paragraphs: ['Call 112 first. Safety comes before the paperwork.'],
      },
    ],
  },
}
