import { Dispatch, SetStateAction, createContext } from 'react'
import type { FeatureCollection } from 'geojson'

export const AppContext = createContext<{
  selectedParcels: SelectedMap
  setSelectedParcels: Dispatch<SetStateAction<SelectedMap>>
  selectedGroups: SelectedMap
  setSelectedGroups: Dispatch<SetStateAction<SelectedMap>>
  parcels: FeatureCollection
}>({
  selectedParcels: {},
  setSelectedParcels: () => {},
  selectedGroups: {},
  setSelectedGroups: () => {},
  parcels: { type: 'FeatureCollection', features: [] }
})
