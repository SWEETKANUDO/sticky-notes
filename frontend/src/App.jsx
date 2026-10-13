import { useState, useEffect } from "react";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
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
        "https://sticky-notes-a6wn.onrender.com/api/notes"
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

    try {
      const response = await apiRequest(
        "https://sticky-notes-a6wn.onrender.com/api/notes",
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
    }
  }

  async function delBtn(id) {
    try {
      const response = await apiRequest(
        `https://sticky-notes-a6wn.onrender.com/api/notes/${id}`,
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
    }
  }

  async function toggleNote(id, field) {
    const note = notes.find((item) => item._id === id);

    if (!note) return;

    const updatedData = {
      title: note.title,
      description: note.description,
      isPinned: note.isPinned || false,
      isFavorite: note.isFavorite || false,
    };

    updatedData[field] = !updatedData[field];

    try {
      const response = await apiRequest(
        `https://sticky-notes-a6wn.onrender.com/api/notes/${id}`,
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
          <span className="logo-icon">📝</span>
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
            <span>↪</span> Logout
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

            <button className="add-btn" type="submit">
              + Add Note
            </button>
          </form>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search notes by title or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

        </section>

        <section className="notes-section">
          <div className="stats-container">
            <div className="stat-card total-stat">
              <span className="stat-icon">📝</span>
              <div>
                <h3>Total Notes</h3>
                <p>{totalNotes}</p>
              </div>
            </div>

            <div className="stat-card pinned-stat">
              <span className="stat-icon">📌</span>
              <div>
                <h3>Pinned Notes</h3>
                <p>{pinnedNotes}</p>
              </div>
            </div>

            <div className="stat-card favorite-stat">
              <span className="stat-icon">⭐</span>
              <div>
                <h3>Favorite Notes</h3>
                <p>{favoriteNotes}</p>
              </div>
            </div>
          </div>
          <div className="notes-title">
            <h2>📒 My Notes</h2>
            {user && <span>Welcome, {user.name}</span>}
          </div>

          {loading ? (
            <p>Loading notes...</p>
          ) : error ? (
            <div className="empty">
              <p>{error}</p>
              <button type="button" onClick={getNotes}>
                Try Again
              </button>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty">
              <span>📭</span>
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
                      >
                        📌
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
                      >
                        {note.isFavorite ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>

                  <p>{note.description}</p>

                  <div className="note-footer">
                    <span>
                      {note.isPinned ? "📌 Pinned" : "My Note"}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => delBtn(note._id)}
                      type="button"
                    >
                      🗑️ Delete
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