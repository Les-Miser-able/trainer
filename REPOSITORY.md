# Repository setup

This repository contains the Python trainer, tests, documentation, augmentation
scaffolding, PWA source, trained Keras checkpoints, their supporting metadata and
training results, existing browser model exports, and the MediaPipe hand detector.
Original recordings, prepared datasets, large split manifests, per-sample prediction
CSVs, browser vendor libraries, virtual environments, and editor settings stay local.
The PWA source lives in `pwa-sample/dist/`; do not ignore that entire folder.

Python implementation lives in `src/fsl_trainer`; the root Python files are
compatibility launchers. Raw inputs live in `data/raw`, prepared datasets in
`data/processed`, and disposable packed arrays in `data/cache`. Model architecture
code is separate from the detector binary in `assets` and checkpoints in `runs`.
See [README.md](README.md#portable-project-layout) for the complete layout.

For an older checkout, `tools/migrate_layout.ps1` performs a collision-checked
migration and compares file inventories. It supports `-DryRun` and does not
overwrite destinations. This working copy has already been migrated.

## Fresh clone on Windows

Install Python 3.12 and Node.js 22 or newer. From the repository root:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -e .
```

Add your own media to `data/raw/<category>/<gesture>/`, then prepare and train:

```powershell
.\.venv\Scripts\python.exe categories.py prepare --category family --datasets data/processed/augmented
.\.venv\Scripts\python.exe categories.py train --category family --datasets data/processed/augmented --run first
```

The MediaPipe hand model and existing trained checkpoints are included. Source
data must be supplied separately to prepare datasets or retrain on another machine.
Use a fresh output root/run name when existing outputs are present.

Included runs: `alphabet/{first,optimized,webcam_v2,augmented_v1}`,
`colors/{first,augmented_v1}`, and `family/augmented_v1`. Each checkpoint ships
with `classes.json` and `preprocessing.json` for prediction and browser export.
The PWA catalog currently selects the existing alphabet and colors exports;
including additional Keras checkpoints does not automatically select/export them.

## PWA setup

```powershell
cd pwa-sample
npm ci
npm run setup
npm start
```

Setup preserves the included catalog and exports. If no catalog exists, it creates
one with categories unavailable. To add the included family checkpoint, run from
the repository root:

```powershell
.\.venv\Scripts\python.exe pwa-sample/tools/export_model.py --category family --run runs/family/augmented_v1
```

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
appear, but trained checkpoints and browser exports should. Root-level npm manifests are legacy local files; use npm only inside
`pwa-sample/`.
