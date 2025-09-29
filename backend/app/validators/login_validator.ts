import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    identifier: vine.string().trim(), // email ou phone
    password: vine.string().minLength(6)
  })
)
