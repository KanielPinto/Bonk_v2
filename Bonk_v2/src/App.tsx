import Bonk from "./Bonk";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col justify-items-between align-items-center w-[100%]">
      <h1 className="text-7xl font-bold mb-5 text-center font-orbitron tracking-widest text-white">
        Bonk v2
      </h1>

      <Bonk
        samples={[
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
        ]}
      />

    </div>
  );
}

export default App;
