import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App samples={[
      {
       
        samp_url: "/base_set/base_clap",
        
        samp_name: "CL",
      },
      {
       
        samp_url: "/base_set/base_clhat",
        
        samp_name: "CH",
      },
      {
       
        samp_url: "/base_set/base_kick",
        
        samp_name: "KD",
      },
      {
       
        samp_url: "/base_set/base_ophat",
        
        samp_name: "OH",
      },
      {
       
        samp_url: "/base_set/base_snr",
        
        samp_name: "SD",
      },
    ]} noOfSteps={16} />
  </React.StrictMode>,
)
