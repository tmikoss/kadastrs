import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import Shape4296003 from './kadastrs/4296003.json'
import { LeafletEventHandlerFnMap, StyleFunction } from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { filter, get, map, reduce } from 'lodash'
import { Tab, Tabs, styled } from '@mui/material'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import bbox from 'geojson-bbox'

const ATTRIBUTION = 'https://data.gov.lv/dati/lv/dataset/kadastra-informacijas-sistemas-atverti-telpiskie-dati'
const STORAGE_KEY = 'slected-features'

const geoJSON = {
  type: 'FeatureCollection',
  features: [...Shape4296003.features]
} as const

type Feature = (typeof geoJSON)['features'][number]
type SelectedMap = Record<string, boolean>

let persisted: SelectedMap = {}
try {
  persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
} catch (error) {
  // noop
}

const Container = styled('div')`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
`

const Map = ({
  selected,
  setSelected
}: {
  selected: SelectedMap
  setSelected: Dispatch<SetStateAction<SelectedMap>>
}) => {
  const eventHandlers: LeafletEventHandlerFnMap = {
    click: ({ propagatedFrom }) => {
      const {
        feature: {
          properties: { CODE }
        }
      } = propagatedFrom as { feature: Feature }

      setSelected((was) => {
        return { ...was, [CODE]: !was[CODE] }
      })
    }
  }

  const style: StyleFunction<Feature> = (feature) => {
    const code: string = get(feature, ['properties', 'CODE'])

    const highlighted = !!selected[code]

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
      <GeoJSON attribution={ATTRIBUTION} data={geoJSON} eventHandlers={eventHandlers} style={style} />
    </MapContainer>
  )
}

const Corners = ({ selected }: { selected: SelectedMap }) => {
  const matching = filter(geoJSON.features, (feature: Feature) => {
    return selected[feature.properties.CODE]
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

  return (
    <div style={{ height: '500px' }}>
      <DataGrid autoHeight rows={rows} columns={columns} logLevel='warn' />
    </div>
  )
}

function App() {
  const [selected, setSelected] = useState<Record<string, boolean>>(persisted)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const onlySelected = reduce(
      selected,
      (acc, value, key) => {
        if (value) {
          acc[key] = value
        }
        return acc
      },
      {} as SelectedMap
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(onlySelected))
  }, [selected])

  return (
    <Container>
      <Tabs value={tab} onChange={(_e, newTab) => setTab(newTab)}>
        <Tab label='Karte' />
        <Tab label='Stūri' />
      </Tabs>

      <div>
        {tab === 0 ? <Map selected={selected} setSelected={setSelected} /> : null}
        {tab === 1 ? <Corners selected={selected} /> : null}
      </div>
    </Container>
  )
}

export default App
