import Bonk from "./Bonk";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col justify-items-between align-items-center w-[100%] scale-125">
      <h1 className="text-7xl font-bold mb-5 text-center font-orbitron tracking-widest text-white">
        Bonk v2
      </h1>
      <Bonk
        samples={[
          //Base Samples
          {
            samp_url: "presets/base/base_ophat.wav",

            samp_name: "OH",
          },

          {
            samp_url: "presets/base/base_clhat.wav",

            samp_name: "CH",
          },
          {
            samp_url: "presets/base/base_kick.wav",

            samp_name: "KD",
          },

          {
            samp_url: "presets/base/base_snr.wav",

            samp_name: "SD",
          },
          {
            samp_url: "presets/base/base_clap.wav",

            samp_name: "CL",
          },

          //Acoustic Samples
          {
            samp_url: "presets/acoustic/acoustic_ophat.wav",

            samp_name: "OH1",
          },

          {
            samp_url: "presets/acoustic/acoustic_clhat.wav",

            samp_name: "CH1",
          },
          {
            samp_url: "presets/acoustic/acoustic_kick.wav",

            samp_name: "KD1",
          },

          {
            samp_url: "presets/acoustic/acoustic_snr.wav",

            samp_name: "SD1",
          },
          {
            samp_url: "presets/acoustic/acoustic_clap.wav",

            samp_name: "CL1",
          },

          //Distort Samples

          {
            samp_url: "presets/distort/distort_ophat.wav",

            samp_name: "OH2",
          },

          {
            samp_url: "presets/distort/distort_clhat.wav",

            samp_name: "CH2",
          },
          {
            samp_url: "presets/distort/distort_kick.wav",

            samp_name: "KD2",
          },

          {
            samp_url: "presets/distort/distort_snr.wav",

            samp_name: "SD2",
          },
          {
            samp_url: "presets/distort/distort_clap.wav",

            samp_name: "CL2",
          },

          //Distort Samples

          {
            samp_url: "presets/distort/distort_ophat.wav",

            samp_name: "OH3",
          },

          {
            samp_url: "presets/distort/distort_clhat.wav",

            samp_name: "CH3",
          },
          {
            samp_url: "presets/distort/distort_kick.wav",

            samp_name: "KD3",
          },

          {
            samp_url: "presets/distort/distort_snr.wav",

            samp_name: "SD3",
          },
          {
            samp_url: "presets/distort/distort_clap.wav",

            samp_name: "CL3",
          },


          //Distort Samples

          {
            samp_url: "presets/distort/distort_ophat.wav",

            samp_name: "OH4",
          },

          {
            samp_url: "presets/distort/distort_clhat.wav",

            samp_name: "CH4",
          },
          {
            samp_url: "presets/distort/distort_kick.wav",

            samp_name: "KD4",
          },

          {
            samp_url: "presets/distort/distort_snr.wav",

            samp_name: "SD4",
          },
          {
            samp_url: "presets/distort/distort_clap.wav",

            samp_name: "CL4",
          },


          //Distort Samples

          {
            samp_url: "presets/distort/distort_ophat.wav",

            samp_name: "OH5",
          },

          {
            samp_url: "presets/distort/distort_clhat.wav",

            samp_name: "CH5",
          },
          {
            samp_url: "presets/distort/distort_kick.wav",

            samp_name: "KD5",
          },

          {
            samp_url: "presets/distort/distort_snr.wav",

            samp_name: "SD5",
          },
          {
            samp_url: "presets/distort/distort_clap.wav",

            samp_name: "CL5",
          },



        ]}
      />
    </div>
  );
}

export default App;
