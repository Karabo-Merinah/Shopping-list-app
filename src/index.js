import React from 'react'
import { createRoot } from 'react-dom/client'
import './src/index.css'
import App from './App'
import {store} from '../src/app/store'
import { Provider } from 'react-redux'

const container=document.getElementById('root')

if(container){
    const root=createRoot(container)

    root.render(
        <Provider store={store}>
            <App/>
        </Provider>
    )
}

