/// <reference types="node" />

export function greet(name: string) {
  return `Bonjour, ${name}! (from TypeScript)`;
}

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log(greet("Monde"));
}
