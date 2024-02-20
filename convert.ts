import { glob } from 'glob'
import { dirname } from 'node:path'
import { read } from 'shapefile'
// @ts-ignore
import reproject from 'reproject'
// @ts-ignore
import epsg from 'epsg'
import { writeFile, mkdir } from 'node:fs/promises'

const convertShp = async (input: string, output: string) => {
  const geojsonInLKS92 = await read(input)

  const geojsonInWGS84 = reproject.toWgs84(geojsonInLKS92, epsg['EPSG:3059'], epsg)

  return writeFile(output, JSON.stringify(geojsonInWGS84))
}

await mkdir('public/kadastrs/parcels', { recursive: true })

for (const file of await glob('data/**/KKParcel.shp')) {
  const id = dirname(file).split('_').pop()

  await convertShp(file, `public/kadastrs/parcels/${id}.geojson`)
}

await mkdir('public/kadastrs/groups', { recursive: true })

for (const file of await glob('data/**/KKCadastralGroup.shp')) {
  const id = dirname(file).split('_').pop()

  await convertShp(file, `public/kadastrs/groups/${id}.geojson`)
}
