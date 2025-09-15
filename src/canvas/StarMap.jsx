import React, { useRef, useEffect } from "react";
import stars from "../../data/stars.json";
import constellations from "../../data/constellations.json";

const StarMap = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawScene = () => {
      // Background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Simple projection from RA/Dec to screen
      const project = (ra, dec) => {
        const x = centerX + ra * 20;  // scale RA
        const y = centerY - dec * 10; // scale Dec
        return [x, y];
      };

      // Draw stars
      stars.forEach((star) => {
        const [x, y] = project(star.ra, star.dec);
        const size = Math.max(1, 4 - star.mag); // brighter stars are bigger
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });

      // Draw constellation lines
      ctx.strokeStyle = "rgba(0,150,255,0.6)";
      ctx.lineWidth = 1;
      constellations.forEach((line) => {
        const fromStar = stars.find((s) => s.hip === line.from);
        const toStar = stars.find((s) => s.hip === line.to);
        if (fromStar && toStar) {
          const [x1, y1] = project(fromStar.ra, fromStar.dec);
          const [x2, y2] = project(toStar.ra, toStar.dec);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawScene();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0" />;
};

export default StarMap;
