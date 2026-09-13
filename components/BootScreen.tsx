"use client";

import { useEffect, useState } from "react";

type BootScreenProps = {
  onComplete: () => void;
};

export default function BootScreen({
  onComplete,
}: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + Math.floor(Math.random() * 7) + 4;

        if (next >= 100) {
          window.clearInterval(timer);

          window.setTimeout(() => {
            onComplete();
          }, 500);

          return 100;
        }

        return next;
      });
    }, 90);

    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <>
      <style>{`
        .anupa-boot {
          position: fixed;
          inset: 0;
          z-index: 999999;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;
          box-sizing: border-box;

          background:
            radial-gradient(circle at 15% 20%, #efaaa5 0 7%, transparent 25%),
            radial-gradient(circle at 88% 78%, #9fb8cc 0 8%, transparent 28%),
            #f7f0e5;

          overflow: hidden;

          color: #292827;
        }

        .anupa-boot *,
        .anupa-boot *::before,
        .anupa-boot *::after {
          box-sizing: border-box;
        }

        .boot-card {
          position: relative;

          width: min(620px, 92vw);

          padding: 28px 32px 24px;

          background: #fffdf8;

          border: 1.5px solid #292827;

          box-shadow:
            8px 9px 0 rgba(41,40,39,.14);

          transform: rotate(-1deg);

          animation: boot-arrive .6s ease both;
        }

        .boot-card::before {
          content: "";

          position: absolute;

          inset: 10px;

          border: 1px dashed #d8d0c3;

          pointer-events: none;
        }

        .boot-inner {
          position: relative;
          z-index: 2;
        }

        .boot-tape {
          position: absolute;

          width: 95px;
          height: 21px;

          top: -11px;
          left: 50%;

          transform:
            translateX(-50%)
            rotate(-2deg);

          background: rgba(224,185,79,.75);
        }

        .boot-header {
          display: flex;
          justify-content: space-between;

          padding-bottom: 14px;

          border-bottom: 1px dashed #d8d0c3;

          font-family: monospace;

          font-size: 9px;

          letter-spacing: .1em;

          color: #77736d;
        }

        .boot-title {
          padding: 35px 10px 28px;
        }

        .boot-eyebrow {
          margin: 0 0 9px;

          font-family: monospace;

          font-size: 9px;

          letter-spacing: .14em;

          color: #d57972;
        }

        .boot-title h1 {
          margin: 0;

          max-width: 500px;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: clamp(34px, 6vw, 55px);

          line-height: .91;

          letter-spacing: -.07em;

          font-weight: 800;
        }

        .boot-title h1 em {
          display: inline-block;

          margin-left: 7px;

          color: #d57972;

          font-family: Georgia, serif;

          font-size: .82em;

          transform: rotate(-7deg);
        }

        .boot-hand {
          margin-top: 16px;

          font-family: cursive;

          font-size: 21px;

          transform: rotate(-3deg);

          color: #77736d;
        }

        .boot-loading {
          padding: 0 10px;
        }

        .boot-loading-row {
          display: flex;
          justify-content: space-between;

          margin-bottom: 7px;

          font-family: monospace;

          font-size: 8px;

          color: #77736d;
        }

        .boot-bar {
          height: 12px;

          border: 1px solid #292827;

          background: #eee7da;

          overflow: hidden;
        }

        .boot-bar-fill {
          height: 100%;

          background:
            linear-gradient(
              90deg,
              #d57972,
              #e0b94f,
              #8faeca
            );

          transition: width .1s linear;
        }

        .boot-items {
          display: flex;
          flex-wrap: wrap;

          gap: 7px;

          margin-top: 18px;
        }

        .boot-item {
          padding: 5px 8px;

          font-family: monospace;

          font-size: 7px;

          border: 1px solid #292827;

          background: #f1d5d0;
        }

        .boot-item:nth-child(2) {
          background: #d8e2eb;
        }

        .boot-item:nth-child(3) {
          background: #ead47b;
        }

        .boot-item:nth-child(4) {
          background: #d5e0d0;
        }

        .boot-footer {
          margin: 20px 10px 0;

          font-family: cursive;

          font-size: 15px;

          color: #77736d;
        }

        /* little scraps */

        .boot-scrap {
          position: absolute;

          padding: 13px 15px;

          border: 1px solid #292827;

          box-shadow: 4px 5px 0 rgba(41,40,39,.12);

          font-family: cursive;

          z-index: 2;
        }

        .boot-scrap.one {
          left: 7%;

          top: 18%;

          background: #efaaa5;

          font-size: 18px;

          transform: rotate(-8deg);
        }

        .boot-scrap.two {
          right: 7%;

          top: 22%;

          background: #ead47b;

          font-size: 15px;

          transform: rotate(7deg);
        }

        .boot-scrap.three {
          left: 9%;

          bottom: 15%;

          background: #d8e2eb;

          font-size: 14px;

          transform: rotate(5deg);
        }

        .boot-star {
          position: absolute;

          color: #d57972;

          font-size: 28px;

          animation: boot-float 1.4s ease-in-out infinite alternate;
        }

        .boot-star.one {
          right: 13%;
          bottom: 17%;
        }

        .boot-star.two {
          left: 17%;
          top: 10%;
          font-size: 18px;
          animation-delay: .3s;
        }

        /* hamster */

        .boot-hamster {
          position: absolute;

          right: 10%;
          bottom: 10%;

          width: 110px;
          height: 120px;

          animation: hamster-hop 1.3s ease-in-out infinite;
        }

        .hamster-ear {
          position: absolute;

          top: 13px;

          width: 31px;
          height: 31px;

          border: 2px solid #292827;

          border-radius: 50%;

          background: #c4aa8b;
        }

        .hamster-ear.left {
          left: 11px;
        }

        .hamster-ear.right {
          right: 11px;
        }

        .hamster-face {
          position: absolute;

          left: 20px;
          top: 27px;

          width: 70px;
          height: 65px;

          border: 2px solid #292827;

          border-radius: 48%;

          background: #c4aa8b;

          z-index: 2;
        }

        .hamster-eye {
          position: absolute;

          top: 24px;

          width: 6px;
          height: 8px;

          border-radius: 50%;

          background: #292827;
        }

        .hamster-eye.left {
          left: 19px;
        }

        .hamster-eye.right {
          right: 19px;
        }

        .hamster-face b {
          position: absolute;

          left: 28px;
          bottom: 6px;

          font-family: cursive;

          font-size: 17px;
        }

        .hamster-body {
          position: absolute;

          left: 20px;
          bottom: 0;

          width: 70px;
          height: 51px;

          border: 2px solid #292827;

          border-radius: 50% 50% 35% 35%;

          background: #b89e80;
        }

        .hamster-note {
          position: absolute;

          left: -30px;
          top: 2px;

          font-family: cursive;

          font-size: 13px;

          color: #77736d;

          transform: rotate(-8deg);
        }

        @keyframes boot-arrive {
          from {
            opacity: 0;
            transform:
              translateY(12px)
              rotate(-1deg);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              rotate(-1deg);
          }
        }

        @keyframes boot-float {
          from {
            transform: translateY(0) rotate(-5deg);
          }

          to {
            transform: translateY(-7px) rotate(6deg);
          }
        }

        @keyframes hamster-hop {
          0%, 100% {
            transform: rotate(3deg) translateY(0);
          }

          50% {
            transform: rotate(-3deg) translateY(-5px);
          }
        }

        @media (max-width: 700px) {
          .anupa-boot {
            padding: 14px;
          }

          .boot-card {
            width: 94vw;
            padding: 23px 20px 20px;
          }

          .boot-title {
            padding: 29px 5px 23px;
          }

          .boot-title h1 {
            font-size: 35px;
          }

          .boot-scrap {
            display: none;
          }

          .boot-hamster {
            right: 3%;
            bottom: 4%;
            transform: scale(.72);
          }

          .boot-star.one {
            right: 7%;
            bottom: 7%;
          }
        }

        @media (max-width: 430px) {
          .boot-header {
            font-size: 7px;
          }

          .boot-title h1 {
            font-size: 30px;
          }

          .boot-hand {
            font-size: 17px;
          }

          .boot-hamster {
            display: none;
          }
        }
      `}</style>

      <div className="anupa-boot">

        <div className="boot-scrap one">
          19!!!
        </div>

        <div className="boot-scrap two">
          birthday
          <br />
          business
        </div>

        <div className="boot-scrap three">
          please wait...
          <br />
          she's worth it.
        </div>

        <span className="boot-star one">
          ✦
        </span>

        <span className="boot-star two">
          ✧
        </span>

        <div className="boot-card">

          <div className="boot-tape" />

          <div className="boot-inner">

            <div className="boot-header">
              <span>ANUPA_19</span>
              <span>SCRAPBOOK.EXE</span>
            </div>

            <div className="boot-title">

              <p className="boot-eyebrow">
                INITIALISING SOMETHING UNNECESSARY
              </p>

              <h1>
                preparing the
                <br />
                birthday chaos
                <em>♥</em>
              </h1>

              <div className="boot-hand">
                because a normal birthday card
                would've been too easy.
              </div>

            </div>

            <div className="boot-loading">

              <div className="boot-loading-row">
                <span>
                  assembling scrapbook...
                </span>

                <strong>
                  {progress}%
                </strong>
              </div>

              <div className="boot-bar">
                <div
                  className="boot-bar-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="boot-items">
                <span className="boot-item">
                  ✓ memories
                </span>

                <span className="boot-item">
                  ✓ nonsense
                </span>

                <span className="boot-item">
                  ✓ cake
                </span>

                <span className="boot-item">
                  ✓ hamster
                </span>
              </div>

            </div>

            <p className="boot-footer">
              {progress >= 100
                ? "okay. let the chaos begin."
                : "please wait. we're doing important nonsense."}
            </p>

          </div>

        </div>

        <div className="boot-hamster">

          <div className="hamster-ear left" />
          <div className="hamster-ear right" />

          <div className="hamster-face">

            <span className="hamster-eye left" />
            <span className="hamster-eye right" />

            <b>◡</b>

          </div>

          <div className="hamster-body" />

          <span className="hamster-note">
            hi.
          </span>

        </div>

      </div>
    </>
  );
}