import React from "react";
import p5 from "p5";
import { Phresor } from "./phasor";

type Props = {
  phasors: {
    name: string;
    amplitude: number;
    frequency: number;
    phase: number;
    color: string;
  }[];
  isPaused?: boolean;
};

export default function PhasorCanvas(props: Props) {
  const env = React.useMemo(
    () => ({
      height: 200,
      width: 800,
    }),
    []
  );

  const ref = React.useRef<HTMLDivElement>(null);
  const pRef = React.useRef<p5>();

  React.useEffect(() => {
    if (!ref.current) return;
    if (pRef.current) return;

    const p = new p5((p: p5) => {
      if (!ref.current) return;

      const phasors: {
        name: string;
        phasor: Phresor;
      }[] = props.phasors.map((phasor, index) => ({
        name: phasor.name,
        phasor: new Phresor(env, {
          name: phasor.name,
          top: 0,
          left: 0,
          height: env.height,
          width: env.width,
          circlePadding: 20,
          amplitude: phasor.amplitude,
          frequency: phasor.frequency,
          phase: phasor.phase,
          sinuSoidXTimes: 2,
          colors: {
            circle: "#94a3b8",
            phasor: phasor.color,
          },
          showSinusoid: true,
          showLabels: true,
          showOutline: index === 0,
        }),
      }));

      p.setup = () => {
        p.createCanvas(800, 300).parent(ref.current!);
        if (props.isPaused) {
          p.frameRate(0);
          p.background(2, 9, 24);
          // Draw phrasors
          phasors.forEach((phasor) => {
            phasor.phasor.draw(p);
          });
        } else p.frameRate(120);
      };

      p.draw = () => {
        p.background(2, 9, 24);

        // Draw phrasors
        phasors.forEach((phasor, index) => {
          phasor.phasor.draw(p);

          // Draw labels
          p.push();
          p.noStroke();
          p.fill(255);
          p.textSize(16);
          p.textAlign(p.LEFT, p.TOP);
          p.textFont("monospace");
          p.text(
            `${phasor.name} = ${phasor.phasor.props.amplitude} Sin(${(
              phasor.phasor.props.frequency *
              2 *
              Math.PI
            ).toFixed(2)} t ${
              phasor.phasor.props.phase >= 0 ? "+" : "-"
            } ${Math.abs(
              parseFloat((phasor.phasor.props.phase / Math.PI).toFixed(2))
            )} π)`,
            index < 3 ? 20 : 420,
            215 + (index < 3 ? index * 30 : (index - 3) * 30)
          );
          p.pop();
        });
      };
    });

    pRef.current = p;

    return () => {
      p.remove();
      pRef.current = undefined;
    };
  }, [props.phasors, env]);

  React.useEffect(() => {
    if (!pRef.current) return;
    if (props.isPaused) pRef.current.frameRate(0);
    else pRef.current.frameRate(120);
  }, [props.isPaused]);

  return (
    <div
      className="!w-full !aspect-[8/3] !h-auto bg-[#020918] max-w-3xl rounded-xl mx-auto overflow-hidden"
      ref={ref}
    >
      {/* <canvas
        className="!w-full !aspect-[8/3] !h-auto bg-[#020918] max-w-3xl rounded-lg mx-auto"
        ref={ref}
      /> */}
    </div>
  );
}
