import vine from '@vinejs/vine'

export const createFamilyValidator = vine.compile(
  vine.object({
    planType: vine.enum(['basique', 'libota', 'libota_plus']),
    members: vine.array(
      vine.object({
        firstName: vine.string().trim().minLength(2),
        lastName: vine.string().trim().minLength(2),
        birthDate: vine.date(),
        isSick: vine.boolean(),
        photoUrl: vine.string().url(),
        photoPublicId: vine.string().optional(),
      })
    ).minLength(1).maxLength(5),
  })
)

export const getFamilyValidator = vine.compile(
  vine.object({
    code: vine.string().regex(/^LIB-\d{4}-\d{6}$/),
  })
)

