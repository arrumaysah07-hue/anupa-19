"use client";

import { useEffect, useState } from "react";

const wishes = [
  "More money. Obviously.",
  "Good people around you.",
  "Food that arrives on time.",
  "A suspicious amount of happiness.",
  "Actual sleep.",
  "Less academic nonsense.",
  "More reasons to dress up.",
  "No unnecessary drama.",
  "A passport full of stamps.",
  "Tiny wins every week.",
  "Big laughs over stupid things.",
  "The courage to say no.",
  "The courage to say yes.",
  "Money that mysteriously multiplies.",
  "Good pictures. Better memories.",
  "People who get you.",
  "A fridge that is never empty.",
  "A year worth remembering.",
  "And cake. Non-negotiable.",
];

const letters = [
  {
    title: "Open when life is annoying",
    text: "Take a breath. Eat something. Complain dramatically. Continue.",
  },
  {
    title: "Open when you need a reminder",
    text: "You have people rooting for you, even when you pretend you don't need it.",
  },
  {
    title: "Open when you need to laugh",
    text: "Unfortunately, we know enough about you to provide material for years.",
  },
  {
    title: "Open when you're 20",
    text: "Congratulations. You have unlocked another level of pretending to know what you're doing.",
  },
];

const verdicts = [
  "Today you are legally required to eat cake.",
  "Your birthday aura is suspiciously powerful.",
  "You have been diagnosed with main-character energy.",
  "Someone owes you food.",
  "The universe says: buy yourself something.",
  "You are allowed to ignore one responsibility today.",
  "Your next selfie will be inexplicably good.",
  "A good memory is probably about to happen.",
];

export default function ChaosCorner() {

  const [lit, setLit] =
    useState(19);

  const [openedLetter, setOpenedLetter] =
    useState<number | null>(null);

  const [selectedWish, setSelectedWish] =
    useState<number | null>(null);

  const [wish, setWish] =
    useState("");

  const [wishesPosted, setWishesPosted] =
    useState<string[]>([]);

  const [verdict, setVerdict] =
    useState(
      "Click this. I promise absolutely nothing."
    );

  const [gameRunning, setGameRunning] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [gameTime, setGameTime] =
    useState(10);

  const [target, setTarget] =
    useState({
      x: 50,
      y: 50,
    });


  /* -------------------------------------------------------
     CANDLE
     ------------------------------------------------------- */

  const blowCandle = () => {
    setLit((current) =>
      current > 0
        ? current - 1
        : 19
    );
  };


  /* -------------------------------------------------------
     WISH
     ------------------------------------------------------- */

  const postWish = () => {
    if (!wish.trim()) return;

    setWishesPosted((current) => [
      ...current,
      wish.trim(),
    ]);

    setWish("");
  };


  /* -------------------------------------------------------
     MINI GAME
     ------------------------------------------------------- */

  useEffect(() => {
    if (!gameRunning) return;

    if (gameTime <= 0) {
      setGameRunning(false);
      return;
    }

    const timer =
      setTimeout(
        () =>
          setGameTime(
            (current) =>
              current - 1
          ),
        1000
      );

    return () =>
      clearTimeout(timer);

  }, [
    gameRunning,
    gameTime,
  ]);


  const startGame = () => {
    setScore(0);
    setGameTime(10);
    setGameRunning(true);

    moveTarget();
  };


  const moveTarget = () => {
    setTarget({
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
    });
  };


  const catchTarget = () => {
    if (!gameRunning) return;

    setScore(
      (current) =>
        current + 1
    );

    moveTarget();
  };


  return (

    <section
      id="surprises"
      className="chaos-section"
    >

      <style jsx>{`

        .chaos-section {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 90px 0 110px;
          color: #292827;
        }

        .chaos-heading {
          display: flex;
          align-items: baseline;
          gap: 15px;
          margin-bottom: 10px;
        }

        .chaos-heading span {
          color: #df7775;
          font-family: "DM Mono", monospace;
          font-size: 11px;
        }

        .chaos-heading h2 {
          margin: 0;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .chaos-subtitle {
          margin: 0 0 35px;
          color: #706c66;
          font-family: "Kalam", cursive;
          font-size: 17px;
        }


        /* CAKE */

        .cake-box {
          position: relative;
          padding: 30px;
          background: #f4d8d6;
          border: 1px solid #292827;
          box-shadow: 7px 8px 0 rgba(41,40,39,.12);
          margin-bottom: 35px;
        }

        .cake-box h3 {
          margin: 0;
          font-family: "Kalam", cursive;
          font-size: 31px;
        }

        .cake-box p {
          margin: 5px 0 25px;
          color: #706c66;
          font-size: 12px;
        }

        .cake {
          position: relative;
          width: min(390px, 100%);
          height: 175px;
          margin: auto;
        }

        .candles {
          position: absolute;
          top: 0;
          left: 50%;
          width: 230px;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 3px;
        }

        .candle {
          position: relative;
          width: 10px;
          height: 40px;
          border: 1px solid #292827;
          background: #e5c85f;
          padding: 0;
          cursor: pointer;
        }

        .candle:nth-child(3n) {
          background: #9db7ce;
        }

        .candle:nth-child(4n) {
          background: #a9b99f;
        }

        .candle.out {
          opacity: .25;
        }

        .flame {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          animation: flame 0.5s ease-in-out infinite alternate;
        }

        @keyframes flame {
          from {
            transform:
              translateX(-50%)
              scale(.85)
              rotate(-4deg);
          }

          to {
            transform:
              translateX(-50%)
              scale(1.1)
              rotate(4deg);
          }
        }

        .cake-top {
          position: absolute;
          top: 38px;
          left: 50%;
          width: 245px;
          height: 42px;
          transform: translateX(-50%);
          border: 1px solid #292827;
          border-radius: 50%;
          background: #f0c19f;
          z-index: 2;
          display: grid;
          place-items: center;
          font-family: "Kalam", cursive;
          font-size: 23px;
        }

        .cake-body {
          position: absolute;
          top: 58px;
          left: 50%;
          width: 245px;
          height: 70px;
          transform: translateX(-50%);
          border: 1px solid #292827;
          border-radius: 8px 8px 20px 20px;
          background: #df7775;
        }

        .cake-plate {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 290px;
          height: 18px;
          transform: translateX(-50%);
          border: 1px solid #292827;
          border-radius: 50%;
          background: #9db7ce;
        }

        .cake-status {
          margin-top: 14px;
          text-align: center;
          font-family: "DM Mono", monospace;
          font-size: 9px;
        }

        .cake-status button {
          margin-left: 8px;
          border: 0;
          background: transparent;
          text-decoration: underline;
          font-size: 9px;
          cursor: pointer;
        }


        /* WISHES */

        .wish-box {
          padding: 28px;
          background: #e2eadc;
          border: 1px solid #292827;
          box-shadow: 6px 7px 0 rgba(41,40,39,.11);
          margin-bottom: 35px;
        }

        .wish-box h3 {
          margin: 0;
          font-size: 29px;
          letter-spacing: -.04em;
        }

        .wish-box > p {
          margin: 6px 0 20px;
          color: #706c66;
          font-family: "Kalam", cursive;
        }

        .wish-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .wish-card {
          min-height: 85px;
          padding: 10px;
          border: 1px solid #292827;
          background: #e8cf72;
          cursor: pointer;
          text-align: left;
          transition: transform .15s ease;
        }

        .wish-card:nth-child(3n) {
          background: #a9c0d3;
        }

        .wish-card:nth-child(4n) {
          background: #efa1a5;
        }

        .wish-card:hover {
          transform:
            translateY(-4px)
            rotate(-1deg);
        }

        .wish-card span {
          display: block;
          font-family: "DM Mono", monospace;
          font-size: 9px;
          margin-bottom: 6px;
        }

        .wish-card strong {
          font-family: "Kalam", cursive;
          font-size: 12px;
          line-height: 1.1;
        }

        .selected-wish {
          margin: 18px 0 0;
          font-family: "Kalam", cursive;
          font-size: 18px;
        }


        /* POST WISH */

        .post-wish {
          display: flex;
          gap: 9px;
          margin-top: 22px;
        }

        .post-wish input {
          flex: 1;
          min-width: 0;
          padding: 10px;
          border: 0;
          border-bottom: 1px solid #8f998a;
          background: transparent;
          outline: none;
          font-family: "Kalam", cursive;
          font-size: 15px;
        }

        .post-wish button {
          border: 1px solid #292827;
          background: #292827;
          color: white;
          padding: 9px 13px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          cursor: pointer;
        }

        .visitor-wishes {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .visitor-wish {
          padding: 8px 11px;
          background: #fffdf8;
          border: 1px dashed #aaa39a;
          font-family: "Kalam", cursive;
          font-size: 13px;
          transform: rotate(-1deg);
        }


        /* ENVELOPES */

        .envelopes {
          padding: 28px;
          background: #e9e0d4;
          border: 1px solid #292827;
          box-shadow: 6px 7px 0 rgba(41,40,39,.11);
          margin-bottom: 35px;
        }

        .envelopes h3 {
          margin: 0;
          font-size: 29px;
          letter-spacing: -.04em;
        }

        .envelopes > p {
          margin: 5px 0 20px;
          color: #706c66;
          font-family: "Kalam", cursive;
        }

        .envelope-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .envelope {
          min-height: 150px;
          padding: 17px 13px;
          border: 1px solid #292827;
          background: #f1d5d1;
          cursor: pointer;
          text-align: left;
          box-shadow: 3px 4px 0 rgba(41,40,39,.1);
          transition: transform .18s ease;
        }

        .envelope:nth-child(2) {
          background: #c9dce9;
        }

        .envelope:nth-child(3) {
          background: #e5cf70;
        }

        .envelope:nth-child(4) {
          background: #cbdac4;
        }

        .envelope:hover {
          transform: translateY(-4px);
        }

        .envelope-icon {
          display: block;
          font-size: 22px;
          margin-bottom: 10px;
        }

        .envelope strong {
          display: block;
          font-family: "Kalam", cursive;
          font-size: 15px;
          line-height: 1.05;
        }

        .envelope small {
          display: block;
          margin-top: 10px;
          font-family: "DM Mono", monospace;
          font-size: 6px;
          color: #706c66;
        }

        .letter small {
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .letter h4 {
          margin: 8px 0;
          font-family: "Kalam", cursive;
          font-size: 17px;
        }

        .letter p {
          margin: 0;
          font-family: "Kalam", cursive;
          font-size: 12px;
          line-height: 1.2;
        }


        /* GAME */

        .game {
          position: relative;
          min-height: 290px;
          overflow: hidden;
          padding: 25px;
          background: #d8e3ee;
          border: 1px solid #292827;
          box-shadow: 6px 7px 0 rgba(41,40,39,.11);
          margin-bottom: 35px;
        }

        .game h3 {
          margin: 0;
          font-size: 27px;
        }

        .game p {
          margin: 5px 0;
          color: #706c66;
          font-family: "Kalam", cursive;
        }

        .game-stats {
          display: flex;
          gap: 18px;
          margin: 10px 0;
          font-family: "DM Mono", monospace;
          font-size: 9px;
        }

        .game-start {
          border: 1px solid #292827;
          background: #e5c85f;
          padding: 9px 13px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          cursor: pointer;
        }

        .game-target {
          position: absolute;
          width: 38px;
          height: 38px;
          border: 1px solid #292827;
          border-radius: 50%;
          background: #df7775;
          display: grid;
          place-items: center;
          font-size: 20px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          animation: targetPop .18s ease;
        }

        @keyframes targetPop {
          from {
            transform:
              translate(-50%, -50%)
              scale(.4);
          }

          to {
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }

        .verdict {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px;
          background: #fffdf8;
          border: 1px solid #292827;
          box-shadow: 5px 6px 0 rgba(41,40,39,.1);
        }

        .verdict p {
          margin: 0;
          font-family: "Kalam", cursive;
          font-size: 19px;
        }

        .verdict button {
          flex-shrink: 0;
          border: 1px solid #292827;
          background: #efa1a5;
          padding: 9px 12px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          cursor: pointer;
        }


        @media (max-width: 700px) {

          .chaos-section {
            width: calc(100% - 24px);
            padding: 65px 0 80px;
          }

          .cake-box,
          .wish-box,
          .envelopes,
          .game {
            padding: 20px;
          }

          .wish-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .envelope-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .post-wish {
            flex-direction: column;
          }

          .post-wish button {
            width: 100%;
          }

          .verdict {
            display: block;
          }

          .verdict button {
            margin-top: 12px;
          }

        }

      `}</style>


      {/* HEADER */}

      <div className="chaos-heading">

        <span>
          04
        </span>

        <h2>
          Things you absolutely didn't ask for.
        </h2>

      </div>

      <p className="chaos-subtitle">
        Because apparently “happy birthday”
        wasn't enough.
      </p>


      {/* ==================================================
          CAKE
          ================================================== */}

      <div className="cake-box">

        <h3>
          🎂 Make a wish.
        </h3>

        <p>
          There are 19 candles.
          We are unfortunately making you
          blow out every single one.
        </p>


        <div className="cake">

          <div className="candles">

            {Array.from(
              { length: 19 },
              (_, index) => (

                <button
                  key={index}
                  type="button"
                  className={`candle ${
                    index >= lit
                      ? "out"
                      : ""
                  }`}
                  onClick={blowCandle}
                >

                  {index < lit && (
                    <span className="flame">
                      🔥
                    </span>
                  )}

                </button>

              )
            )}

          </div>

          <div className="cake-top">
            19
          </div>

          <div className="cake-body" />

          <div className="cake-plate" />

        </div>


        <div className="cake-status">

          {lit === 0
            ? "✨ ALL OUT. MAKE YOUR WISH."
            : `${lit} candles remain.`}

          <button
            type="button"
            onClick={() => setLit(19)}
          >
            relight
          </button>

        </div>

      </div>


      {/* ==================================================
          19 WISHES
          ================================================== */}

      <div className="wish-box">

        <h3>
          19 tiny wishes.
        </h3>

        <p>
          One for every year.
          Click around. Be nosy.
        </p>


        <div className="wish-grid">

          {wishes.map(
            (item, index) => (

              <button
                key={index}
                type="button"
                className="wish-card"
                onClick={() =>
                  setSelectedWish(index)
                }
              >

                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <strong>
                  {item}
                </strong>

              </button>

            )
          )}

        </div>


        {selectedWish !== null && (

          <p className="selected-wish">
            ✦ #{selectedWish + 1}:{" "}
            {wishes[selectedWish]}
          </p>

        )}


        <div className="post-wish">

          <input
            value={wish}
            onChange={(event) =>
              setWish(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                postWish();
              }
            }}
            placeholder="Leave Anupa a tiny wish..."
            maxLength={120}
          />

          <button
            type="button"
            onClick={postWish}
          >
            pin wish →
          </button>

        </div>


        {wishesPosted.length > 0 && (

          <div className="visitor-wishes">

            {wishesPosted.map(
              (item, index) => (

                <div
                  className="visitor-wish"
                  key={index}
                >
                  ✦ {item}
                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ==================================================
          ENVELOPES
          ================================================== */}

      <div className="envelopes">

        <h3>
          💌 Open only when necessary.
        </h3>

        <p>
          Four envelopes. Four extremely
          serious situations.
        </p>


        <div className="envelope-grid">

          {letters.map(
            (letter, index) => {

              const open =
                openedLetter === index;

              return (

                <button
                  key={index}
                  type="button"
                  className="envelope"
                  onClick={() =>
                    setOpenedLetter(
                      open
                        ? null
                        : index
                    )
                  }
                >

                  {!open ? (

                    <>
                      <span className="envelope-icon">
                        ✉
                      </span>

                      <strong>
                        {letter.title}
                      </strong>

                      <small>
                        click to unseal
                      </small>
                    </>

                  ) : (

                    <div className="letter">

                      <small>
                        OPENED
                      </small>

                      <h4>
                        {letter.title}
                      </h4>

                      <p>
                        {letter.text}
                      </p>

                    </div>

                  )}

                </button>

              );
            }
          )}

        </div>

      </div>


      {/* ==================================================
          MINI GAME
          ================================================== */}

      <div className="game">

        <h3>
          🫵 Catch the birthday blob.
        </h3>

        <p>
          Ten seconds. Click it as many times
          as humanly possible.
        </p>


        <div className="game-stats">

          <span>
            SCORE: {score}
          </span>

          <span>
            TIME: {gameTime}s
          </span>

        </div>


        {!gameRunning && (

          <button
            type="button"
            className="game-start"
            onClick={startGame}
          >
            {gameTime === 0
              ? "again →"
              : "start nonsense →"}
          </button>

        )}


        {gameRunning && (

          <button
            type="button"
            className="game-target"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
            onClick={catchTarget}
          >
            ✦
          </button>

        )}

      </div>


      {/* ==================================================
          RANDOM VERDICT
          ================================================== */}

      <div className="verdict">

        <p>
          “{verdict}”
        </p>

        <button
          type="button"
          onClick={() =>
            setVerdict(
              verdicts[
                Math.floor(
                  Math.random() *
                    verdicts.length
                )
              ]
            )
          }
        >
          ask the universe
        </button>

      </div>

    </section>
  );
}