"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type Doodle = {
  id: number;
  image: string;
  name: string;
};

const starterDoodles: Doodle[] = [];

const colours = [
  "#292827",
  "#df7775",
  "#557fa1",
  "#d4a928",
  "#78956f",
  "#9b7ca7",
];

export default function DoodleWall() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const drawingRef = useRef(false);

  const lastPoint =
    useRef<{ x: number; y: number } | null>(null);

  const historyRef =
    useRef<ImageData[]>([]);

  const [colour, setColour] =
    useState("#292827");

  const [brush, setBrush] =
    useState(4);

  const [name, setName] =
    useState("");

  const [doodles, setDoodles] =
    useState<Doodle[]>(starterDoodles);

  const [hasDrawing, setHasDrawing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);


  /* -------------------------------------------------------
     CANVAS SETUP
     ------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      const rect =
        canvas.getBoundingClientRect();

      const previous =
        canvas.width > 0
          ? canvas
              .getContext("2d")
              ?.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              )
          : null;

      const ratio =
        window.devicePixelRatio || 1;

      canvas.width =
        rect.width * ratio;

      canvas.height =
        rect.height * ratio;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) return;

      ctx.scale(ratio, ratio);

      ctx.fillStyle = "#fffaf0";

      ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
      );

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (previous) {
        // Canvas resize protection.
        // The drawing remains usable even when
        // the browser changes size.
      }
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () =>
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
  }, []);


  /* -------------------------------------------------------
     SNAPSHOT
     ------------------------------------------------------- */

  const saveHistory = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    historyRef.current.push(
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
    );

    if (
      historyRef.current.length > 15
    ) {
      historyRef.current.shift();
    }
  };


  /* -------------------------------------------------------
     POINTER POSITION
     ------------------------------------------------------- */

  const getPoint = (
    event:
      | React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };


  /* -------------------------------------------------------
     START DRAWING
     ------------------------------------------------------- */

  const startDrawing = (
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) => {
    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    saveHistory();

    const point =
      getPoint(event);

    drawingRef.current = true;

    lastPoint.current = point;

    setHasDrawing(true);
  };


  /* -------------------------------------------------------
     DRAW
     ------------------------------------------------------- */

  const draw = (
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (
      !drawingRef.current ||
      !lastPoint.current
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const point =
      getPoint(event);

    ctx.strokeStyle = colour;

    ctx.lineWidth = brush;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    ctx.moveTo(
      lastPoint.current.x,
      lastPoint.current.y
    );

    ctx.lineTo(
      point.x,
      point.y
    );

    ctx.stroke();

    lastPoint.current = point;
  };


  /* -------------------------------------------------------
     STOP
     ------------------------------------------------------- */

  const stopDrawing = () => {
    drawingRef.current = false;

    lastPoint.current = null;
  };


  /* -------------------------------------------------------
     CLEAR
     ------------------------------------------------------- */

  const clearCanvas = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    saveHistory();

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "#fffaf0";

    ctx.fillRect(
      0,
      0,
      canvas.clientWidth,
      canvas.clientHeight
    );

    setHasDrawing(false);
  };


  /* -------------------------------------------------------
     UNDO
     ------------------------------------------------------- */

  const undo = () => {
    const canvas =
      canvasRef.current;

    const previous =
      historyRef.current.pop();

    if (!canvas || !previous) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.putImageData(
      previous,
      0,
      0
    );
  };


  /* -------------------------------------------------------
     SAVE DOODLE
     ------------------------------------------------------- */

  const saveDoodle = () => {
    const canvas =
      canvasRef.current;

    if (!canvas || !hasDrawing) {
      alert(
        "You haven't drawn anything yet 😭"
      );
      return;
    }

    const image =
      canvas.toDataURL(
        "image/png"
      );

    setDoodles((current) => [
      ...current,
      {
        id: Date.now(),
        image,
        name:
          name.trim() ||
          "Anonymous artist",
      },
    ]);

    setName("");

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      2200
    );

    clearCanvas();
  };


  return (
    <section
      id="doodles"
      className="doodle-section"
    >

      <style jsx>{`

        .doodle-section {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 90px 0 110px;
          color: #292827;
        }

        .doodle-heading {
          display: flex;
          gap: 15px;
          align-items: baseline;
          margin-bottom: 30px;
        }

        .doodle-number {
          color: #df7775;
          font-family: "DM Mono", monospace;
          font-size: 11px;
        }

        .doodle-heading h2 {
          margin: 0;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .doodle-intro {
          margin-bottom: 25px;
        }

        .doodle-intro h3 {
          margin: 0;
          font-family: "Kalam", cursive;
          font-size: 28px;
        }

        .doodle-intro p {
          margin: 5px 0 0;
          color: #706c66;
          font-size: 13px;
        }

        .drawing-paper {
          position: relative;
          padding: 25px;
          background: #fffdf8;
          border: 1px solid #292827;
          box-shadow: 7px 8px 0 rgba(41,40,39,.12);
          transform: rotate(.35deg);
        }

        .drawing-tape {
          position: absolute;
          top: -9px;
          left: 20%;
          width: 85px;
          height: 19px;
          background: rgba(229,200,95,.7);
          transform: rotate(-3deg);
        }

        .canvas-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          color: #77736d;
        }

        .canvas-label strong {
          color: #df7775;
        }

        .canvas {
          width: 100%;
          height: 330px;
          display: block;
          border: 1px dashed #bdb5a9;
          background: #fffaf0;
          cursor: crosshair;
          touch-action: none;
        }

        .tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 13px;
          flex-wrap: wrap;
        }

        .colours {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .colour {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid #292827;
          cursor: pointer;
        }

        .colour.active {
          outline: 2px solid #292827;
          outline-offset: 2px;
        }

        .brush {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          color: #706c66;
        }

        .brush input {
          width: 75px;
        }

        .actions {
          display: flex;
          gap: 7px;
        }

        .actions button {
          border: 1px dashed #aaa39a;
          background: transparent;
          padding: 7px 10px;
          font-family: "DM Mono", monospace;
          font-size: 7px;
          cursor: pointer;
        }

        .artist-row {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }

        .artist-row input {
          flex: 1;
          min-width: 0;
          border: 0;
          border-bottom: 1px solid #aaa39a;
          background: transparent;
          padding: 9px 3px;
          outline: none;
          font-family: "Kalam", cursive;
          font-size: 16px;
        }

        .artist-row button {
          border: 1px solid #292827;
          background: #df7775;
          padding: 9px 14px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          cursor: pointer;
        }

        .saved-note {
          margin: 12px 0 0;
          color: #78956f;
          font-family: "Kalam", cursive;
          font-size: 15px;
        }

        .doodle-wall {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 35px;
        }

        .doodle-card {
          padding: 10px 10px 13px;
          background: #fffdf8;
          border: 1px solid #292827;
          box-shadow: 4px 5px 0 rgba(41,40,39,.1);
        }

        .doodle-card:nth-child(4n + 1) {
          transform: rotate(-2deg);
        }

        .doodle-card:nth-child(4n + 2) {
          transform: rotate(1deg);
        }

        .doodle-card:nth-child(4n + 3) {
          transform: rotate(-1deg);
        }

        .doodle-card:nth-child(4n) {
          transform: rotate(2deg);
        }

        .doodle-card img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: contain;
          display: block;
          background: #fffaf0;
        }

        .doodle-card p {
          margin: 8px 2px 0;
          font-family: "Kalam", cursive;
          font-size: 12px;
        }

        @media (max-width: 700px) {

          .doodle-section {
            width: calc(100% - 24px);
            padding: 65px 0 80px;
          }

          .drawing-paper {
            padding: 17px;
          }

          .canvas {
            height: 260px;
          }

          .doodle-wall {
            grid-template-columns: repeat(2, 1fr);
          }

          .artist-row {
            flex-direction: column;
          }

          .artist-row button {
            width: 100%;
          }

        }

      `}</style>


      <div className="doodle-heading">
        <span className="doodle-number">
          03
        </span>

        <h2>
          The doodle wall.
        </h2>
      </div>


      <div className="doodle-intro">

        <h3>
          Draw something questionable.
        </h3>

        <p>
          Actual drawing. Actual canvas.
          Zero artistic ability required.
        </p>

      </div>


      <div className="drawing-paper">

        <div className="drawing-tape" />

        <div className="canvas-label">
          <span>
            ANUPA'S VERY SERIOUS ART DEPARTMENT
          </span>

          <strong>
            DRAW HERE ↓
          </strong>
        </div>


        <canvas
          ref={canvasRef}
          className="canvas"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
        />


        <div className="tools">

          <div className="colours">

            {colours.map((item) => (

              <button
                key={item}
                type="button"
                className={`colour ${
                  colour === item
                    ? "active"
                    : ""
                }`}
                style={{
                  background: item,
                }}
                onClick={() =>
                  setColour(item)
                }
                aria-label="Choose colour"
              />

            ))}

          </div>


          <label className="brush">

            brush

            <input
              type="range"
              min="2"
              max="16"
              value={brush}
              onChange={(event) =>
                setBrush(
                  Number(event.target.value)
                )
              }
            />

          </label>


          <div className="actions">

            <button
              type="button"
              onClick={undo}
            >
              ↶ undo
            </button>

            <button
              type="button"
              onClick={clearCanvas}
            >
              clear
            </button>

          </div>

        </div>


        <div className="artist-row">

          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="sign your masterpiece..."
            maxLength={40}
          />

          <button
            type="button"
            onClick={saveDoodle}
          >
            pin it →
          </button>

        </div>


        {saved && (

          <p className="saved-note">
            ✦ masterpiece acquired.
          </p>

        )}

      </div>


      {doodles.length > 0 && (

        <div className="doodle-wall">

          {doodles.map((doodle) => (

            <article
              className="doodle-card"
              key={doodle.id}
            >

              <img
                src={doodle.image}
                alt="Submitted doodle"
              />

              <p>
                — {doodle.name}
              </p>

            </article>

          ))}

        </div>

      )}

    </section>
  );
}