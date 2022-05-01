export type Env = {
  port: number
}

const getEnvironmentVariableNumber = (
  envVarName: string,
  defaultValue?: number,
  notProvidedMessage?: string,
  invalidMessage?: string,
): number => {
  const _notProvidedMessage = notProvidedMessage != null ? ` ${notProvidedMessage}` : ''
  const _invalidMessage = invalidMessage != null ? ` ${invalidMessage}` : ''

  const envVar = process.env[envVarName]
  if (envVar == null && defaultValue == null) {
    console.warn(`Environment variable ${envVarName} is not defined.${_notProvidedMessage}.`)
    return null
  }
  if (envVar == null) {
    console.warn(`Environment variable ${envVarName} is not defined. Using default ${defaultValue}.${_notProvidedMessage}.`)
    return defaultValue
  }
  const parsedEnvVar = parseInt(envVar)
  if (Number.isNaN(parsedEnvVar) && defaultValue == null) {
    console.warn(`Environment variable ${envVarName} is not valid (${envVar}).${_invalidMessage}.`)
    return null
  }
  if (Number.isNaN(parsedEnvVar)) {
    console.warn(`Environment variable ${envVarName} is not valid (${envVar}). Using default ${defaultValue}.${_invalidMessage}.`)
    return defaultValue
  }
  return parsedEnvVar
}

export const env: Env = {
  port: getEnvironmentVariableNumber('SERVER_PORT', 8080),
}
