// Sample advocates for the website's finder. None of these are real people, and the fees are made up.
// Real listings and fees will come from the backend once advocate approval exists.
// `look` only drives the drawn placeholder portrait; real photos replace it later.
export const advocateAreas = ['family', 'civil', 'criminal', 'consumer', 'property', 'labour', 'cyber', 'constitutional']

export const BUDGET_MIN = 300
export const BUDGET_MAX = 2500
export const BUDGET_STEP = 100

export const directoryAdvocates = [
  { id: 1, areas: ['family', 'civil'], fee: 500, languages: ['en', 'hi'], modes: ['video', 'phone'], look: { skin: '#e0b08a', hair: '#1c1613', style: 'bun', suit: '#23232b', shirt: '#ffffff', female: true } },
  { id: 2, areas: ['criminal', 'consumer'], fee: 800, languages: ['en', 'hi'], modes: ['video'], look: { skin: '#c68e66', hair: '#15110f', style: 'short', suit: '#1d1d22', shirt: '#ffffff', glasses: true, beard: true } },
  { id: 3, areas: ['property', 'labour'], fee: 1200, languages: ['en', 'mr'], modes: ['video', 'phone'], look: { skin: '#d9a47c', hair: '#1c1613', style: 'long', suit: '#2c2c36', shirt: '#f4efe6', glasses: true, female: true } },
  { id: 4, areas: ['cyber', 'constitutional'], fee: 1500, languages: ['en', 'hi'], modes: ['phone'], look: { skin: '#a9714b', hair: '#0f0d0c', style: 'short', suit: '#26323f', shirt: '#ffffff' } },
  { id: 5, areas: ['family', 'criminal'], fee: 600, languages: ['hi'], modes: ['phone'], look: { skin: '#e8bd98', hair: '#3a2a20', style: 'bob', suit: '#352a33', shirt: '#ffffff', female: true } },
  { id: 6, areas: ['civil', 'property'], fee: 2000, languages: ['en'], modes: ['video'], look: { skin: '#b9825a', hair: '#8b8b8b', style: 'short', suit: '#20242b', shirt: '#e9eef5', glasses: true, beard: true } },
  { id: 7, areas: ['consumer', 'cyber'], fee: 400, languages: ['en', 'hi'], modes: ['video', 'phone'], look: { skin: '#d29b72', hair: '#1a1411', style: 'long', suit: '#1f2a24', shirt: '#ffffff', female: true } },
  { id: 8, areas: ['labour', 'constitutional'], fee: 2500, languages: ['en', 'ta'], modes: ['video'], look: { skin: '#8d5a3b', hair: '#0e0c0b', style: 'short', suit: '#2a2a33', shirt: '#ffffff', glasses: true } },
]

export const formatFee = (amount) => `₹${amount.toLocaleString('en-IN')}`

// Advocates within the budget (and area, if one is chosen), cheapest first.
export function findAdvocates(advocates, { budget, area }) {
  return advocates
    .filter((advocate) => advocate.fee <= budget && (area === 'all' || advocate.areas.includes(area)))
    .sort((a, b) => a.fee - b.fee)
}
