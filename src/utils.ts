export function shouldUpdate(changes: unknown[], oldChanges: unknown[]): boolean {
  if (changes.length !== oldChanges.length) {
    return true
  }
  for (let i = 0; i < changes.length; i++) {
    if (oldChanges[i] !== changes[i]) {
      return true
    }
  }
  return false
}