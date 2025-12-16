export function validateTaskData(data) {
  const errors = []
  const requiredFields = ['title', 'description']

  requiredFields.forEach(field => {
    const fieldEntry = Object.entries(data).find(([key]) => key === field)

    if (!fieldEntry || !fieldEntry[1] || fieldEntry[1].trim() === '') {
      errors.push(`${field} is required and must be a non-empty string`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}