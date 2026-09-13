"use client";

import { useState } from "react";

import BootScreen from "@/components/BootScreen";
import MemoryWall from "@/components/MemoryWall";
import DoodleWall from "@/components/DoodleWall";
import ChaosCorner from "@/components/ChaosCorner";
import WishWall from "@/components/WishWall";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boops, setBoops] = useState(0);

  const hamsterMessages = [
    "hi.",
    "okay?? 😭",
    "stop.",
    "rude.",
    "again?",
    "this is assault.",
    "i am pressing charges.",
    "fine, one last time okay? Happy Birthday Anupa!"
  ];

  const hamsterMessage =
    hamsterMessages[
      Math.min(boops, hamsterMessages.length - 1)
    ];

  if (!ready) {
    return (
      <BootScreen
        onComplete={() => setReady(true)}
      />
    );
  }

  return (
    <main className="scrapbook">

      {/* NAV */}

      <nav className="scrap-nav">

  <div className="nav-tape" />

  <div className="nav-brand">
    <span className="nav-brand-small">THE</span>
    <span className="nav-brand-main">ANUPA</span>
    <span className="nav-brand-number">19</span>
  </div>

  <div className="nav-tabs">

  <a
    href="#journal"
    className="nav-tab tab-coral"
  >
    <span>01</span>
    journal
  </a>

  <a
    href="#memories"
    className="nav-tab tab-blue"
  >
    <span>02</span>
    memories
  </a>

  <a
    href="#doodles"
    className="nav-tab tab-yellow"
  >
    <span>03</span>
    doodles
  </a>

  <a
    href="#wishes"
    className="nav-tab tab-sage"
  >
    <span>04</span>
    wishes
  </a>

  <a
    href="#surprises"
    className="nav-tab tab-coral"
  >
    <span>05</span>
    surprises
  </a>

</div>

  <div className="nav-doodle">
    ✦
  </div>

</nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-paper">

          <div className="hero-tape" />

          <div className="hero-topline">
            <span>
              BIRTHDAY FILE / 19
            </span>

            <span>
              ANUPA_19.EXE
            </span>
          </div>


          <div className="hero-content">

            {/* TEXT */}

            <div className="hero-copy">

              <p className="hero-eyebrow">
                OFFICIALLY TOO OLD FOR THIS
              </p>

              <h1>
                Happy Birthday,
                <br />
                <span>Anupa.</span>
              </h1>

              <div className="hero-scribble">
                nineteen looks suspiciously good on you.
              </div>

              <p className="hero-text">
                A tiny corner of the internet dedicated
                to one very colourful, slightly chaotic,
                deeply questionable human being.
              </p>

              <button
                className="main-button"
                type="button"
                onClick={() =>
                  document
                    .getElementById("journal")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                open the chaos →
              </button>

              <p className="micro-text">
                *Please keep all limbs inside the scrapbook.
              </p>

            </div>


            {/* INTERACTIVE HAMSTER */}

            <div className="hero-hamster-area">

              <div className="hero-sticker">
                19!!!
              </div>


              <button
                type="button"
                className={`hero-hamster-button ${
                  boops > 0 ? "booped" : ""
                }`}
                onClick={() =>
                  setBoops((current) => current + 1)
                }
                aria-label="Boop the birthday hamster"
              >

                <div className="hero-hamster">

                  <div className="hero-hamster-ear left" />
                  <div className="hero-hamster-ear right" />

                  <div className="hero-hamster-face">

                    <span className="hero-hamster-eye left" />
                    <span className="hero-hamster-eye right" />

                    <b>
                      {boops > 2 ? "⌣" : "◡"}
                    </b>

                  </div>

                  <div className="hero-hamster-body" />

                  {boops > 0 && (
                    <>
                      <span className="hamster-blush left" />
                      <span className="hamster-blush right" />
                    </>
                  )}

                </div>

              </button>


              <div
                className={`hero-hamster-note ${
                  boops > 0 ? "visible" : ""
                }`}
              >
                {hamsterMessage}
              </div>


              {boops > 0 && (
                <div className="boop-pop">
                  {boops === 1
                    ? "BOOP!"
                    : boops === 2
                    ? "HEY!"
                    : "😭"}
                </div>
              )}

              <p className="hamster-instruction">
                ↑ touch the hamster
              </p>

            </div>

          </div>


          <div className="hero-bottom-note">
            ↳ yes, this was necessary.
          </div>

        </div>

      </section>


      {/* JOURNAL */}

      <section
        id="journal"
        className="journal-section"
      >

        <div className="section-heading">

          <span>01</span>

          <h2>
            Okay, so...
          </h2>

        </div>


        <div className="journal-grid">

          <article className="note note-pink">

            <span className="pin">
              ●
            </span>

            <h3>
              You’re 19 now.
            </h3>

            <p>
              Which sounds extremely adult until
              you remember that absolutely nobody
              knows what they're doing.
            </p>

            <small>
              — official observation
            </small>

          </article>


          <article className="note note-blue">

            <span className="pin">
              ●
            </span>

            <h3>
              One year later...
            </h3>

            <p>
              Somehow we went from random college
              people to knowing an unreasonable
              amount about each other.
            </p>

            <small>
              suspicious, honestly.
            </small>

          </article>


          <article className="note note-yellow">

            <span className="pin">
              ●
            </span>

            <h3>
              Things I wish for you:
            </h3>

            <ul>
              <li>good people</li>
              <li>good food</li>
              <li>good sleep</li>
              <li>less nonsense</li>
              <li>more money</li>
            </ul>

            <small>
              especially the last one.
            </small>

          </article>

        </div>

      </section>


      {/* MEMORY WALL */}

      <MemoryWall />


      {/* DOODLE WALL */}

      <DoodleWall />


      {/* WISH WALL */}

      <WishWall />

      {/* SURPRISES */}

      <ChaosCorner />


      {/* TRANSITION */}

      <section className="little-note">

        <p>
          And yes...
        </p>

        <h3>
          we're still not done.
        </h3>

        <span>
          keep scrolling ↓
        </span>

      </section>


      {/* FINAL */}

      <section className="final-card">

        <div className="final-card-tape" />

        <p className="mini-label">
          END OF DOCUMENT™
        </p>

        <h2>
          Happy Birthday,
          <br />
          Anupa.
        </h2>

        <p className="final-message">
          Somehow you made it to 19.
          <br />
          And somehow we all survived the journey.
        </p>

        <div className="final-scribble">
          Meri Shanthipriya
        </div>

        <span className="final-arrow">
          ↗ now go eat cake
        </span>

      </section>

    </main>
  );
}