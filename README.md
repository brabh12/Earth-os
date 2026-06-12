# 🌍 Earth OS | Planetary Intelligence Network

![Earth OS Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

> **"Translate Satellite Telemetry into Tactical Environmental Action."**

Earth OS is a high-performance, AI-powered "Planetary Operating System" designed to monitor, analyze, and mitigate environmental crises at a global scale. By bridging the gap between orbiting satellite data and ground-level coordination, Earth OS empowers NGOs, scientists, and volunteers to protect our biosphere through data-driven intelligence.

---

## 📽️ The Vision
Earth OS isn't just a dashboard; it's a **Command & Control center** for the planet's health. It replaces fragmented data with a unified intelligence loop:
1.  **Observe**: Live multi-spectral satellite imagery (Copernicus Sentinel-2).
2.  **Reason**: AI-generated intervention strategies tailored to specific regional contexts.
3.  **Act**: Field-based missions coordinated through a global network of volunteers.

---

## 🚀 Key Features

### 📡 Real-Time Planetary Map (Digital Twin)
A high-fidelity mapping interface using **Leaflet** with custom CartoDB Dark Matter styling.
*   **Copernicus Sentinel-2 Integration**: Direct WMS link to European Space Agency satellite archives.
*   **Anomaly Pulse Markers**: Real-time visualization of deforestation, water scarcity, and pollution hotspots.

### 🧠 Earth Intelligence Core (AI)
Powered by **OpenRouter (GPT-4o-mini)**, our AI translates raw telemetry into human-readable tactical plans:
*   **Deep Scan Protocols**: 3-stage intervention strategies generated on-the-fly.
*   **Impact Projections**: Estimated CO2 sequestration gains and recovery timelines.
*   **Resource Management**: AI-calculated logistics including personnel (Operatives) and specialized equipment.

### 🛡️ Mission Control & Verification
*   **Tactical Deployment**: Coordinate field missions and volunteer allocation.
*   **Verification Portal**: A "Proof of Impact" system where field reports are analyzed by AI to confirm successful restoration.
*   **PDF Intelligence Reports**: Automated generation of professional mission dossiers for stakeholders using `jspdf`.

### 🔐 Secure Uplink (Authentication)
*   Integrated **Supabase Auth** with role-based access (RBAC).
*   NASA-themed terminal-style notification system for secure sessions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Intelligence** | [OpenRouter AI](https://openrouter.ai/) (GPT-4o-mini) |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **Mapping** | [React-Leaflet](https://react-leaflet.js.org/) + OGC WMS (Sentinel Hub) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Visuals** | Custom CSS (Cyberpunk/Terminal Aesthetic) |

---

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/brabh12/Earth-os.git
cd earth-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to establish your first secure uplink.

---

## 📊 Project Structure

*   **/app**: Next.js App Router and API routes (AI generation, session management).
*   **/components**: Core UI units (EarthMap, Dashboard, Auth, Notification).
*   **/services**: Backend logic for anomaly simulation and data processing.
*   **/lib**: Shared utilities (Supabase client, PDF generator).
*   **/styles**: Global CSS and theme configuration.

---

## 🗺️ Roadmap: Towards Planetary Scale

1.  **NASA FIRMS Integration**: Real-time thermal anomaly detection for wildfire response.
2.  **IoT Ground Mesh**: Connecting soil moisture and air quality sensors directly to the AI reasoning layer.
3.  **Impact Marketplace**: Tokenizing verified CO2 offsets to fund local conservation teams.
