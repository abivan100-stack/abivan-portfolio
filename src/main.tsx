import './index.css'
import App from './App.tsx'
import { readSavedView } from './lib/hero-view'
import { mountPage } from './lib/mount'

mountPage(<App initialView={readSavedView()} />)
