import vine from '@vinejs/vine'

export const forgotPasswordValidator = vine.compile(
  vine.object({
    identifier: vine.string().trim() // email ou phone
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    identifier: vine.string().trim(), // email ou phone
    otp: vine.string().minLength(6).maxLength(6),
    new_password: vine.string().minLength(8).maxLength(100)
  })
)
