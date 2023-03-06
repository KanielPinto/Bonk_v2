import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App samples={[
      {
       
        samp_url: "/base_set/base_clap.wav",
        
        samp_name: "CL",
      },
      {
       
        samp_url: "/base_set/base_clhat.wav",
        
        samp_name: "CH",
      },
      {
       
        samp_url: "/base_set/base_kick.wav",
        
        samp_name: "KD",
      },
      {
       
        samp_url: "/base_set/base_ophat.wav",
        
        samp_name: "OH",
      },
      {
       
        samp_url: "/base_set/base_snr.wav",
        
        samp_name: "SD",
      },
      {
       
        samp_url: "/set2/set2_clap.wav",
        
        samp_name: "CL2",
      },
      {
       
        samp_url: "/set2/set2_clhat.wav",
        
        samp_name: "CH2",
      },
      {
       
        samp_url: "/set2/set2_kick.wav",
        
        samp_name: "KD2",
      },
      {
       
        samp_url: "/set2/set2_ophat.wav",
        
        samp_name: "OH2",
      },
      {
       
        samp_url: "/set2/set2_snr.wav",
        
        samp_name: "SD2",
      },
    ]} noOfSteps={16} />
  </React.StrictMode>,
)
