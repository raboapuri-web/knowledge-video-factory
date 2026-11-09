/// <reference types="@motion-canvas/core/project" />

// The Motion Canvas Vite plugin transforms every module imported with ?scene.
// The ambient declaration mirrors that virtual module boundary for tsc.
declare module '*?scene' {
  const scene: any;
  export default scene;
}
