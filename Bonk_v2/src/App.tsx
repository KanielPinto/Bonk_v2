import React from 'react'
import styles from './App.module.scss'



type Props = {
  samples: { samp_url: string; samp_name: string }[];
  noOfSteps?: number;
};


export default function App({ samples, noOfSteps }: Props) {
  const trackId = [...Array(samples.length).keys()] as const;
  const stepId = [...Array(noOfSteps).keys()] as const;

  return (
    <div className={styles.container}>
      <div className={styles.header}>Bonk v2</div>
      <div className={styles.grid}>

        <div className={styles.cellStrip}>
          {trackId.map((trackId => (
            <div key={trackId} className={styles.row}>
              {stepId.map((stepID => {
                const id = trackId + '-' + stepID;
                return (<label key={id} className={styles.cell}>
                  <input type="checkbox" id={id} className={styles.cellInput} />
                  <div className={styles.cellContent}></div>


                </label>)
                //13.12 timestamp
              }))}

            </div>
          )))}
        </div>
      </div>

    </div>
  )
}
