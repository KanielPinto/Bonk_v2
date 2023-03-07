import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Bonk.module.scss";
import * as Tone from "tone";
import useForceUpdate from "use-force-update";

const note = "C1";

declare global {
  var presetFactor: number;
}

type Props = {
  samples: { samp_url: string; samp_name: string }[];
  noOfSteps?: number;
  // presetFactor: number;
};

type Tracks = {
  id: number;
  sampler: Tone.Sampler;
};

export default function Bonk({ samples, noOfSteps = 16 }: Props) {
  var presetFact = globalThis.presetFactor;
  presetFact = 0;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const trackId = [...Array(samples.length/3).keys()] as const;
  const stepId = [...Array(noOfSteps).keys()] as const;

  const trackRef = React.useRef<Tracks[]>([]);
  const stepRef = React.useRef<HTMLInputElement[][]>([[]]);
  const sequenceRef = React.useRef<Tone.Sequence | null>(null);
  const ledRef = React.useRef<HTMLInputElement[]>([]);
  const presetRef = React.useRef<HTMLSelectElement>();

  const playClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const stopClick = async () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const bpmSet = (val: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(val.target.value);
  };

  const volSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const presetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == "base") {
      presetFact = 0;
      console.log("base selected");
    }
    if (e.target.value == "set2") {
      presetFact = 5;
    }

    if (e.target.value == "trap") {
      presetFact = 10;
    }

    trackRef.current = samples.map((sample, i) => ({
      id: i - presetFact,
      sampler: new Tone.Sampler({
        urls: {
          [note]: sample.samp_url,
        },
      }).toDestination(),
    }));


  };

  //   console.log(window.presetFactor.toString());

  React.useEffect(() => {
    console.log(presetFact);
    trackRef.current = samples.map((sample, i) => ({
      id: i - presetFact,
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
        // console.log(step);
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
        <button className={styles.playButton} onClick={stopClick}>
          STOP
        </button>
        <div className={styles.controlCol}>
          <label htmlFor="bpmSlide">
            {"BPM" + "  :  " + Tone.Transport.bpm.value.toFixed(0)}
          </label>
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
          <select
            className={styles.dropbox}
            name="presetSel"
            required
            id="presetSel"
            defaultValue={"base"}
            onChange={presetChange}
          >
            <option value="base">Base</option>
            <option value="set2">Set 2</option>
            <option value="trap">Trap</option>
          </select>
        </div>

        <div className={styles.controlCol}>
          <label htmlFor="volSlide">Volume</label>
          <br />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            onChange={volSet}
            className={styles.slider}
            name="volSlide"
            id="volSlide"
          />
        </div>
      </div>
    </div>
  );
}
