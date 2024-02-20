/// <reference types="vite/client" />

declare module 'geojson-bbox' {
  export default function (feature: any): [number, number, number, number]
}
