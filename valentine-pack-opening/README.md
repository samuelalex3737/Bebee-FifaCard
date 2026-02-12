# 💘 Valentine's Pack Opening

A cinematic **FIFA Ultimate Team–style** Valentine's Day card reveal. Built with pure HTML, CSS, and JavaScript — no frameworks needed.

> **99-Rated · Best Pull of My Life**

---

## 🎬 Experience Flow

1. **Dark cinematic intro** → "Tap to Open Pack"
2. **Pack shakes** → light rays build up intensity
3. **Pack explodes** → screen flash
4. **Rating "99" slams in** → position + flag flash
5. **Card reveal** with confetti & heart particles
6. **Stats animate** with count-up
7. **Romantic message** with floating hearts
8. **Easter egg** — tap the card for a secret 💎

---

## 🚀 Quick Start

Just open `index.html` in any modern browser. That's it!

```bash
# Or use a local server:
npx serve .
```

---

## ✏️ Personalize It

Open **`script.js`** and edit the `CONFIG` object at the top:

```js
const CONFIG = {
  girlfriendName: "AIMEE",            // Her name on the card
  message: "Your romantic message",  // Final screen text
  nationalityFlag: "🇧🇩",            // Emoji flag
  position: "ST",                    // Card position
  clubName: "My Heart FC",          // Club name
  rating: 99,                       // Card rating
  photoUrl: "",                     // Path to her photo
  secretMessage: "...",             // Easter egg text
  // ... stats, audio paths
};
```

### Adding Her Photo

1. Place her photo in `assets/images/` (e.g., `assets/images/player-photo.png`)
2. In `script.js`, set: `photoUrl: "assets/images/player-photo.png"`
3. Best size: **400×500px**, transparent/cropped background

### Adding Music

1. Find copyright-free music:
   - [Pixabay Music](https://pixabay.com/music/) — free, no attribution required
   - Search: "cinematic buildup", "epic reveal", "romantic piano"
2. Download `.mp3` files and place them in `assets/audio/`:
   - `buildup.mp3` — dramatic buildup (plays during pack shake)
   - `reveal.mp3` — epic reveal sound (plays on card reveal)
   - `background.mp3` — soft romantic loop (plays after reveal)
3. Audio starts on user interaction (browser-compliant)

---

## 🌍 Deploy to GitHub Pages

### Step 1: Create a Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `valentine-pack-opening` (or any name)
3. Set to **Public**
4. Click **Create repository**

### Step 2: Push Your Files

```bash
cd valentine-pack-opening
git init
git add .
git commit -m "💘 Valentine's Pack Opening"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/valentine-pack-opening.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes

### Step 4: Get Your Public URL

Your site will be live at:

```
https://YOUR_USERNAME.github.io/valentine-pack-opening/
```

### Optional: Custom Domain

1. In **Settings → Pages**, enter your custom domain
2. Add a `CNAME` file to your repo root with your domain
3. Configure DNS: `CNAME` record pointing to `YOUR_USERNAME.github.io`

---

## 📱 Mobile Support

- Fully responsive (tested on iPhone/Android viewports)
- Haptic vibration on card reveal (supported devices)
- Touch-optimized buttons and interactions

---

## 💎 Optional Enhancements

- **Easter Egg** ✅ — Tap the card for a secret message
- **Haptic Vibration** ✅ — Mobile buzz on reveal
- **Replay Button** ✅ — Open the pack again
- **Countdown to Valentine's Day** — Add a timer on the intro screen
- **Custom Background** — Add a photo behind the card

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Structure | HTML5 |
| Styling | Modern CSS (animations, gradients, glow) |
| Logic | Vanilla JavaScript |
| Particles | Canvas API |
| Fonts | Google Fonts (Orbitron + Inter) |
| Hosting | GitHub Pages |

---

Made with 💘
