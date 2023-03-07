import React from "react";
import styles from "./Bonk.module.scss";
import * as Tone from "tone";

const note = "C1";


presetFactor: 0;

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
  const [isPlaying, setIsPlaying] = React.useState(false);
  const trackId = [...Array(samples.length / 2).keys()] as const;
  const stepId = [...Array(noOfSteps).keys()] as const;

  const trackRef = React.useRef<Tracks[]>([]);
  const stepRef = React.useRef<HTMLInputElement[][]>([[]]);
  const sequenceRef = React.useRef<Tone.Sequence | null>(null);
  const ledRef = React.useRef<HTMLInputElement[]>([]);

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

  const stopClick =async () => {
      Tone.Transport.stop();
      setIsPlaying(false);
      window.location.reload();
  };

  const bpmSet = (val: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(val.target.value);
  };

  const volSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const presetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == "set2") {
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
                      className={`peer ${styles.cellInput}`}
                      ref={(element) => {
                        if (!element) return;
                        if (!stepRef.current[trackId]) {
                          stepRef.current[trackId] = [];
                        }
                        stepRef.current[trackId][stepId] = element;
                      }}
                    />
                    <div className={`${(trackId == 0) ? "shadow-cyan-400 shadow-3xl bg-cyan-200/50 peer-checked:bg-cyan-400":(trackId == 1) ? "shadow-fuchsia-400 shadow-3xl bg-fuchsia peer-checked:bg-fuchsia-400" : (trackId == 2) ? "shadow-orange-500 shadow-3xl bg-orange-200 peer-checked:bg-orange-400" : (trackId == 3) ? "shadow-yellow-500 shadow-3xl bg-yellow-200 peer-checked:bg-yellow-400" : "shadow-lime-500 shadow-3xl bg-lime-200 peer-checked:bg-lime-400"} peer-checked:opacity-100 opacity-25 ${styles.cellContent}`}></div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        {/* Control Panel */}

        <div className={`w-50 flex flex-row space-x-10 mt-2`}>
          <button className={styles.playButton} onClick={playClick}>
            {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-blue w-10 h-10 inline">
              <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
            </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-green w-10 h-10 inline">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
              </svg>}
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
              className={`accent-amber-500 icon-amber h-[2px] ${styles.slider}`}
              name="bpmSlide"
              id="bpmSlide"
            />
          </div>
          
          <div className={`rounded-lg ${styles.controlCol}`}>
            <label htmlFor="presetSel">Preset</label> <br />
            <select name="presetSel"
              required
              id="presetSel"
              defaultValue={"base"}
              onChange={presetChange} 
              className="bg-black border-2 rounded-md mt-1 border-white text-center"
            >
              <option value="base" className="pl-10">Base</option>
              <option value="set2">Set 2</option>
            </select>
          </div>

          <div className={styles.controlCol}>
            <label htmlFor="volSlide">
              Volume
            </label>
            <br />
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              onChange={volSet}
              className={`accent-purple-500 icon-purple h-[2px] ${styles.slider}`}
              name="volSlide"
              id="volSlide"
            />
          </div>

          <button className={`${styles.playButton}`} onClick={stopClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-red w-10 h-10 inline">
            <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
          </svg>


          </button>
        </div>
      </div>
      
    </div>
  );
}
