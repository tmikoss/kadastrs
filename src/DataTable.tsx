import 'leaflet/dist/leaflet.css'

import { filter, map } from 'lodash'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import bbox from 'geojson-bbox'
import { useContext } from 'react'
import { AppContext } from './Context'

export const DataTable = () => {
  const { selectedParcels, parcels } = useContext(AppContext)

  const matching = filter(parcels.features as unknown as Feature[], (feature: Feature) => {
    return selectedParcels[feature.properties.CODE]
  })

  const rows: GridRowsProp = map(matching, (feature) => {
    const [e, s, w, n] = bbox(feature)
    return { id: feature.properties.CODE, e, s, w, n }
  })

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Kadastra nr', width: 150 },
    { field: 'e', headerName: 'Austrumi maks', width: 150 },
    { field: 'w', headerName: 'Rietumi maks', width: 150 },
    { field: 'n', headerName: 'Ziemeļi maks', width: 150 },
    { field: 's', headerName: 'Dienvidi maks', width: 150 }
  ]

  return <DataGrid autoHeight rows={rows} columns={columns} logLevel='warn' />
}
