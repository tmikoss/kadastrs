import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet'
import { LeafletEventHandlerFnMap, StyleFunction } from 'leaflet'
import { useContext } from 'react'
import { get, omit } from 'lodash'
import { AppContext } from './Context'

export const ATTRIBUTION = 'https://data.gov.lv/dati/lv/dataset/kadastra-informacijas-sistemas-atverti-telpiskie-dati'

export const ParcelMap = () => {
  const { selectedParcels, setSelectedParcels, parcels } = useContext(AppContext)

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: ({ propagatedFrom }) => {
      const {
        feature: {
          properties: { CODE }
        }
      } = propagatedFrom as { feature: Feature }

      setSelectedParcels((was) => {
        const wasSelected = !!was[CODE]
        return wasSelected ? omit(was, CODE) : { ...was, [CODE]: true }
      })
    }
  }

  const style: StyleFunction<Feature> = (feature) => {
    const code: string = get(feature, ['properties', 'CODE'])

    const highlighted = !!selectedParcels[code]

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

  return (
    <MapContainer center={[56.945, 25.379]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <GeoJSON
        key={parcels.features.length}
        attribution={ATTRIBUTION}
        data={parcels}
        eventHandlers={eventHandlers}
        style={style}
      />
    </MapContainer>
  )
}
