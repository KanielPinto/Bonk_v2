import React from "react";
import styles from "./App.module.scss";
import * as Tone from "tone";

const note = "C1";

type Props = {
  samples: { samp_url: string; samp_name: string }[];
  noOfSteps?: number;
};

type Tracks = {
  id: number;
  sampler: Tone.Sampler;
};

export default function App({ samples, noOfSteps }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const trackId = [...Array((samples.length/2)).keys()] as const;
  const stepId = [...Array(noOfSteps).keys()] as const;

  const trackRef = React.useRef<Tracks[]>([]);
  const stepRef = React.useRef<HTMLInputElement[][]>([[]]);
  const sequenceRef = React.useRef<Tone.Sequence | null>(null);
  const ledRef = React.useRef<HTMLInputElement[]>([]);

  const playClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const bpmSet = (val: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(val.target.value);
  };

  
  const presetChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    if(e.target.value == "set2"){
    }
  };

  React.useEffect(() => {
    trackRef.current = samples.map((sample, i) => ({
      id: i, //figure out how to change this value
      sampler: new Tone.Sampler({
        urls: {
          [note]: sample.samp_url,
        },
      }).toDestination(),
    }));

    sequenceRef.current = new Tone.Sequence(
      (time, step) => {
        trackRef.current.forEach((track) => {
          if (stepRef.current[track.id]?.[step]?.checked) {
            track.sampler.triggerAttack(note, time);
          }
          ledRef.current[step].checked = true;
        });
        console.log(step);
      },
      [...stepId],
      "16n"
    ).start(0);

    return () => {
      sequenceRef.current?.dispose();
      trackRef.current.forEach((track) => track.sampler.dispose());
    };
  }, [samples, noOfSteps]);



  return (
    <div className={styles.container}>
      <div className={styles.header}>Bonk v2</div>
      <div className={styles.grid}>
        <div className={styles.row}>
          {stepId.map((stepId) => (
            <label className={styles.led}>
              <input
                className={styles.ledInput}
                type="radio"
                name="led"
                id={"led" + "-" + stepId}
                disabled
                ref={(element) => {
                  if (!element) return;
                  ledRef.current[stepId] = element;
                }}
              />
              <div className={styles.ledContent}></div>
            </label>
          ))}
        </div>
        <div className={styles.cellStrip}>
          {trackId.map((trackId) => (
            <div key={trackId} className={styles.row}>
              {stepId.map((stepId) => {
                const id = trackId + "-" + stepId;
                return (
                  <label key={id} className={styles.cell}>
                    <input
                      type="checkbox"
                      id={id}
                      className={styles.cellInput}
                      ref={(element) => {
                        if (!element) return;
                        if (!stepRef.current[trackId]) {
                          stepRef.current[trackId] = [];
                        }
                        stepRef.current[trackId][stepId] = element;
                      }}
                    />
                    <div className={styles.cellContent}></div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controlPanel}>
        <button className={styles.playButton} onClick={playClick}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <div className={styles.controlCol}>
          <label htmlFor="bpmSlide">
            {"BPM" + "  :  " + Tone.Transport.bpm.value.toFixed(0)}
          </label>{" "}
          <br />
          <input
            type="range"
            min={40}
            max={280}
            step={1}
            onChange={bpmSet}
            className={styles.slider}
            name="bpmSlide"
            id="bpmSlide"
          />
        </div>
        <div className={styles.controlCol}>
          <label htmlFor="presetSel">PRESET</label> <br />
          <select className={styles.dropbox} name="presetSel" required id="presetSel" defaultValue={"base"} onChange={presetChange}>
            <option value="base">Base</option>
            <option value="set2">Set 2</option>
          </select>
        </div>
      </div>
    </div>
  );
}
