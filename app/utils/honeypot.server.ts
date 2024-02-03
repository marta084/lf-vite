import { Honeypot, SpamError } from 'remix-utils/honeypot/server'

export const honeypot = new Honeypot({
  //if its in dev dont use
  // validFromFieldName: undefined,
  //envvariable
  encryptionSeed: 'marta',
})

export function checkHoneypot(formData: FormData) {
  try {
    honeypot.check(formData)
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response('Form not submitted properly', { status: 400 })
    }
    throw error
  }
}
