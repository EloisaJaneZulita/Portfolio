# Eloisa Jane Zulita: Portfolio

A single-page portfolio for English teaching and voice work.

## Add her files

Put files in the `assets` folder using **exactly** these names (or edit the names in `index.html`):

| What | Where | File name |
|---|---|---|
| Profile photo | `assets/images/` | `eloisa-profile.jpg` |
| Online class photo | `assets/images/` | `teaching-online.jpg` |
| In-person class photo | `assets/images/` | `teaching-inperson.jpg` |
| Hero voice sample (a short, best clip) | `assets/audio/` | `voice-sample.mp3` |
| Video 1 (narration) | `assets/videos/` | `narration-1.mp4` |
| Video 2 (voice-over) | `assets/videos/` | `voiceover-1.mp4` |
| Video 3 (voice-over) | `assets/videos/` | `voiceover-2.mp4` |
| TEFL certificate | `assets/images/` | `cert-tefl.jpg` |
| C2 Proficiency certificate | `assets/images/` | `cert-c2-proficiency.jpg` |
| Enhancing Communication with Remind certificate | `assets/images/` | `cert-communication.jpg` |
| Build a Free Website certificate | `assets/images/` | `cert-website.jpg` |
| Use Canva for Designs certificate | `assets/images/` | `cert-canva.jpg` |
| Video thumbnails (optional) | `assets/images/` | `video-1-poster.jpg`, `video-2-poster.jpg`, `video-3-poster.jpg` |

Tips:
- **Voice sample:** export a 30-60 second clip as MP3. This is the first thing visitors can play, so use her best one.
- **Profile photo:** portrait orientation (4:5) works best. It is shown in an arch shape.
- **Videos:** MP4 (H.264). Keep each under 25 MB if you can, since GitHub blocks files over 100 MB and large videos load slowly. Longer videos can be uploaded to YouTube instead and swapped in.
- Anything missing shows a tidy placeholder, so the site never looks broken.

## Awards carousel

The certificates scroll left to right on their own. Visitors can pause it with the Pause button, or by hovering over it (or tabbing into it on a keyboard). To add another certificate, copy one `<figure class="cert">` block inside `<div class="carousel-track">` in `index.html` and change the image name and title. The loop adjusts automatically.

## Night mode

The moon button in the top bar switches between day and night mode. The site remembers each visitor's choice.

## Add or remove a video

In `index.html`, find the `<div class="reel">` block. Each video is one `<figure class="reel-item">`. Copy one to add a video, delete one to remove it.

## Edit the words

Everything on the page is plain text in `index.html`. Search for the sentence you want to change.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `eloisa-portfolio`), set to **Public**.
2. Upload everything in this folder (`index.html`, `styles.css`, `script.js`, and the `assets` folder).
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, then Save.
5. After a minute or two, the site is live at `https://YOUR-USERNAME.github.io/eloisa-portfolio/`.

If you name the repository `YOUR-USERNAME.github.io`, the site lives at `https://YOUR-USERNAME.github.io/` with no extra path.
