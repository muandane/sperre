/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module '*?raw' {
  const content: string;
  export default content;
} 

declare namespace App {
    interface Locals {
        user: import("better-auth").User | null;
        session: import("better-auth").Session | null;
    }
}