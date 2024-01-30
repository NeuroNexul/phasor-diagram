import React from "react";
import "./App.css";
import PhasorCanvas from "./phasor-canvas";
import Button from "./components/button";

function App() {
  const [phasors, setPhasors] = React.useState([
    {
      name: "Voltage",
      amplitude: 75,
      frequency: 3.14 / 30,
      phase: 0,
      color: "#ffffff",
    },
    {
      name: "Inductor Current",
      amplitude: 75,
      frequency: 3.14 / 30,
      phase: -3.14 / 2,
      color: "#ff00ff",
    },
    {
      name: "Capacitor Current",
      amplitude: 75,
      frequency: 3.14 / 30,
      phase: 3.14 / 2,
      color: "#00ffff",
    },
  ]);
  const [selectedPhasor, setSelectedPhasor] = React.useState(phasors[0].name);
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <main className="h-full w-full px-2 py-4 overflow-auto">
      <h1 className="text-center font-semibold text-3xl">
        Phasor Map Explorer
      </h1>
      <p className="text-center pb-4 pt-2">
        A simulator to explore the phasor map to understand the concept of
        phasors.
      </p>

      <PhasorCanvas phasors={phasors} isPaused={isPaused} />

      <div className="w-full max-w-3xl mx-auto mt-4 bg-[#020918] rounded-md">
        <div className="w-full flex items-center p-1 justify-between">
          <div className="w-full flex items-center gap-1">
            <Button onClick={() => setIsPaused(!isPaused)} title="Pause/Play">
              <span
                id="pause"
                className="transition-all duration-200 ease-in-out"
                style={{
                  opacity: isPaused ? 1 : 0,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#ffffff"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M7 4v16l13 -8z" />
                </svg>
              </span>
              <span
                id="play"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out"
                style={{
                  opacity: isPaused ? 0 : 1,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#ffffff"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              </span>
            </Button>

            <div className="w-full flex items-center gap-1 overflow-auto">
              {phasors.length >= 1 &&
                phasors.map((phasor) => (
                  <Button
                    key={phasor.name}
                    title={`Remove ${phasor.name}`}
                    onClick={() => {
                      if (phasors.length === 1) return;
                      setSelectedPhasor(phasor.name);
                    }}
                    style={{
                      backgroundColor:
                        selectedPhasor === phasor.name ? "#3e4c5966" : "",
                    }}
                  >
                    {phasor.name.toUpperCase()}
                  </Button>
                ))}
            </div>
          </div>

          <Button
            title="Add Phasor"
            onClick={() => {
              if (phasors.length >= 6) return;
              setPhasors((prev) => {
                return [
                  ...prev,
                  {
                    name: `phasor ${prev.length + 1}`,
                    amplitude: 75,
                    frequency: 3.14 / 30,
                    phase: prev[prev.length - 1].phase + 3.14 / 4,
                    // phase: 0,
                    color: "#fff",
                  },
                ];
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
        </div>

        <div className="w-full p-2 border-t border-[#3e4c59] flex flex-wrap gap-1 items-center">
          <label className="font-semibold text-[#94a3b8] mr-2">Name:</label>

          <input
            type="text"
            value={phasors.find((p) => p.name === selectedPhasor)?.name}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      name: e.target.value,
                    };
                  }
                  return p;
                });
              });
              setSelectedPhasor(e.target.value);
            }}
            className="flex-grow p-1 bg-transparent border-[#3e4c59] border rounded-md outline-none text-center text-white"
          />

          <Button
            title="Remove Phasor"
            onClick={() => {
              if (phasors.length === 1) return;
              setPhasors((prev) => {
                return prev.filter((p) => p.name !== selectedPhasor);
              });
              setSelectedPhasor(phasors[0].name);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </Button>

          <div className="w-full"></div>

          <label className="font-semibold text-[#94a3b8] mr-2">
            Amplitude:
          </label>

          <input
            type="range"
            min="0"
            max="90"
            value={phasors.find((p) => p.name === selectedPhasor)?.amplitude}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      amplitude: parseInt(e.target.value),
                    };
                  }
                  return p;
                });
              });
            }}
            className="flex-grow"
          />

          <input
            type="number"
            min="0"
            max="90"
            value={phasors.find((p) => p.name === selectedPhasor)?.amplitude}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      amplitude: parseInt(e.target.value),
                    };
                  }
                  return p;
                });
              });
            }}
            className="p-1 flex-grow bg-transparent border-[#3e4c59] border rounded-md outline-none text-center text-white"
          />

          <div className="w-full"></div>

          <label className="font-semibold text-[#94a3b8] mr-2">
            Frequency: (Hz)
          </label>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={phasors.find((p) => p.name === selectedPhasor)?.frequency}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      frequency: parseFloat(e.target.value),
                    };
                  }
                  return p;
                });
              });
            }}
            className="flex-grow"
          />

          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={phasors.find((p) => p.name === selectedPhasor)?.frequency}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      frequency: parseFloat(e.target.value),
                    };
                  }
                  return p;
                });
              });
            }}
            className="p-1 flex-grow bg-transparent border-[#3e4c59] border rounded-md outline-none text-center text-white"
          />

          <div className="w-full"></div>

          <label className="font-semibold text-[#94a3b8] mr-2">
            Initial Phase: (nπ rad)
          </label>

          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={
              (phasors.find((p) => p.name === selectedPhasor)?.phase || 0) /
              Math.PI
            }
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      phase: parseFloat(e.target.value) * Math.PI,
                    };
                  }
                  return p;
                });
              });
            }}
            className="flex-grow"
          />

          <input
            type="number"
            min="-2"
            max="2"
            step="0.1"
            value={
              (phasors.find((p) => p.name === selectedPhasor)?.phase || 0) /
              Math.PI
            }
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      phase: parseFloat(e.target.value) * Math.PI,
                    };
                  }
                  return p;
                });
              });
            }}
            className="p-1 flex-grow bg-transparent border-[#3e4c59] border rounded-md outline-none text-center text-white"
          />

          <div className="w-full"></div>

          <label className="font-semibold text-[#94a3b8] mr-2">Color:</label>

          <input
            type="color"
            value={phasors.find((p) => p.name === selectedPhasor)?.color}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      color: e.target.value,
                    };
                  }
                  return p;
                });
              });
            }}
            className="flex-grow"
          />

          <input
            type="text"
            value={phasors.find((p) => p.name === selectedPhasor)?.color}
            onChange={(e) => {
              setPhasors((prev) => {
                return prev.map((p) => {
                  if (p.name === selectedPhasor) {
                    return {
                      ...p,
                      color: e.target.value,
                    };
                  }
                  return p;
                });
              });
            }}
            disabled
            className="p-1 flex-grow bg-transparent border-[#3e4c59] border rounded-md outline-none text-center text-white"
          />
        </div>
      </div>

      <div className="content w-full max-w-3xl mx-auto mt-4 bg-[#020918] rounded-md p-4 text-[#94a3b8]">
        <h2>Instructions</h2>

        <p>
          This is a phasor map explorer. You can add upto 6 phasors and explore
          the resultant phasor map.
        </p>

        <p>
          You can change the amplitude, frequency and initial phase of each
          phasor. You can also change the color of each phasor.
          <ul>
            <li>
              <b>Amplitude</b> is the magnitude of the phasor. Same as the
              radius of the circle.
            </li>
            <li>
              <b>Frequency</b> is the number of complete oscillations in one
              second.
            </li>
            <li>
              <b>Initial Phase</b> is the phase of the phasor at t=0. It is
              measured in radians.
              <br />
              1 radian = 180/π degrees. <br /> So, to make the phasor start at
              90 degrees, the initial phase will π/2. So, put 0.5 in the input
              box.
            </li>
          </ul>
        </p>

        <h2>What are Phasors?</h2>

        <p>
          Phasor diagrams are a representation of an oscillating quantity as a
          vector rotating in phase space with an angular velocity equal to the
          angular frequency of the original trigonometric function.
        </p>

        <h2>Phasor of SHM</h2>

        <p>
          When the motion of a particle performing uniform circular motion is
          projected onto its diameter, the projection undergoes simple harmonic
          motion. The circular motion representation of SHM is the phase diagram
          or phasor, and the angular velocity of this circular motion is the
          frequency of the SHM, <b>ω</b>.
        </p>

        <p>
          The phasor will rotate with angular velocity <b>ω</b> that is the same
          as the angular frequency of the SHM.
          <img src="/eq1.png" alt="Phasor of SHM" className="code invert" />
          Therefore, the function is,
          <img src="/eq2.png" alt="Phasor of SHM" className="code invert" />
          Here Φ is the initial phase of the SHM.
        </p>

        <h2>Compare two Phasors</h2>

        <p>
          When two phasors are added, the resultant phasor is the vector sum of
          the two phasors. The resultant phasor is the phasor sum of the two
          phasors.
        </p>

        <p>
          The phase difference between the two phasors is the angle between the
          two phasors that is the difference of the initial phases of the two
          SHMs.
          <img src="/eq3.png" alt="Phasor of SHM" className="code invert" />
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-4 bg-[#020918] rounded-md p-4 text-[#94a3b8] flex justify-between items-center">
        <h2 className="font-semibold text-lg">Phasor Map Explorer</h2>
        <p>
          An Open Source Project by{" "}
          <a
            href="https://arif.thedev.id"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Arif Sardar
          </a>
        </p>
      </div>
    </main>
  );
}

export default App;
