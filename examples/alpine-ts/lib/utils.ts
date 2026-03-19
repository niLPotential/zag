export function joinCamelCase(strs: string[]) {
  return strs
    .map((str, i) => (i === 0 ? str : (str.at(0)?.toUpperCase() ?? "") + str.substring(1).toLowerCase()))
    .join("")
}
