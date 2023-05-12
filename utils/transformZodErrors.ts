import { ZodError } from 'zod'

export default function transformZodErrors<T extends string>({
  issues,
}: ZodError): Record<T, string> {
  const fieldErrors: Record<string, string> = {}
  issues.forEach((error) => {
    fieldErrors[error.path[0]] = error.message
  })
  return fieldErrors
}
