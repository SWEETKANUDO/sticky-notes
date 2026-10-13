# 📝 Sticky Notes — Your Ideas, Organized.

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-00C7A9?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  A modern, dark-themed sticky notes application built with the MERN stack.
  <br />
  Capture your thoughts, organize your notes, pin important ideas, and keep your productivity in one place.
</p>

<p align="center">
  <a href="https://sticky-notes-liart-tau.vercel.app/"><strong>🚀 Open Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/SWEETKANUDO/sticky-notes"><strong>💻 View Source Code</strong></a>
</p>

---

## ✨ About the Project

**Sticky Notes** is a full-stack web application designed to make note-taking simple, organized, and enjoyable.

With a clean dark interface and a sticky-note-inspired layout, users can manage their ideas, save important information, and access their notes from a deployed web application.

Whether you're collecting ideas, planning tasks, or writing quick reminders, Sticky Notes keeps everything organized.

## 🎯 Features

- 🔐 **User Authentication** — Sign up and log in to your account.
- 📝 **Create Notes** — Quickly add new notes.
- 🗑️ **Delete Notes** — Remove notes you no longer need.
- 📌 **Pin Notes** — Keep important notes easy to find.
- ⭐ **Favorite Notes** — Mark your favorite notes for quick access.
- 🔍 **Search Notes** — Find notes using search.
- 📊 **Dashboard Statistics** — Get an overview of your notes.
- 🌙 **Dark UI** — Enjoy a modern, dark sticky-notes design.
- 📱 **Responsive Design** — Use the app on desktop, tablet, and mobile.
- ☁️ **Full-Stack Integration** — Connect the React frontend to the Express API and MongoDB database.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| CSS3 | Styling and responsive layout |
| Node.js | JavaScript runtime |
| Express.js | Backend API and routing |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| REST API | Frontend and backend communication |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Git & GitHub | Version control |

## 🌐 Live Application

| Service | Link |
|---|---|
| 🚀 Live Frontend | [Open Sticky Notes](https://sticky-notes-liart-tau.vercel.app/) |
| ⚙️ Backend API | [Open Backend](https://sticky-notes-a6wn.onrender.com/) |
| 💻 GitHub Repository | [View Source Code](https://github.com/SWEETKANUDO/sticky-notes) |

## 📸 Application Preview

<p align="center">
  <i>Add a screenshot of your actual application here to showcase the UI.</i>
</p>

<!-- To display a screenshot, upload it to your repository and replace the path below. -->
<!-- Example: ![Sticky Notes Dashboard](./screenshots/dashboard.png) -->

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/SWEETKANUDO/sticky-notes.git
```

```bash
cd sticky-notes
```

### 2. Set Up the Backend

Open the backend folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Replace the placeholder values with your own MongoDB connection string and a secure JWT secret. **Never upload your real `.env` file to GitHub.**

Start the backend using the start script defined in your `package.json`. For example:

```bash
npm start
```

If your project uses a development script, you can use:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a new terminal and navigate to your frontend folder (the folder containing the React/Vite `package.json`):

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Make sure the frontend uses this variable as the API base URL and appends the appropriate endpoint paths.

Start the development server:

```bash
npm run dev
```

Open the local URL shown in your terminal.

> **Note:** If your frontend directory has a different name, use that directory instead. Your backend must be running, MongoDB must be reachable, and the API URL must match your backend configuration.

## 📁 Project Structure

A typical structure for this application may look like this:

```text
sticky-notes/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

*The structure above is an example. Adjust it to match the actual folders and files in your repository.*

## 🔒 Security Notes

- Keep MongoDB credentials and JWT secrets private.
- Store sensitive backend configuration in environment variables.
- Never commit `.env` files containing real credentials.
- Ensure users can only access and modify their own notes.
- Configure CORS to allow your deployed frontend to communicate with the backend.

## 💡 What I Learned

Building this project helped me practice:

- Developing a full-stack application using the MERN stack.
- Creating REST API endpoints with Express.js.
- Connecting a Node.js backend to MongoDB using Mongoose.
- Implementing authentication and protected user data.
- Managing frontend state and API requests in React.
- Building a responsive dark-themed user interface.
- Deploying the frontend and backend separately.

## 🔮 Future Improvements

- 📅 Note reminders and due dates.
- 🎨 Custom note colors and themes.
- 📤 Export notes to PDF or text.
- 🔄 Sort notes by date or category.
- 🌐 Rich-text editing support.

## 👨‍💻 Developer

**Mihir Bhuva**

Aspiring Full Stack Developer | MERN Stack Learner

- 🌐 Portfolio: [Visit My Portfolio](https://mihir-bhuva-portfolio.vercel.app/)
- 💻 GitHub: [@SWEETKANUDO](https://github.com/SWEETKANUDO)
- 🔗 LinkedIn: [Connect with Me](https://www.linkedin.com/in/mihir-bhuva-5422562b9)

---

<p align="center">
  <strong>💭 Capture your thoughts. Organize your world.</strong>
  <br />
  Built with ❤️ using the MERN Stack.
</p>

<p align="center">
  ⭐ If you like this project, consider giving the repository a star!
</p>
