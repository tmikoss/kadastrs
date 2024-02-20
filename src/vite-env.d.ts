/// <reference types="vite/client" />

type Feature = { properties: { CODE: string } }

type SelectedMap = Record<string, boolean>

declare module 'geojson-bbox' {
  export default function (feature: Feature): [number, number, number, number]
}
