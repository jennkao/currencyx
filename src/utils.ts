export function capitalize(name: string) {
  if (name.length === 0) {
    return name;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function pluralize(thing: string) {
  return `${thing}s`;
}
