export const camelCaseToTitleCase = (s: string) => s.replace(/^[a-z]|[A-Z]/g, m => ` ${m.toUpperCase()}`).trimStart()
