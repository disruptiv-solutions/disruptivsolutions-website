// Observed form spam uses long, unbroken ASCII names with random internal
// capital runs. Keep normal capitalization, spaces and non-ASCII names valid.
export function isAutomatedName(value: string): boolean {
  const name = value.trim();
  return /^[A-Za-z]{15,}$/.test(name)
    && (name.match(/[A-Z]/g)?.length || 0) >= 4
    && (name.match(/[a-z]/g)?.length || 0) >= 3
    && /[a-z][A-Z]{2,}/.test(name);
}
