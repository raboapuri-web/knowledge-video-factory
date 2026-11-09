/// <reference types="@motion-canvas/core/project" />

// Motion Canvas' Vite plugin transforms scene modules imported with ?scene.
// This declaration makes the same virtual module visible to TypeScript.
declare module '*?scene' {
  const scene: import('@motion-canvas/core').FullSceneDescription;
  export default scene;
}
