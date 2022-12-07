import { useEffect, useRef } from "react";
import styled from "styled-components";

function CanvasClock() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = 300;
    canvasRef.current.height = 300;

    run();
    function run() {
      ctx.clearRect(0, 0, 300, 300);
      frame();
      center();
      dots();

      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const milliSecond = date.getMilliseconds();
      const second = date.getSeconds();

      minuteBar(minute);
      hourBar(hour);
      milliSecondBar(second * 1000 + milliSecond);
      // secondeBar(second)

      window.requestAnimationFrame(run);
    }

    function frame () { 
      ctx.beginPath()
      ctx.strokeStyle = "#006DA3";
      ctx.lineWidth = 4
      ctx.arc(150, 150, 140, 0, 360, false);
      ctx.stroke()
  }
    function center() {
      ctx.beginPath();
      ctx.strokeStyle = "#006DA3";
      ctx.arc(150, 150, 5, 0, 360, false);
      ctx.stroke();
      ctx.fill();
    }

    function dots() {
      const dotCount = 12 * 5;
      const angle = 360 / dotCount;

      for (let i = 0; i < dotCount; i++) {
        const n = angle * i;
        const radian = (n / 180) * Math.PI * -1; // radian calculate

        ctx.beginPath();
       ctx.strokeStyle = "#006DA3";

        let length = 128;

        if (n % 90 === 0) {
          // length = 118
          ctx.lineWidth = 3;
        } else if (n % 30 === 0) {
          // length = 123
          ctx.lineWidth = 2;
        } else {
          ctx.lineWidth = 0.5;
        }

        const x1 = Math.cos(radian) * 140 + 150;
        const y1 = Math.sin(radian) * 140 + 150;

        const x2 = Math.cos(radian) * length + 150;
        const y2 = Math.sin(radian) * length + 150;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fill();
      }
    }

    function hourBar(hour) {
      const radian = ((hour * -30 + 90) / 180) * Math.PI * -1;

      onDrawHand({
        size: 80,
        width: 6,
        radian,
      });
    }

    function minuteBar(minute) {
      const radian = ((minute * -6 + 90) / 180) * Math.PI * -1;

      onDrawHand({
        size: 110,
        width: 4,
        radian,
      });
    }

    function milliSecondBar(milliSecond) {
      const radian = ((milliSecond * -0.006 + 90) / 180) * Math.PI * -1;

      const x = Math.cos(radian) * 100;
      const y = Math.sin(radian) * 100;

      const _x = Math.cos(radian) * -40;
      const _y = Math.sin(radian) * -40;

      ctx.beginPath();
      ctx.strokeStyle = "#006DA3";
      ctx.moveTo(150, 150);
      ctx.lineTo(150 + x, 150 + y);
      ctx.lineTo(150 + _x, 150 + _y);

      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function onDrawHand({ color = "#006DA3", size, width, radian }) {
      const x = Math.cos(radian) * size;
      const y = Math.sin(radian) * size;

      ctx.beginPath();
      ctx.strokeStyle = "#006DA3";
      ctx.moveTo(150, 150);
      ctx.lineTo(150 + x, 150 + y);
      ctx.lineWidth = width;
      ctx.stroke();
    }
    console.log(ctx);
  }, [canvasRef]);

  return (
    <Canvas>
      <canvas ref={canvasRef}></canvas>
    </Canvas>
  );
}
export default CanvasClock;

const Canvas = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  canvas {
    display: flex;
    justify-content: center;
    position: absolute;
    width : 90px;
    height : 90px;
    top : 370px;
    right :250px;
    color : #006DA3;
  }
`;
