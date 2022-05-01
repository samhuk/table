export const pushToArrayOfPropertyName = <T extends any>(dict: { [k: string]: T[] }, key: string, item: T) => {
  if (dict[key] == null)
    // eslint-disable-next-line no-param-reassign
    dict[key] = []

  dict[key].push(item)
}
