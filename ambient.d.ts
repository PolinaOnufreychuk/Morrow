// Ambient module declarations for packages that ship without their own types.
// `tailwindcss-animate` is a plain-JS Tailwind plugin with no bundled .d.ts.
declare module "tailwindcss-animate" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin: any;
  export default plugin;
}
