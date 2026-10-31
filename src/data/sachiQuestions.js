// Question configuration for the Ask Sachi flow. Text and option labels live in the locale
// files under `app.chat.questions.<id>`. Only two things are asked up front: a safety check and
// what happened. Anything else (when, evidence, location) Sachi asks for herself, one short
// question at a time, only when the answer would change her advice.
//   type 'choice': the user picks one of `options` (or types a free answer)
//   type 'text'  : the user types a free answer
export const sachiQuestions = [
  { id: 'danger', type: 'choice', options: ['yes', 'no', 'unsure'] },
  { id: 'what', type: 'text' },
]
