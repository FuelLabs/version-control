/// <reference types="vite/client" />

// Add script module importing (ECMAScript)
declare module '*?script&module' {
  const src: string;
  export default src;
}

// Add script  importing (CommonJS)
declare module '*?script' {
  const src: string;
  export default src;
}
