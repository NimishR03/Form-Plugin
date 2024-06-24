export function converttoCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove non-alphanumeric characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, ""); // Remove spaces
}

export function convertToUpperSnakeCase(str: string): string {
  return str
    .toUpperCase() // Convert the string to uppercase
    .replace(/\s+/g, "_"); // Replace all spaces with underscores
}
export function convertToAllCaps(text: string): string {
  if (text !== undefined) {
    return text.toUpperCase().replace(/\s+/g, "");
  }
  return "";
}
