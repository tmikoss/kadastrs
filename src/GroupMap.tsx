import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet'
import { LeafletEventHandlerFnMap, StyleFunction } from 'leaflet'
import { useContext, useEffect, useState } from 'react'
import { get, keys, omit } from 'lodash'
import { AppContext } from './Context'
import { ATTRIBUTION } from './ParcelMap'
import type { FeatureCollection } from 'geojson'

export const GroupMap = () => {
  const { selectedGroups, setSelectedGroups } = useContext(AppContext)
  const [data, setData] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] })

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: ({ propagatedFrom }) => {
      const {
        feature: {
          properties: { CODE }
        }
      } = propagatedFrom as { feature: Feature }

      setSelectedGroups((was) => {
        const wasSelected = !!was[CODE]
        return wasSelected ? omit(was, CODE) : { ...was, [CODE]: true }
      })
    }
  }

  const style: StyleFunction<Feature> = (feature) => {
    const code: string = get(feature, ['properties', 'CODE'])

    const highlighted = !!selectedGroups[code]

    if (highlighted) {
      return {
        color: 'red',
        opacity: 1
      }
    } else {
      return {
        color: 'gray',
        opacity: 0.4
      }
    }
  }

  useEffect(() => {
    fetch('/kadastrs/kadastrs/groups/0026000.geojson')
      .then((response) => response.json())
      .then((json) => setData(json))
  }, [])

  return (
    <MapContainer center={[56.945, 25.379]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <GeoJSON
        key={keys(data).join('-')}
        attribution={ATTRIBUTION}
        data={data}
        eventHandlers={eventHandlers}
        style={style}
      />
    </MapContainer>
  )
}
