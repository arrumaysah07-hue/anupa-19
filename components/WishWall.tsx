"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Wish = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function WishWall() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishes = async () => {
      const { data, error: fetchError } =
        await supabase
          .from("wishes")
          .select("id, name, message, created_at")
          .order("created_at", {
            ascending: true,
          });

      if (fetchError) {
        console.error(
          "Couldn't load wishes:",
          fetchError
        );

        setError(
          "Couldn't load the birthday wishes."
        );
      } else {
        setWishes(data ?? []);
      }

      setLoading(false);
    };

    loadWishes();
  }, []);

  const submitWish = async () => {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Tell us your name first 😭");
      return;
    }

    if (!trimmedMessage) {
      setError(
        "You can't submit an empty wish 😭"
      );
      return;
    }

    if (trimmedName.length > 60) {
      setError(
        "Keep your name under 60 characters."
      );
      return;
    }

    if (trimmedMessage.length > 1000) {
      setError(
        "Keep your birthday message under 1000 characters."
      );
      return;
    }

    if (saving) return;

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      /*
       * Check the existing wishes first so the visitor
       * gets a friendly message instead of a database error.
       */
      const { data: existingWish, error: checkError } =
        await supabase
          .from("wishes")
          .select("id")
          .ilike("name", trimmedName)
          .limit(1)
          .maybeSingle();

      if (checkError) {
        throw new Error(
          "Couldn't check whether you've already submitted a wish."
        );
      }

      if (existingWish) {
        setError(
          "You've already left a birthday wish 💌 One wish per person!"
        );
        return;
      }

      const { data, error: databaseError } =
        await supabase
          .from("wishes")
          .insert({
            name: trimmedName,
            message: trimmedMessage,
          })
          .select(
            "id, name, message, created_at"
          )
          .single();

      if (databaseError || !data) {
        /*
         * The unique database index is the final
         * protection. This also handles two submissions
         * arriving at almost exactly the same time.
         */
        if (
          databaseError?.code === "23505"
        ) {
          throw new Error(
            "You've already left a birthday wish 💌 One wish per person!"
          );
        }

        throw new Error(
          databaseError?.message ||
            "Couldn't save your wish."
        );
      }

      setWishes((current) => [
        ...current,
        data,
      ]);

      setName("");
      setMessage("");
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (submitError) {
      console.error(
        "Couldn't submit wish:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Couldn't save your wish."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="wishes"
      className="wish-section"
    >
      <style jsx>{`
        .wish-section {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 90px 0 110px;
          color: #292827;
        }

        .heading {
          display: flex;
          gap: 15px;
          align-items: baseline;
          margin-bottom: 30px;
        }

        .number {
          color: #78956f;
          font-family: "DM Mono", monospace;
          font-size: 11px;
        }

        .heading h2 {
          margin: 0;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .intro {
          margin-bottom: 28px;
        }

        .intro h3 {
          margin: 0;
          font-family: "Kalam", cursive;
          font-size: 28px;
        }

        .intro p {
          margin: 5px 0 0;
          color: #706c66;
          font-size: 13px;
        }

        .wish-paper {
          position: relative;
          padding: 28px;
          background: #fffdf8;
          border: 1px solid #292827;
          box-shadow: 7px 8px 0 rgba(41, 40, 39, .12);
          transform: rotate(-.3deg);
        }

        .tape {
          position: absolute;
          top: -9px;
          right: 18%;
          width: 88px;
          height: 19px;
          background: rgba(120, 149, 111, .55);
          transform: rotate(3deg);
        }

        .form-label {
          display: block;
          margin-bottom: 7px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          color: #77736d;
          letter-spacing: .06em;
        }

        .name-input {
          width: 100%;
          box-sizing: border-box;
          border: 0;
          border-bottom: 1px solid #aaa39a;
          background: transparent;
          padding: 9px 3px;
          outline: none;
          font-family: "Kalam", cursive;
          font-size: 17px;
          margin-bottom: 20px;
        }

        .name-input:focus,
        .message-input:focus {
          border-color: #292827;
        }

        .message-input {
          width: 100%;
          min-height: 130px;
          box-sizing: border-box;
          resize: vertical;
          border: 1px dashed #aaa39a;
          background: #fffaf0;
          padding: 13px;
          outline: none;
          font-family: "Kalam", cursive;
          font-size: 16px;
          line-height: 1.5;
        }

        .form-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .character-count {
          color: #99938b;
          font-family: "DM Mono", monospace;
          font-size: 8px;
        }

        .submit {
          border: 1px solid #292827;
          background: #78956f;
          padding: 10px 16px;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          cursor: pointer;
        }

        .submit:disabled {
          opacity: .6;
          cursor: wait;
        }

        .saved {
          margin: 14px 0 0;
          color: #78956f;
          font-family: "Kalam", cursive;
          font-size: 16px;
        }

        .error {
          margin-top: 14px;
          padding: 10px;
          border: 1px solid #df7775;
          background: #f6dede;
          color: #713f3d;
          font-size: 12px;
        }

        .loading {
          margin-top: 35px;
          color: #77736d;
          font-family: "DM Mono", monospace;
          font-size: 8px;
        }

        .wish-wall {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 45px;
        }

        .wish-card {
          position: relative;
          padding: 22px 20px 20px;
          min-height: 145px;
          background: #f4e8e5;
          border: 1px solid #292827;
          box-shadow: 5px 6px 0 rgba(41, 40, 39, .1);
        }

        .wish-card:nth-child(3n + 1) {
          background: #f4e8e5;
          transform: rotate(-1.2deg);
        }

        .wish-card:nth-child(3n + 2) {
          background: #e8edf1;
          transform: rotate(.8deg);
        }

        .wish-card:nth-child(3n) {
          background: #ecefdf;
          transform: rotate(-.5deg);
        }

        .pin {
          position: absolute;
          top: 7px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #df7775;
        }

        .wish-message {
          margin: 9px 0 17px;
          font-family: "Kalam", cursive;
          font-size: 17px;
          line-height: 1.45;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .wish-name {
          margin: 0;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          color: #706c66;
        }

        .empty {
          margin-top: 40px;
          padding: 35px;
          text-align: center;
          border: 1px dashed #aaa39a;
          color: #77736d;
          font-family: "Kalam", cursive;
          font-size: 17px;
        }

        @media (max-width: 800px) {
          .wish-wall {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .wish-section {
            width: calc(100% - 24px);
            padding: 65px 0 80px;
          }

          .wish-paper {
            padding: 20px;
          }

          .wish-wall {
            grid-template-columns: 1fr;
          }

          .form-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .submit {
            width: 100%;
          }
        }
      `}</style>

      <div className="heading">
        <span className="number">
          05
        </span>

        <h2>
          Leave a little something.
        </h2>
      </div>

      <div className="intro">
        <h3>
          Say something nice. Or don't.
        </h3>

        <p>
          Birthday wishes, embarrassing memories,
          questionable advice — all accepted.
        </p>
      </div>

      <div className="wish-paper">
        <div className="tape" />

        <label className="form-label">
          YOUR NAME
        </label>

        <input
          className="name-input"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          placeholder="who are you?"
          maxLength={60}
          disabled={saving}
        />

        <label className="form-label">
          YOUR MESSAGE
        </label>

        <textarea
          className="message-input"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setError("");
          }}
          placeholder="Dear Anupa..."
          maxLength={1000}
          disabled={saving}
        />

        <div className="form-bottom">
          <span className="character-count">
            {message.length}/1000
          </span>

          <button
            type="button"
            className="submit"
            onClick={submitWish}
            disabled={saving}
          >
            {saving
              ? "checking..."
              : "leave it here →"}
          </button>
        </div>

        {saved && (
          <p className="saved">
            ✦ message successfully delivered.
          </p>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <p className="loading">
          loading the nice things people said...
        </p>
      )}

      {!loading && wishes.length === 0 && (
        <div className="empty">
          Be the first person to leave Anupa
          something here. 👀
        </div>
      )}

      {!loading && wishes.length > 0 && (
        <div className="wish-wall">
          {wishes.map((wish) => (
            <article
              className="wish-card"
              key={wish.id}
            >
              <span className="pin">
                ●
              </span>

              <p className="wish-message">
                {wish.message}
              </p>

              <p className="wish-name">
                — {wish.name}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}