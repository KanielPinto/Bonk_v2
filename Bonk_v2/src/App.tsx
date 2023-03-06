import React from "react";
import styles from "./App.module.scss";
import * as Tone from "tone";

type Props = {
  samples: { samp_url: string; samp_name: string }[];
  noOfSteps?: number;
};

export default function App({ samples, noOfSteps }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const trackId = [...Array(samples.length).keys()] as const;
  const stepId = [...Array(noOfSteps).keys()] as const;

  return (
    <div className={styles.container}>
      <div className={styles.header}>Bonk v2</div>
      <div className={styles.grid}>
        <div className={styles.cellStrip}>
          {trackId.map((trackId) => (
            <div key={trackId} className={styles.row}>
              {stepId.map((stepID) => {
                const id = trackId + "-" + stepID;
                return (
                  <label key={id} className={styles.cell}>
                    <input
                      type="checkbox"
                      id={id}
                      className={styles.cellInput}
                    />
                    <div className={styles.cellContent}></div>
                  </label>
                );
                //13.12 timestamp
              })}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controlPanel}>
        <button className={styles.playButton}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <div className={styles.controlCol}>
          <label htmlFor="bpmSlide">BPM</label> <br />
          <input type="range" className={styles.slider} name="bpmSlide" id="bpmSlide"/>
        </div>
        <div className={styles.controlCol}>
          <label htmlFor="presetSel">PRESET</label> <br />
          <select className={styles.dropbox} name="presetSel" id="presetSel">
            <option value="base">Base</option>
            <option value="trap">Trap</option>
          </select>
        </div>
      </div>
    </div>
  );
}
