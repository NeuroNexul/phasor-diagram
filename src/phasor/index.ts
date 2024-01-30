import p5 from "p5";

export type ENV = {
  width: number;
  height: number;
};

export type Props = {
  name?: string;
  top: number;
  left: number;
  height: number;
  width: number;
  circlePadding: number;
  amplitude: number;
  frequency: number;
  phase: number;
  sinuSoidXTimes: number;
  colors: {
    circle: string | null;
    phasor: string;
  };
  showSinusoid: boolean;
  showLabels: boolean;
  showOutline: boolean;
};

export class Phresor {
  env: ENV;
  props: Props;
  rect: {
    t: number;
    b: number;
    l: number;
    r: number;
    w: number;
    h: number;
    center: {
      x: number;
      y: number;
    };
    circle: {
      w: number;
      h: number;
      r: number;
      d: number;
      center: {
        x: number;
        y: number;
      };
    };
  };
  isPaused: boolean = false;

  constructor(env: ENV, props?: Partial<Props>) {
    this.env = env;
    this.props = {
      top: 0,
      left: 0,
      height: 2 * (props?.amplitude || 75) + (props?.circlePadding || 20) * 2,
      width: env.width,
      circlePadding: 20,
      amplitude: 75,
      frequency: 0.1047197551,
      phase: 0,
      sinuSoidXTimes: 2,
      colors: {
        circle: "#94a3b8",
        phasor: "#fff",
        ...props?.colors,
      },
      showSinusoid: true,
      showLabels: true,
      showOutline: true,
      ...props,
    };

    this.rect = {
      t: this.props.top,
      b: this.props.height + this.props.top,
      l: this.props.left,
      r: this.props.width + this.props.left,
      w: this.props.width,
      h: this.props.height,
      center: {
        x: this.props.width / 2 + this.props.left,
        y: this.props.height / 2 + this.props.top,
      },
      circle: {
        w: this.props.height,
        h: this.props.height,
        r: this.props.amplitude,
        d: this.props.amplitude * 2,
        center: {
          x: this.props.height / 2 + this.props.left,
          y: this.props.height / 2 + this.props.top,
        },
      },
    };
  }

  draw(p: p5) {
    const time = p.frameCount / 60;
    const omega = 2 * p.PI * this.props.frequency;
    const angle = omega * time + this.props.phase;

    // Get Quadrant
    const quadrant = this.getQuadrant(angle, p);

    // Draw
    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);

    this.drawOutline(p);
    this.drawPhasorLine({ angle: quadrant.angle, q: quadrant.q, p });
    if (this.props.showSinusoid) {
      this.drawSinusoid({ angle, p });
    }
  }

  drawOutline(p: p5) {
    if (!this.props.showOutline) return;

    p.noFill();
    if (this.props.colors.circle) {
      p.stroke(this.props.colors.circle);
    } else {
      p.noStroke();
    }
    p.strokeWeight(0.5);

    // Outline
    p.rect(
      this.props.left,
      this.props.top,
      this.props.width,
      this.props.height
    );

    // Circle
    p.circle(
      this.rect.circle.center.x,
      this.rect.circle.center.y,
      this.rect.circle.d
    );
    // X Axix of Circle
    p.line(
      this.rect.circle.center.x - this.rect.circle.r,
      this.rect.circle.center.y,
      this.rect.circle.center.x + this.rect.circle.r,
      this.rect.circle.center.y
    );
    // Y Axix of Circle
    p.line(
      this.rect.circle.center.x,
      this.rect.circle.center.y - this.rect.circle.r,
      this.rect.circle.center.x,
      this.rect.circle.center.y + this.rect.circle.r
    );

    if (this.props.showSinusoid) {
      // Draw Start Line
      p.line(
        this.rect.circle.w + this.props.left + this.props.circlePadding,
        this.rect.t,
        this.rect.circle.w + this.props.left + this.props.circlePadding,
        this.rect.b
      );
      // Draw X axis
      p.line(
        this.rect.circle.w + this.props.left + this.props.circlePadding,
        this.rect.circle.center.y,
        this.rect.w,
        this.rect.circle.center.y
      );
    }

    // Draw Labels
    if (this.props.showLabels) {
      p.strokeWeight(0);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      if (this.props.colors.circle) {
        p.fill(this.props.colors.circle);
      } else {
        p.noFill();
      }
      // p.text("0", this.rect.circle.center.x, this.rect.circle.center.y);
      p.text(
        "0",
        this.rect.circle.center.x + this.rect.circle.r + 10,
        this.rect.circle.center.y
      );
      p.text(
        "π/2",
        this.rect.circle.center.x,
        this.rect.circle.center.y - this.rect.circle.r - 10
      );
      p.text(
        "π",
        this.rect.circle.center.x - this.rect.circle.r - 10,
        this.rect.circle.center.y
      );
      p.text(
        "3π/2",
        this.rect.circle.center.x,
        this.rect.circle.center.y + this.rect.circle.r + 10
      );
    }
  }

  drawPhasorLine({ angle, q, p }: { angle: number; q: number; p: p5 }) {
    const sq_r = p.sq(this.rect.circle.r);
    const sq_tan = p.sq(p.tan(angle));

    const cross_x = p.sqrt(sq_r / (1 + sq_tan));
    const cross_y = p.sqrt((sq_r * sq_tan) / (1 + sq_tan));

    p.stroke(this.props.colors.phasor);
    p.strokeWeight(1.5);

    const x =
      q === 1 || q === 4
        ? this.rect.circle.center.x + cross_x
        : this.rect.circle.center.x - cross_x;
    const y =
      q === 1 || q === 2
        ? this.rect.circle.center.y - cross_y
        : this.rect.circle.center.y + cross_y;

    p.line(this.rect.circle.center.x, this.rect.circle.center.y, x, y);

    if (this.props.colors.circle) {
      p.stroke(this.props.colors.circle);
    } else {
      p.noStroke();
    }
    p.strokeWeight(0.5);

    // Draw line to form a right triangle
    p.strokeWeight(1);
    if (this.props.showSinusoid) {
      // Draw line from circle to Start Line
      p.line(
        x,
        y,
        this.rect.circle.w + this.props.left + this.props.circlePadding,
        y
      );
    }
    p.strokeWeight(0.25);
    p.line(x, this.rect.circle.center.y, x, y);
    p.line(this.rect.circle.center.x, y, x, y);
  }

  drawSinusoid({ angle, p }: { angle: number; p: p5 }) {
    p.stroke(this.props.colors.phasor);
    p.strokeWeight(1.5);
    p.noFill();

    // Draw Sinusoid
    p.beginShape();
    const start_px =
      this.rect.circle.w + this.props.left + this.props.circlePadding;
    const xspacing = 1;
    const dx = p.TWO_PI * xspacing * this.props.frequency;

    let x = 0;
    for (let i = 0; i < this.rect.w; i++) {
      const pos_x = start_px + i * xspacing * this.props.sinuSoidXTimes;
      const pos_y =
        this.rect.circle.center.y +
        this.rect.circle.r * p.sin(-angle + x * this.props.frequency);

      p.vertex(pos_x, pos_y);

      x += dx;
    }
    p.endShape();
  }

  changeProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props };
  }

  toggleAnimation(p: p5) {
    if (this.isPaused) {
      p.frameRate(60);
    } else {
      p.frameRate(0);
    }
    this.isPaused = !this.isPaused;
  }

  play(p: p5) {
    p.frameRate(60);
    this.isPaused = false;
  }

  pause(p: p5) {
    p.frameRate(0);
    this.isPaused = true;
  }

  getQuadrant(angle: number, p: p5): { q: number; angle: number } {
    if (angle > (3 * p.PI) / 2) {
      // 4rd quadrant
      if (angle > 2 * p.PI) {
        return this.getQuadrant(angle - 2 * p.PI, p);
      }

      angle = p.PI / 2 - angle - (3 * p.PI) / 2;
      return { q: 4, angle };
    } else {
      if (angle > p.PI) {
        // 3nd quadrant
        angle = angle - p.PI;
        return { q: 3, angle };
      } else {
        if (angle > p.PI / 2) {
          // 2st quadrant
          angle = p.PI / 2 - angle - p.PI / 2;
          return { q: 2, angle };
        } else {
          if (angle < 0) {
            return this.getQuadrant(2 * p.PI + angle, p);
          }

          return { q: 1, angle };
        }
      }
    }
  }
}
