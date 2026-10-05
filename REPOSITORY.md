# Repository setup

This repository contains the Python trainer, tests, documentation, augmentation
scaffolding, and PWA application source. Original recordings, prepared datasets,
training runs, downloaded hand models, exported browser models, browser vendor
libraries, virtual environments, and local editor settings stay out of Git.
The PWA source lives in `pwa-sample/dist/`; do not ignore that entire folder.

## Fresh clone on Windows

Install Python 3.12 and Node.js 22 or newer. From the repository root:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Add your own media to `data/<category>/<gesture>/`, then prepare and train:

```powershell
.\.venv\Scripts\python.exe categories.py prepare --category family --datasets datasets_augmented
.\.venv\Scripts\python.exe categories.py train --category family --datasets datasets_augmented --run first
```

The MediaPipe hand model downloads during raw-media preparation. Source data and
trained checkpoints must be supplied separately when moving to another machine.
Use a fresh output root/run name when existing outputs are present.

## PWA setup

```powershell
cd pwa-sample
npm ci
npm run setup
cd ..
.\.venv\Scripts\python.exe pwa-sample/tools/export_model.py --category family --run runs/family/first
cd pwa-sample
npm start
```

Setup creates a catalog with all categories unavailable if no catalog exists;
it preserves existing exports. Export each trained category you want to use.
Open http://localhost:8080. For website deployment, publish the complete local
`pwa-sample/dist/` after setup and export, including its Git-ignored assets.

## Verification

```powershell
.\.venv\Scripts\python.exe -m unittest discover -v
cd pwa-sample
npm test
npm run parity
```

Run the PWA tests after setup. Model integrity checks and parity require exported
models; an empty catalog cannot validate a trained model's predictions.

## First push

Create an empty repository with your Git hosting provider, then from this root:

```powershell
git status --short
git diff --cached --stat
git commit -m "Initial FSL trainer and PWA"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with your repository's clone URL. Before committing,
check the staged file list; original media and generated datasets should not
appear. Root-level npm manifests are legacy local files; use npm only inside
`pwa-sample/`.
