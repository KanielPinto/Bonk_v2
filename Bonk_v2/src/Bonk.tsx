import React, { useEffect, useState } from "react";
import styles from "./Bonk.module.scss";
import * as Tone from "tone";

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
  const trackId = [...Array(samples.length / 6).keys()] as const;
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
    document.getElementById("bpmDisp")!.innerHTML =
      "BPM  :   " + Tone.Transport.bpm.value.toFixed(0).toString();
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

    if (e.target.value == "distort") {
      presetFact = 10;
    }
    

    if (e.target.value == "smooth") {
      presetFact = 15;
    }

    if (e.target.value == "oldschool") {
      presetFact = 20;
    }


    if (e.target.value == "dance") {
      presetFact = 25;
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

  React.useEffect(()=>{
    document.addEventListener('keydown', detectKeyDown, true);
  }, [])

  const detectKeyDown = (e: { key: any; }) => {
    console.log(e.key);
    if(e.key==="Enter"){
      playClick();
    }
    if(e.key==="s"){
      stopClick();
    }
  }

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
    <div className={`${styles.container}`}>
      <div className="flex flex-row">
        <div className={`mr-4 mt-6 ${styles.sampLabels}`}>
          {samples.slice(0, 5).map((sample) => (
            <div>{sample.samp_name}</div>
          ))}
        </div>
        <div>
        <div className={styles.grid}>
          <div className={`pb-1 ${styles.row}`}>
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
        
        <div>
          <div className={styles.row}>
            {/* <div className={styles.sampLabels}>
              {samples.slice(0, 5).map((sample) => (
                <div>{sample.samp_name}</div>
              ))}
            </div> */}

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
                          className={`peer ${styles.cellInput}`}
                          ref={(element) => {
                            if (!element) return;
                            if (!stepRef.current[trackId]) {
                              stepRef.current[trackId] = [];
                            }
                            stepRef.current[trackId][stepId] = element;
                          }}
                        />
                        <div
                          className={`${
                            trackId == 0
                              ? "shadow-cyan-400 shadow-3xl bg-cyan-200/50 peer-checked:bg-cyan-400"
                              : trackId == 1
                              ? "shadow-fuchsia-400 shadow-3xl bg-fuchsia peer-checked:bg-fuchsia-400"
                              : trackId == 2
                              ? "shadow-orange-500 shadow-3xl bg-orange-200 peer-checked:bg-orange-400"
                              : trackId == 3
                              ? "shadow-yellow-500 shadow-3xl bg-yellow-200 peer-checked:bg-yellow-400"
                              : "shadow-lime-500 shadow-3xl bg-lime-200 peer-checked:bg-lime-400"
                          } peer-checked:opacity-100 opacity-25 ${
                            styles.cellContent
                          }`}
                        ></div>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*Control Panel*/}
      <div className={`w-50 flex flex-row space-x-10 mt-4 cp-font`}>
        <button className={styles.playButton} onClick={playClick}>
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon-blue w-10 h-10 inline"
            >
              <path
                fill-rule="evenodd"
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon-green w-10 h-10 inline"
            >
              <path
                fill-rule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className={styles.controlCol}>
          <label htmlFor="bpmSlide" className="bpmDisp" id="bpmDisp">
            {"BPM" + "  :  " + Tone.Transport.bpm.value.toFixed(0)}
          </label>
          <br />
          <input
            type="range"
            min={40}
            max={280}
            step={1}
            onChange={bpmSet}
            defaultValue={120}

            className={`accent-amber-500 icon-amber h-[2px] ${styles.slider}`}
            name="bpmSlide"
            id="bpmSlide"
          />
        </div>

        <div className={`rounded-lg ${styles.controlCol}`}>
          <label htmlFor="presetSel">Preset</label> <br />
          <select
            name="presetSel"
            required
            id="presetSel"
            defaultValue={"base"}
            onChange={presetChange}
            className="bg-transparent pr-1 rounded-md mt-1 text-center pr-3"
          >
            <option value="base" className="bg-black text-start">
              Base
            </option>
            <option value="acoustic" className="bg-black text-start">Acoustic</option>
            <option value="distort" className="bg-black text-start">Distort</option>
            <option value="smooth" className="bg-black text-start">Smooth</option>
            <option value="oldschool" className="bg-black text-start">Old School</option>
            <option value="dance" className="bg-black text-start">Dance</option>

          </select>
        </div>

        <div className={styles.controlCol}>
          <label htmlFor="volSlide">Volume</label>
          <br />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={volSet}
            defaultValue={1}
            className={`accent-purple-500 icon-purple h-[2px] ${styles.slider}`}
            name="volSlide"
            id="volSlide"
          />
        </div>

        <button className={`${styles.playButton}`} onClick={stopClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon-red w-10 h-10 inline"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
        </div>
      </div>
      
    </div>
  );
}
