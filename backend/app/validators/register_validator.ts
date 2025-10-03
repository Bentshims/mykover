import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullname: vine.string().trim().minLength(3).maxLength(100),
    phone: vine
      .string()
      .trim()
      .regex(/^\+243[89][0-9]{8}$/)
      .unique(async (db, value) => {
        const user = await db.from('users').where('phone', value).first()
        return !user
      }),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    birth_date: vine.date({
      formats: ['YYYY-MM-DD']
    }),
    password: vine.string().minLength(6).maxLength(100)
  })
)
