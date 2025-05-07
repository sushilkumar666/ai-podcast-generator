# 🎙️ AI Podcast Generator

A full-stack web app that generates podcast scripts and converts them into realistic audio using AI.

> Enter a topic → Get a script → Listen to the podcast → Repeat.  
> Built with React + Express + Gemini Pro + ElevenLabs.

---

## 🚀 Live Demo


[Demo Video](https://drive.google.com/file/d/1FhMf553XpOIhGqV5JZh-Crqf0AJNIYYS/view)

---

## 📦 Features

- 🧠 **Script Generation** using Google Gemini 1.5 flash
- 🗣️ **Voice Generation** using Deepgram API
- 🧾 **Script Display** in clean UI
- 🎧 **Audio Playback** with history tracking
- ⚙️ Full-stack app with frontend + backend integration

---

## 🛠️ Tech Stack

### Frontend:
- React (TypeScript)
- Tailwind CSS
- Axios

### Backend:
- Express.js
- Gemini SDK (gemini-1.5-flash)
- Deepgram API
- Node.js

---

## 📁 Folder Structure

```bash
ai-podcast-generator/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── public/audio/         # Stores generated audio files
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── PodcastForm.tsx
│   └── index.tsx


This project was built as part of a technical assignment for Vomychat via Internshala.
 The goal was to build a production-ready AI-driven solution — and I chose to create a podcast generator using modern generative tools.
