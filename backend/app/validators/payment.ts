import vine from '@vinejs/vine'

export const initiatePaymentValidator = vine.compile(
  vine.object({
    familyId: vine.string().uuid(),
  })
)

