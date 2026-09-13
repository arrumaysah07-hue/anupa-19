"use client";

import { ChangeEvent, useState } from "react";

type Memory = {
  id: number;
  image: string;
  name: string;
  caption: string;
  rotation: number;
  hearts: number;
};

const starterMemories: Memory[] = [
  {
    id: 1,
    image: "",
    name: "Anonymous witness",
    caption: "Proof that we occasionally behave normally.",
    rotation: -2.2,
    hearts: 3,
  },
  {
    id: 2,
    image: "",
    name: "The committee",
    caption: "No context will be provided. Figure it out.",
    rotation: 1.5,
    hearts: 5,
  },
  {
    id: 3,
    image: "",
    name: "Someone who knows too much",
    caption: "19 years of Anupa. Humanity survived.",
    rotation: -1.2,
    hearts: 2,
  },
];

export default function MemoryWall() {
  const [memories, setMemories] =
    useState<Memory[]>(starterMemories);

  const [showUploader, setShowUploader] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [name, setName] = useState("");

  const [caption, setCaption] = useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [hearted, setHearted] =
    useState<number[]>([]);

  const [dragging, setDragging] =
    useState(false);


  /* -------------------------------------------------------
     PHOTO
     ------------------------------------------------------- */

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("That isn't a photo 😭");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("That photo is HUGE. Keep it under 8MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };


  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };


  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };


  /* -------------------------------------------------------
     SUBMIT
     ------------------------------------------------------- */

  const submitMemory = () => {
    if (!selectedImage) {
      alert("We need the actual photo first. 😭");
      return;
    }

    if (!name.trim()) {
      alert("At least tell us who you are.");
      return;
    }

    if (!caption.trim()) {
      alert(
        "Every photograph deserves some unnecessary commentary."
      );
      return;
    }

    const newMemory: Memory = {
      id: Date.now(),
      image: selectedImage,
      name: name.trim(),
      caption: caption.trim(),
      rotation: Math.random() * 5 - 2.5,
      hearts: 0,
    };

    setMemories((current) => [
      ...current,
      newMemory,
    ]);

    setName("");
    setCaption("");
    setSelectedImage(null);
    setSubmitted(true);
  };


  /* -------------------------------------------------------
     HEART
     ------------------------------------------------------- */

  const toggleHeart = (id: number) => {
    const alreadyHearted =
      hearted.includes(id);

    setHearted((current) =>
      alreadyHearted
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );

    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              hearts: Math.max(
                0,
                memory.hearts +
                  (alreadyHearted ? -1 : 1)
              ),
            }
          : memory
      )
    );
  };


  /* -------------------------------------------------------
     REMOVE
     ------------------------------------------------------- */

  const removeMemory = (id: number) => {
    if (
      !window.confirm(
        "Remove this memory from the scrapbook?"
      )
    ) {
      return;
    }

    setMemories((current) =>
      current.filter(
        (memory) => memory.id !== id
      )
    );
  };


  /* -------------------------------------------------------
     CLOSE
     ------------------------------------------------------- */

  const closeUploader = () => {
    setShowUploader(false);
    setSubmitted(false);
    setSelectedImage(null);
    setName("");
    setCaption("");
    setDragging(false);
  };


  return (
    <section
      id="memories"
      className="mw-root"
    >

      <style jsx>{`

        /* =================================================
           MEMORY WALL
           ================================================= */

        .mw-root {
          position: relative;
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 110px 0 130px;
          color: #292827;
          font-family: "Manrope", sans-serif;
        }

        .mw-root * {
          box-sizing: border-box;
        }


        /* =================================================
           HEADING
           ================================================= */

        .mw-heading {
          display: flex;
          align-items: baseline;
          gap: 18px;
          margin-bottom: 38px;
        }

        .mw-number {
          font-family: "DM Mono", monospace;
          font-size: 13px;
          color: #df7775;
          letter-spacing: .08em;
        }

        .mw-heading h2 {
          margin: 0;
          font-size: clamp(34px, 4vw, 52px);
          line-height: .98;
          letter-spacing: -.045em;
          font-weight: 800;
        }


        /* =================================================
           INTRO
           ================================================= */

        .mw-intro {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          padding: 30px 34px;
          margin-bottom: 52px;
          background: #dce7ef;
          border: 1.5px solid #292827;
          transform: rotate(-.35deg);
          box-shadow: 8px 9px 0 rgba(41,40,39,.12);
        }

        .mw-intro::before {
          content: "";
          position: absolute;
          width: 86px;
          height: 22px;
          background: rgba(232,195,91,.72);
          top: -11px;
          left: 80px;
          transform: rotate(-3deg);
        }

        .mw-intro-copy {
          max-width: 620px;
        }

        .mw-eyebrow {
          margin: 0 0 9px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          letter-spacing: .12em;
          color: #6f6b65;
        }

        .mw-intro h3 {
          margin: 0 0 10px;
          font-family: "Kalam", cursive;
          font-size: clamp(27px, 3vw, 38px);
          line-height: 1;
          font-weight: 700;
        }

        .mw-intro p {
          margin: 0;
          color: #55514c;
          font-size: 15px;
          line-height: 1.6;
        }


        /* =================================================
           ADD BUTTON
           ================================================= */

        .mw-add {
          flex: 0 0 auto;
          border: 1.5px solid #292827;
          background: #e77978;
          color: #292827;
          padding: 14px 20px;
          font-family: "DM Mono", monospace;
          font-size: 12px;
          letter-spacing: .04em;
          cursor: pointer;
          box-shadow: 4px 5px 0 rgba(41,40,39,.18);
          transform: rotate(1.2deg);
          transition:
            transform .18s ease,
            box-shadow .18s ease;
        }

        .mw-add:hover {
          transform:
            rotate(-1deg)
            translateY(-2px);
          box-shadow: 6px 7px 0 rgba(41,40,39,.18);
        }


        /* =================================================
           POLAROIDS
           ================================================= */

        .mw-wall {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 42px 28px;
          align-items: start;
        }

        .mw-polaroid {
          position: relative;
          background: #fffdf8;
          padding: 13px 13px 19px;
          border: 1px solid #292827;
          box-shadow:
            8px 10px 0 rgba(41,40,39,.12);
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .mw-polaroid:hover {
          transform:
            rotate(0deg)
            translateY(-6px) !important;
          box-shadow:
            10px 15px 0 rgba(41,40,39,.15);
          z-index: 3;
        }

        .mw-tape {
          position: absolute;
          width: 66px;
          height: 18px;
          background: rgba(231,197,102,.72);
          top: -10px;
          left: 50%;
          transform:
            translateX(-50%)
            rotate(-2deg);
          z-index: 3;
        }

        .mw-photo {
          width: 100%;
          aspect-ratio: 1 / .82;
          object-fit: cover;
          display: block;
          background: #eee7d8;
        }

        .mw-placeholder {
          width: 100%;
          aspect-ratio: 1 / .82;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #f1d8d5,
              #e4edf3
            );
          font-size: 38px;
        }

        .mw-caption {
          margin: 17px 4px 5px;
          font-family: "Kalam", cursive;
          font-size: 19px;
          line-height: 1.18;
        }

        .mw-name {
          margin: 0 4px;
          color: #77736d;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          letter-spacing: .05em;
        }


        /* =================================================
           MEMORY ACTIONS
           ================================================= */

        .mw-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 13px;
        }

        .mw-heart {
          border: 0;
          background: transparent;
          padding: 3px 6px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #77736d;
          font-family: "DM Mono", monospace;
          font-size: 12px;
          cursor: pointer;
          transition:
            transform .15s ease,
            color .15s ease;
        }

        .mw-heart:hover {
          transform: scale(1.08);
          color: #df7775;
        }

        .mw-heart.liked {
          color: #df6666;
        }

        .mw-heart-icon {
          font-size: 20px;
          line-height: 1;
        }

        .mw-delete {
          border: 0;
          background: transparent;
          color: #aaa39a;
          cursor: pointer;
          font-size: 18px;
        }

        .mw-delete:hover {
          color: #df6666;
        }


        /* =================================================
           EMPTY CARD
           ================================================= */

        .mw-empty {
          min-height: 330px;
          border: 1.5px dashed #aaa39a;
          background: rgba(255,253,248,.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          color: #55514c;
          transform: rotate(1.5deg);
          transition:
            transform .2s ease,
            background .2s ease;
        }

        .mw-empty:hover {
          transform:
            rotate(-1deg)
            translateY(-4px);
          background: #fffdf8;
        }

        .mw-empty span {
          font-family: "DM Mono", monospace;
          font-size: 10px;
          letter-spacing: .1em;
        }

        .mw-empty strong {
          font-family: "Kalam", cursive;
          font-size: 25px;
        }

        .mw-empty b {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-top: 8px;
          border: 1.5px solid #292827;
          border-radius: 50%;
          background: #e8c35b;
          font-size: 25px;
          font-weight: 400;
        }


        /* =================================================
           MODAL
           ================================================= */

        .mw-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 25px;
          background: rgba(34,33,32,.66);
          backdrop-filter: blur(5px);
          animation: mwFade .2s ease;
        }

        @keyframes mwFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }


        /* =================================================
           SCRAPBOOK PAPER
           ================================================= */

        .mw-modal {
          position: relative;
          width: min(650px, 100%);
          max-height: calc(100vh - 50px);
          overflow-y: auto;
          padding: 40px 44px 44px;
          background: #fffaf0;
          border: 1.5px solid #292827;
          box-shadow:
            13px 15px 0 rgba(0,0,0,.18);
          transform:
            rotate(-.7deg);
          animation: mwPaper .28s ease;
        }

        .mw-modal::before {
          content: "";
          position: absolute;
          inset: 13px;
          border: 1px dashed #d9cdbd;
          pointer-events: none;
        }

        .mw-modal::after {
          content: "";
          position: absolute;
          width: 120px;
          height: 25px;
          top: -13px;
          left: 50%;
          background: rgba(232,195,91,.78);
          transform:
            translateX(-50%)
            rotate(2deg);
          pointer-events: none;
        }

        @keyframes mwPaper {
          from {
            opacity: 0;
            transform:
              translateY(15px)
              rotate(-2deg)
              scale(.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              rotate(-.7deg)
              scale(1);
          }
        }


        /* =================================================
           CLOSE
           ================================================= */

        .mw-close {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 4;
          width: 32px;
          height: 32px;
          border: 1.5px solid #292827;
          border-radius: 50%;
          background: #e77978;
          color: #292827;
          font-size: 19px;
          line-height: 1;
          cursor: pointer;
        }

        .mw-close:hover {
          transform: rotate(8deg);
        }


        /* =================================================
           MODAL TEXT
           ================================================= */

        .mw-modal-content {
          position: relative;
          z-index: 2;
        }

        .mw-modal-label {
          margin: 0 0 9px;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          letter-spacing: .13em;
          color: #6e6a64;
        }

        .mw-modal-title {
          margin: 0;
          font-size: clamp(30px, 5vw, 43px);
          line-height: 1;
          letter-spacing: -.04em;
          font-weight: 800;
        }

        .mw-modal-subtitle {
          margin: 13px 0 25px;
          color: #66615b;
          font-family: "Kalam", cursive;
          font-size: 18px;
          line-height: 1.3;
        }


        /* =================================================
           PHOTO DROP
           ================================================= */

        .mw-drop {
          position: relative;
          min-height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 23px;
          padding: 24px;
          border: 1.5px dashed #aaa39a;
          background: #f4eadb;
          cursor: pointer;
          transition:
            border-color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .mw-drop:hover,
        .mw-drop.dragging {
          background: #f6dede;
          border-color: #df7775;
          transform: rotate(.5deg);
        }

        .mw-drop input {
          display: none;
        }

        .mw-camera {
          font-size: 30px;
          line-height: 1;
        }

        .mw-drop strong {
          font-family: "Kalam", cursive;
          font-size: 23px;
          font-weight: 700;
        }

        .mw-drop small {
          color: #77736d;
          font-family: "DM Mono", monospace;
          font-size: 9px;
          letter-spacing: .04em;
        }


        /* =================================================
           PREVIEW
           ================================================= */

        .mw-preview-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 23px;
        }

        .mw-preview {
          width: 190px;
          padding: 9px 9px 15px;
          background: white;
          border: 1px solid #292827;
          box-shadow: 5px 7px 0 rgba(41,40,39,.13);
          transform: rotate(-2deg);
        }

        .mw-preview img {
          display: block;
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }

        .mw-preview-caption {
          margin: 9px 0 0;
          text-align: center;
          font-family: "Kalam", cursive;
          font-size: 14px;
        }

        .mw-change {
          display: block;
          margin: 11px auto 0;
          border: 0;
          background: transparent;
          text-decoration: underline;
          font-family: "DM Mono", monospace;
          font-size: 9px;
          cursor: pointer;
        }


        /* =================================================
           FORM
           ================================================= */

        .mw-field {
          display: block;
          margin-bottom: 17px;
        }

        .mw-field span {
          display: block;
          margin-bottom: 6px;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          letter-spacing: .1em;
          color: #625e58;
        }

        .mw-input {
          width: 100%;
          border: 0;
          border-bottom: 1.5px solid #aaa39a;
          outline: 0;
          padding: 9px 3px;
          background: transparent;
          color: #292827;
          font-family: "Kalam", cursive;
          font-size: 18px;
        }

        .mw-input:focus {
          border-color: #df7775;
        }

        .mw-input::placeholder {
          color: #aaa39a;
        }

        .mw-textarea {
          min-height: 72px;
          resize: vertical;
        }


        /* =================================================
           SUBMIT
           ================================================= */

        .mw-submit {
          width: 100%;
          margin-top: 5px;
          padding: 14px 18px;
          border: 1.5px solid #292827;
          background: #df7775;
          color: #292827;
          font-family: "DM Mono", monospace;
          font-size: 11px;
          letter-spacing: .04em;
          cursor: pointer;
          box-shadow: 4px 5px 0 rgba(41,40,39,.16);
          transition:
            transform .18s ease,
            box-shadow .18s ease;
        }

        .mw-submit:hover {
          transform: translateY(-2px);
          box-shadow: 6px 7px 0 rgba(41,40,39,.16);
        }


        /* =================================================
           SUCCESS
           ================================================= */

        .mw-success {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 45px 15px 30px;
        }

        .mw-success-sticker {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
          border: 1.5px solid #292827;
          border-radius: 50%;
          background: #9eb69e;
          font-size: 29px;
          transform: rotate(-8deg);
        }

        .mw-success h2 {
          margin: 5px 0 10px;
          font-size: 30px;
          letter-spacing: -.03em;
        }

        .mw-success p {
          max-width: 400px;
          margin: 0 auto 20px;
          color: #66615b;
          line-height: 1.6;
        }


        /* =================================================
           MOBILE
           ================================================= */

        @media (max-width: 760px) {

          .mw-root {
            width: min(
              100% - 24px,
              620px
            );
            padding: 75px 0 90px;
          }

          .mw-heading {
            gap: 11px;
            margin-bottom: 25px;
          }

          .mw-heading h2 {
            font-size: 31px;
          }

          .mw-intro {
            display: block;
            padding: 25px 22px;
            margin-bottom: 35px;
          }

          .mw-add {
            margin-top: 20px;
          }

          .mw-wall {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 0 8px;
          }

          .mw-polaroid {
            max-width: 390px;
            width: 100%;
            margin: auto;
          }

          .mw-empty {
            min-height: 220px;
            max-width: 390px;
            width: 100%;
            margin: auto;
          }

          .mw-overlay {
            padding: 13px;
          }

          .mw-modal {
            padding: 34px 23px 27px;
            max-height: calc(100vh - 26px);
          }

          .mw-modal::before {
            inset: 9px;
          }

          .mw-modal-title {
            font-size: 32px;
          }

        }

      `}</style>


      {/* =================================================
          HEADING
          ================================================= */}

      <div className="mw-heading">

        <span className="mw-number">
          02
        </span>

        <h2>
          The memory wall.
        </h2>

      </div>


      {/* =================================================
          INTRO
          ================================================= */}

      <div className="mw-intro">

        <div className="mw-intro-copy">

          <p className="mw-eyebrow">
            THE ANUPA ARCHIVES · OPEN TO THE PUBLIC
          </p>

          <h3>
            Have photographic evidence?
          </h3>

          <p>
            Put your favourite picture with Anupa
            in here. Future historians will
            definitely need it.
          </p>

        </div>

        <button
          type="button"
          className="mw-add"
          onClick={() =>
            setShowUploader(true)
          }
        >
          + pin a memory
        </button>

      </div>


      {/* =================================================
          WALL
          ================================================= */}

      <div className="mw-wall">

        {memories.map((memory) => {

          const isHearted =
            hearted.includes(memory.id);

          return (

            <article
              className="mw-polaroid"
              key={memory.id}
              style={{
                transform:
                  `rotate(${memory.rotation}deg)`,
              }}
            >

              <div className="mw-tape" />

              {memory.image ? (

                <img
                  src={memory.image}
                  alt={memory.caption}
                  className="mw-photo"
                />

              ) : (

                <div className="mw-placeholder">
                  📸
                </div>

              )}

              <p className="mw-caption">
                {memory.caption}
              </p>

              <p className="mw-name">
                — {memory.name}
              </p>


              <div className="mw-actions">

                <button
                  type="button"
                  className={`mw-heart ${
                    isHearted
                      ? "liked"
                      : ""
                  }`}
                  onClick={() =>
                    toggleHeart(memory.id)
                  }
                >

                  <span className="mw-heart-icon">
                    {isHearted
                      ? "♥"
                      : "♡"}
                  </span>

                  {memory.hearts}

                </button>


                {memory.image && (

                  <button
                    type="button"
                    className="mw-delete"
                    onClick={() =>
                      removeMemory(memory.id)
                    }
                    aria-label="Remove memory"
                  >
                    ×
                  </button>

                )}

              </div>

            </article>

          );
        })}


        {/* EMPTY SPACE */}

        <button
          type="button"
          className="mw-empty"
          onClick={() =>
            setShowUploader(true)
          }
        >

          <span>
            THERE'S AN EMPTY SPACE
          </span>

          <strong>
            might as well pin something.
          </strong>

          <b>
            +
          </b>

        </button>

      </div>


      {/* =================================================
          UPLOAD MODAL
          ================================================= */}

      {showUploader && (

        <div
          className="mw-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeUploader();
            }

          }}
        >

          <div className="mw-modal">

            <button
              type="button"
              className="mw-close"
              onClick={closeUploader}
              aria-label="Close"
            >
              ×
            </button>


            {!submitted ? (

              <div className="mw-modal-content">

                <p className="mw-modal-label">
                  MEMORY #??? · ANUPA ARCHIVES
                </p>

                <h2 className="mw-modal-title">
                  Got a memory?
                </h2>

                <p className="mw-modal-subtitle">
                  Put it where it belongs.
                  <br />
                  Somewhere between cute and incriminating.
                </p>


                {/* PHOTO */}

                {selectedImage ? (

                  <div className="mw-preview-wrap">

                    <div className="mw-preview">

                      <img
                        src={selectedImage}
                        alt="Selected memory"
                      />

                      <p className="mw-preview-caption">
                        future Anupa will see this.
                      </p>

                    </div>

                  </div>

                ) : (

                  <label
                    className={`mw-drop ${
                      dragging
                        ? "dragging"
                        : ""
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() =>
                      setDragging(false)
                    }
                    onDrop={handleDrop}
                  >

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                    />

                    <span className="mw-camera">
                      📸
                    </span>

                    <strong>
                      Drop a photo here
                    </strong>

                    <span
                      style={{
                        fontFamily:
                          "Manrope, sans-serif",
                        fontSize: "13px",
                        color: "#77736d",
                      }}
                    >
                      or click to choose one
                    </span>

                    <small>
                      JPG · PNG · WEBP · max 8MB
                    </small>

                  </label>

                )}


                {selectedImage && (

                  <button
                    type="button"
                    className="mw-change"
                    onClick={() =>
                      setSelectedImage(null)
                    }
                  >
                    choose a different photo
                  </button>

                )}


                {/* NAME */}

                <label className="mw-field">

                  <span>
                    WHO ARE YOU?
                  </span>

                  <input
                    className="mw-input"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Your name..."
                    maxLength={50}
                  />

                </label>


                {/* CAPTION */}

                <label className="mw-field">

                  <span>
                    WHAT'S GOING ON HERE?
                  </span>

                  <textarea
                    className="mw-input mw-textarea"
                    value={caption}
                    onChange={(event) =>
                      setCaption(
                        event.target.value
                      )
                    }
                    placeholder="This was the day..."
                    maxLength={180}
                  />

                </label>


                <button
                  type="button"
                  className="mw-submit"
                  onClick={submitMemory}
                >
                  ✎ caption it & pin it →
                </button>

              </div>

            ) : (

              <div className="mw-success">

                <div className="mw-success-sticker">
                  ✓
                </div>

                <p className="mw-modal-label">
                  ARCHIVE UPDATED
                </p>

                <h2>
                  It's officially in.
                </h2>

                <p>
                  Your photograph has been
                  pinned to the Anupa Archives.
                  History has been made.
                </p>

                <button
                  type="button"
                  className="mw-submit"
                  onClick={closeUploader}
                >
                  back to the scrapbook →
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </section>
  );
}