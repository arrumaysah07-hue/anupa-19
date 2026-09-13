"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Memory = {
  id: string;
  name: string;
  caption: string | null;
  image_path: string | null;
  hearts: number;
  created_at: string;
};

type Doodle = {
  id: string;
  name: string;
  image_path: string;
  created_at: string;
};

type Wish = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [memories, setMemories] = useState<Memory[]>([]);
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadArchive = async () => {
    setLoading(true);
    setError("");

    const [
      { data: memoryData, error: memoryError },
      { data: doodleData, error: doodleError },
      { data: wishData, error: wishError },
    ] = await Promise.all([
      supabase
        .from("memories")
        .select(
          "id, name, caption, image_path, hearts, created_at"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("doodles")
        .select("id, name, image_path, created_at")
        .order("created_at", { ascending: false }),

      supabase
        .from("wishes")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (memoryError) {
      console.error(memoryError);
      setError("Couldn't load the memory archive.");
    }

    if (doodleError) {
      console.error(doodleError);
      setError("Couldn't load the doodle archive.");
    }

    if (wishError) {
      console.error(wishError);
      setError("Couldn't load the wishes archive.");
    }

    setMemories(memoryData ?? []);
    setDoodles(doodleData ?? []);
    setWishes(wishData ?? []);

    setLoading(false);
  };

  const login = async () => {
    if (!password.trim()) {
      setError("Enter your admin password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/check-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError("Wrong admin password.");
        setLoading(false);
        return;
      }

      setAuthenticated(true);
      setPassword("");

      await loadArchive();
    } catch (loginError) {
      console.error(loginError);
      setError(
        "Couldn't connect to the admin server."
      );
    }

    setLoading(false);
  };

  const deleteMemory = async (memory: Memory) => {
    const confirmed = window.confirm(
      `Delete the memory submitted by ${memory.name}?\n\nThis will permanently remove the database entry AND the uploaded photo.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(memory.id);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/delete-memory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: memory.id,
            image_path: memory.image_path,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Deletion failed."
        );
      }

      setMemories((current) =>
        current.filter(
          (item) => item.id !== memory.id
        )
      );
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Couldn't delete that memory."
      );
    } finally {
      setDeleting(null);
    }
  };

  const deleteDoodle = async (doodle: Doodle) => {
    const confirmed = window.confirm(
      `Delete the doodle submitted by ${doodle.name}?\n\nThis will permanently remove the doodle from the scrapbook.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(doodle.id);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/delete-doodle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: doodle.id,
            image_path: doodle.image_path,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Deletion failed."
        );
      }

      setDoodles((current) =>
        current.filter(
          (item) => item.id !== doodle.id
        )
      );
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Couldn't delete that doodle."
      );
    } finally {
      setDeleting(null);
    }
  };

  const deleteWish = async (wish: Wish) => {
    const confirmed = window.confirm(
      `Delete the message submitted by ${wish.name}?\n\nThis will permanently remove the birthday wish from the scrapbook.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(wish.id);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/delete-wish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: wish.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Deletion failed."
        );
      }

      setWishes((current) =>
        current.filter(
          (item) => item.id !== wish.id
        )
      );
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Couldn't delete that wish."
      );
    } finally {
      setDeleting(null);
    }
  };

  if (!authenticated) {
    return (
      <main className="admin-page">
        <style jsx>{`
          .admin-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: #f5f0e7;
            color: #292827;
            font-family: Arial, sans-serif;
          }

          .login-card {
            width: min(430px, 100%);
            padding: 42px;
            background: #fffdf8;
            border: 1.5px solid #292827;
            box-shadow: 10px 11px 0 rgba(41, 40, 39, .13);
            transform: rotate(-.6deg);
          }

          .label {
            margin: 0 0 10px;
            font-size: 11px;
            letter-spacing: .12em;
            color: #77736d;
          }

          h1 {
            margin: 0 0 10px;
            font-size: 34px;
            letter-spacing: -.04em;
          }

          p {
            margin: 0 0 26px;
            color: #66615b;
            line-height: 1.5;
          }

          input {
            width: 100%;
            padding: 13px;
            border: 1px solid #aaa39a;
            background: #fff;
            outline: none;
            font-size: 15px;
            box-sizing: border-box;
          }

          input:focus {
            border-color: #292827;
          }

          button {
            width: 100%;
            margin-top: 14px;
            padding: 13px;
            border: 1.5px solid #292827;
            background: #df7775;
            cursor: pointer;
            font-weight: 700;
          }

          button:disabled {
            opacity: .6;
            cursor: wait;
          }

          .error {
            margin-top: 15px;
            padding: 10px;
            background: #f6dede;
            border: 1px solid #df7775;
            color: #713f3d;
            font-size: 13px;
          }
        `}</style>

        <div className="login-card">
          <p className="label">
            ANUPA 19 · PRIVATE AREA
          </p>

          <h1>Admin archive.</h1>

          <p>
            This is where you can remove memories,
            doodles and messages that shouldn't be
            on the scrapbook.
          </p>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                login();
              }
            }}
            placeholder="Admin password"
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={login}
            disabled={loading}
          >
            {loading
              ? "checking..."
              : "enter archive →"}
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          padding: 50px 24px 80px;
          background: #f5f0e7;
          color: #292827;
          font-family: Arial, sans-serif;
        }

        .admin-shell {
          width: min(1050px, 100%);
          margin: auto;
        }

        .header {
          margin-bottom: 45px;
        }

        .label {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: .12em;
          color: #77736d;
        }

        h1 {
          margin: 0 0 8px;
          font-size: clamp(34px, 5vw, 52px);
          letter-spacing: -.05em;
        }

        .subtitle {
          margin: 0;
          color: #66615b;
        }

        .section {
          margin-top: 55px;
        }

        .section:first-of-type {
          margin-top: 0;
        }

        .section-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
          border-bottom: 1px dashed #aaa39a;
          padding-bottom: 10px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -.03em;
        }

        .count {
          color: #77736d;
          font-size: 11px;
          letter-spacing: .08em;
        }

        .archive {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(250px, 1fr)
          );
          gap: 25px;
        }

        .card {
          background: #fffdf8;
          padding: 12px 12px 18px;
          border: 1px solid #292827;
          box-shadow: 7px 8px 0 rgba(41, 40, 39, .12);
        }

        .photo {
          width: 100%;
          aspect-ratio: 1 / .82;
          object-fit: cover;
          display: block;
          background: #eee7d8;
        }

        .doodle-photo {
          width: 100%;
          aspect-ratio: 1;
          object-fit: contain;
          display: block;
          background: #fffaf0;
        }

        .placeholder {
          width: 100%;
          aspect-ratio: 1 / .82;
          display: grid;
          place-items: center;
          background: #eee7d8;
          font-size: 35px;
        }

        .caption {
          margin: 14px 3px 6px;
          font-size: 17px;
          line-height: 1.4;
        }

        .name {
          margin: 0 3px;
          color: #77736d;
          font-size: 12px;
        }

        .date {
          margin: 7px 3px 15px;
          color: #99938b;
          font-size: 10px;
        }

        .delete {
          width: 100%;
          padding: 10px;
          margin-top: 15px;
          border: 1px solid #292827;
          background: #e77978;
          cursor: pointer;
          font-weight: 700;
        }

        .delete:disabled {
          opacity: .55;
          cursor: wait;
        }

        .doodle-delete {
          background: #d4a928;
        }

        .wish-delete {
          background: #78956f;
        }

        .wish-card {
          min-height: 180px;
          display: flex;
          flex-direction: column;
        }

        .wish-message {
          flex: 1;
          margin: 10px 3px 18px;
          font-family: "Kalam", cursive;
          font-size: 18px;
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .error {
          margin-bottom: 25px;
          padding: 12px;
          background: #f6dede;
          border: 1px solid #df7775;
          color: #713f3d;
          font-size: 13px;
        }

        .empty,
        .loading {
          padding: 50px;
          text-align: center;
          border: 1px dashed #aaa39a;
          color: #77736d;
        }

        @media (max-width: 600px) {
          .admin-page {
            padding: 30px 14px 60px;
          }

          .login-card {
            padding: 30px 24px;
          }

          .archive {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>

      <div className="admin-shell">
        <header className="header">
          <p className="label">
            ANUPA 19 · ADMIN ARCHIVE
          </p>

          <h1>Memory moderation.</h1>

          <p className="subtitle">
            Delete anything that shouldn't have
            made it into the scrapbook.
          </p>
        </header>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            OPENING ARCHIVE...
          </div>
        ) : (
          <>
            {/* MEMORIES */}

            <section className="section">
              <div className="section-heading">
                <h2>📸 Memory archive</h2>

                <span className="count">
                  {memories.length} submitted
                </span>
              </div>

              {memories.length === 0 ? (
                <div className="empty">
                  No submitted memories yet.
                </div>
              ) : (
                <div className="archive">
                  {memories.map((memory) => {
                    let imageUrl = "";

                    if (memory.image_path) {
                      imageUrl =
                        supabase.storage
                          .from("scrapbook-media")
                          .getPublicUrl(
                            memory.image_path
                          ).data.publicUrl;
                    }

                    return (
                      <article
                        className="card"
                        key={memory.id}
                      >
                        {imageUrl ? (
                          <img
                            className="photo"
                            src={imageUrl}
                            alt={
                              memory.caption ??
                              "Memory"
                            }
                          />
                        ) : (
                          <div className="placeholder">
                            📸
                          </div>
                        )}

                        <p className="caption">
                          {memory.caption ||
                            "No caption"}
                        </p>

                        <p className="name">
                          — {memory.name}
                        </p>

                        <p className="date">
                          {new Date(
                            memory.created_at
                          ).toLocaleString()}
                        </p>

                        <button
                          type="button"
                          className="delete"
                          disabled={
                            deleting === memory.id
                          }
                          onClick={() =>
                            deleteMemory(memory)
                          }
                        >
                          {deleting === memory.id
                            ? "deleting..."
                            : "delete this memory"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* DOODLES */}

            <section className="section">
              <div className="section-heading">
                <h2>🎨 Doodle archive</h2>

                <span className="count">
                  {doodles.length} submitted
                </span>
              </div>

              {doodles.length === 0 ? (
                <div className="empty">
                  No submitted doodles yet.
                </div>
              ) : (
                <div className="archive">
                  {doodles.map((doodle) => {
                    const imageUrl =
                      supabase.storage
                        .from("scrapbook-media")
                        .getPublicUrl(
                          doodle.image_path
                        ).data.publicUrl;

                    return (
                      <article
                        className="card"
                        key={doodle.id}
                      >
                        <img
                          className="doodle-photo"
                          src={imageUrl}
                          alt="Submitted doodle"
                        />

                        <p className="caption">
                          A questionable
                          masterpiece.
                        </p>

                        <p className="name">
                          — {doodle.name}
                        </p>

                        <p className="date">
                          {new Date(
                            doodle.created_at
                          ).toLocaleString()}
                        </p>

                        <button
                          type="button"
                          className="delete doodle-delete"
                          disabled={
                            deleting === doodle.id
                          }
                          onClick={() =>
                            deleteDoodle(doodle)
                          }
                        >
                          {deleting === doodle.id
                            ? "deleting..."
                            : "delete this doodle"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* WISHES */}

            <section className="section">
              <div className="section-heading">
                <h2>💌 Wishes archive</h2>

                <span className="count">
                  {wishes.length} submitted
                </span>
              </div>

              {wishes.length === 0 ? (
                <div className="empty">
                  No birthday wishes yet.
                </div>
              ) : (
                <div className="archive">
                  {wishes.map((wish) => (
                    <article
                      className="card wish-card"
                      key={wish.id}
                    >
                      <p className="wish-message">
                        “{wish.message}”
                      </p>

                      <p className="name">
                        — {wish.name}
                      </p>

                      <p className="date">
                        {new Date(
                          wish.created_at
                        ).toLocaleString()}
                      </p>

                      <button
                        type="button"
                        className="delete wish-delete"
                        disabled={
                          deleting === wish.id
                        }
                        onClick={() =>
                          deleteWish(wish)
                        }
                      >
                        {deleting === wish.id
                          ? "deleting..."
                          : "delete this wish"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}