# AR Menu — Frontend (Next.js 14)

## Requirements
- Node.js 18+
- npm or yarn

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
copy .env.local.example .env.local      # Windows
# cp .env.local.example .env.local      # macOS/Linux
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start development server
```bash
npm run dev
```

App runs at **http://localhost:3000**

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Restaurant owner login |
| `/register` | Restaurant owner registration |
| `/dashboard` | Overview stats & recent orders |
| `/dashboard/menu` | Add / edit / delete menu items, upload images & 3D models |
| `/dashboard/orders` | Real-time order board with status controls |
| `/dashboard/settings` | Restaurant profile, logo & QR code download |
| `/menu/[restaurantId]` | **Customer-facing AR menu** (public, no login) |

## AR Feature

The customer menu page at `/menu/[id]` uses Google's
[`<model-viewer>`](https://modelviewer.dev/) web component to render 3D
food models.

- On **Android** — opens Scene Viewer AR mode.
- On **iOS** — opens Apple's Quick Look AR mode.
- On **desktop** — renders the 3D model in-browser with orbit controls.

3D models must be in `.glb` or `.gltf` format and are uploaded by the
restaurant owner from the Menu dashboard.

## Build for production
```bash
npm run build
npm start
```
