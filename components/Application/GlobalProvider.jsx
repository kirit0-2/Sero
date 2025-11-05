'use client'
import React from 'react'
import { store, persistor } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'

const GlobalProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<Loading/>} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}

export default GlobalProvider