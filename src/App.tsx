import { useEffect, useState } from 'react'
import { flatMap, get, keys, map, uniqBy } from 'lodash'
import { Fab, Tab, Tabs, styled } from '@mui/material'
import { DataTable } from './DataTable'
import { AppContext } from './Context'
import { ParcelMap } from './ParcelMap'
import type { FeatureCollection } from 'geojson'
import { GroupMap } from './GroupMap'
import DeleteIcon from '@mui/icons-material/Delete'

const STORAGE_KEY_GROUPS = 'slected-groups'
const STORAGE_KEY_PARCELS = 'slected-parcels'

let persistedGroups: SelectedMap = {}
try {
  persistedGroups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS) || '{}')
} catch (error) {
  // noop
}

let persistedParcels: SelectedMap = {}
try {
  persistedParcels = JSON.parse(localStorage.getItem(STORAGE_KEY_PARCELS) || '{}')
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

export const App = () => {
  const [selectedParcels, setSelectedParcels] = useState<Record<string, boolean>>(persistedParcels)
  const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>(persistedGroups)
  const [tab, setTab] = useState(0)
  const [parcels, setParcels] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PARCELS, JSON.stringify(selectedParcels))
  }, [selectedParcels])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(selectedGroups))
  }, [selectedGroups])

  useEffect(() => {
    Promise.all(
      map(keys(selectedGroups), (key) => {
        return fetch(`/kadastrs/kadastrs/parcels/${key}.geojson`).then((response) => response.json())
      })
    ).then((files: FeatureCollection[]) => {
      const allFeatures = flatMap(files, ({ features }) => features)
      const uniqFeatures = uniqBy(allFeatures, (feature) => get(feature, ['properties', 'CODE']))
      setParcels({ type: 'FeatureCollection', features: uniqFeatures })
    })
  }, [selectedGroups])

  const reset = () => {
    if (confirm('Nodzēst iezīmēto, sākt no nulles?')) {
      setSelectedParcels({})
      setSelectedGroups({})
      setTab(0)
    }
  }

  return (
    <AppContext.Provider value={{ selectedGroups, setSelectedGroups, selectedParcels, setSelectedParcels, parcels }}>
      <Container>
        <Tabs value={tab} onChange={(_e, newTab) => setTab(newTab)}>
          <Tab label='Grupas' />
          <Tab label='Kadastri' />
          <Tab label='Stūri' />
        </Tabs>

        <div>
          {tab === 0 ? <GroupMap /> : null}
          {tab === 1 ? <ParcelMap /> : null}
          {tab === 2 ? <DataTable /> : null}
        </div>
        <Fab
          color='error'
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
          onClick={reset}
        >
          <DeleteIcon />
        </Fab>
      </Container>
    </AppContext.Provider>
  )
}
