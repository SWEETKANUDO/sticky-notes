import { useState, useEffect } from "react";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [togglingNote, setTogglingNote] = useState(null);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  function handleLogin(newToken, userData) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    setNotes([]);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setNotes([]);
    setTitle("");
    setDescription("");
    setError("");
  }

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token} `,
      },
    });

    if (response.status === 401) {
      handleLogout();
      throw new Error("Session expired. Please login again.");
    }

    return response;
  }

  async function getNotes() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/api/notes`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Notes load nahi hue.");
      }

      setNotes(data);
    } catch (err) {
      setError(err.message || "Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      getNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [token]);

  async function addNote(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }

    setAddingNote(true);

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const newNote = await response.json();

      if (!response.ok) {
        throw new Error(newNote.message || "Note add nahi hua.");
      }

      setNotes((oldNotes) => [...oldNotes, newNote]);
      setTitle("");
      setDescription("");
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingNote(false);
    }
  }

  async function delBtn(id) {
    setDeletingNote(id);

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Note delete nahi hua.");
      }

      setNotes((oldNotes) =>
        oldNotes.filter((note) => note._id !== id)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingNote(null);
    }
  }

  async function toggleNote(id, field) {
    const note = notes.find((item) => item._id === id);

    if (!note) return;

    setTogglingNote({ id, field });

    const updatedData = {
      title: note.title,
      description: note.description,
      isPinned: note.isPinned || false,
      isFavorite: note.isFavorite || false,
    };

    updatedData[field] = !updatedData[field];

    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const updatedNote = await response.json();

      if (!response.ok) {
        throw new Error(updatedNote.message || "Note update nahi hua.");
      }

      setNotes((oldNotes) =>
        oldNotes.map((item) =>
          item._id === id ? updatedNote : item
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingNote(null);
    }
  }

  const stickyColors = ["yellow", "blue", "green", "pink"];

  const filteredNotes = notes.filter((note) => {
    const title = note.title || "";
    const description = note.description || "";

    return (
      title.toLowerCase().includes(searchText.toLowerCase()) ||
      description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned)
  );

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-tape"></div>
      <div className="skeleton-heading">
        <div className="skeleton-title"></div>
        <div className="skeleton-actions"></div>
      </div>
      <div className="skeleton-content"></div>
      <div className="skeleton-footer"></div>
    </div>
  );

  const totalNotes = notes.length;

  const pinnedNotes = notes.filter(
    (note) => note.isPinned
  ).length;

  const favoriteNotes = notes.filter(
    (note) => note.isFavorite
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div>
            <h1>My Notes</h1>
            <p>Your ideas, all in one place</p>
          </div>
        </div>

        <div className="header-actions">
          <span className="note-count">
            {notes.length} Notes
          </span>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="main">
        <section className="form-card">
          <h2>✏️ Add a New Note</h2>

          <form onSubmit={addNote}>
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
            />

            <button className="add-btn" type="submit" disabled={addingNote}>
              {addingNote ? (
                <>
                  <span className="btn-spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Note
                </>
              )}
            </button>
          </form>
          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search notes by title or description..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

        </section>

        <section className="notes-section">
          <div className="stats-container">
            <div className="stat-card total-stat">
              <span className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <div>
                <h3>Total Notes</h3>
                <p>{totalNotes}</p>
              </div>
            </div>

            <div className="stat-card pinned-stat">
              <span className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="12" y1="17" x2="12" y2="22"></line>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                </svg>
              </span>
              <div>
                <h3>Pinned Notes</h3>
                <p>{pinnedNotes}</p>
              </div>
            </div>

            <div className="stat-card favorite-stat">
              <span className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </span>
              <div>
                <h3>Favorite Notes</h3>
                <p>{favoriteNotes}</p>
              </div>
            </div>
          </div>
          <div className="notes-title">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              My Notes
            </h2>
            {user && <span>Welcome, {user.name}</span>}
          </div>

          {loading ? (
            <div className="notes-grid">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="empty error-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button type="button" onClick={getNotes} className="retry-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Try Again
              </button>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <h3>No notes yet</h3>
              <p>Add your first note using the form!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {sortedNotes.map((note, index) => (
                <div
                  className={`note ${stickyColors[index % stickyColors.length]}`}
                  key={note._id}
                >
                  <div className="tape"></div>

                  <div className="note-heading">
                    <h3>{note.title}</h3>

                    <div className="note-actions">
                      <button
                        type="button"
                        className={
                          note.isPinned ? "active-pin" : "pin-btn"
                        }
                        onClick={() =>
                          toggleNote(note._id, "isPinned")
                        }
                        title="Pin note"
                        disabled={togglingNote?.id === note._id && togglingNote?.field === 'isPinned'}
                      >
                        {togglingNote?.id === note._id && togglingNote?.field === 'isPinned' ? (
                          <span className="btn-spinner small"></span>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <line x1="12" y1="17" x2="12" y2="22"></line>
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        className={
                          note.isFavorite
                            ? "active-favorite"
                            : "favorite-btn"
                        }
                        onClick={() =>
                          toggleNote(note._id, "isFavorite")
                        }
                        title="Favorite note"
                        disabled={togglingNote?.id === note._id && togglingNote?.field === 'isFavorite'}
                      >
                        {togglingNote?.id === note._id && togglingNote?.field === 'isFavorite' ? (
                          <span className="btn-spinner small"></span>
                        ) : (
                          <svg viewBox="0 0 24 24" fill={note.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <p>{note.description}</p>

                  <div className="note-footer">
                    <span>
                      {note.isPinned ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <line x1="12" y1="17" x2="12" y2="22"></line>
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                          </svg>
                          Pinned
                        </>
                      ) : (
                        "My Note"
                      )}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => delBtn(note._id)}
                      type="button"
                      disabled={deletingNote === note._id}
                    >
                      {deletingNote === note._id ? (
                        <span className="btn-spinner small"></span>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Made with ❤️ using MERN
      </footer>
    </div>
  );
}

export default App;