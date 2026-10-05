# Data augmentation workspace

This is a folder scaffold for future augmentation work. No new transforms or
configuration loader are implemented yet.

```text
data/<category>/<gesture>/       Original images, videos, or landmark arrays
augmentation/
  configs/                      Future augmentation presets by category
  transforms/                   Future image, video, and landmark transforms
  tests/                        Future transform and integration tests
  previews/                     Generated before/after previews (ignored by Git)
  reports/                      Generated augmentation reports (ignored by Git)
datasets_augmented/             Separate prepared dataset output root
  <category>/                   Created by preparation, not pre-populated
    train/<gesture>/
    validation/<gesture>/
    test/<gesture>/
    manifest.json
    preprocessing.json
```

Keep original inputs in the existing `data/` folders. Do not put generated
variants beneath `data/`: preparation scans those folders for source samples.
Keep presets and implementation files here, outside the source-data tree.

## Existing augmentation

`trainer.py` already repeats static poses to 32 frames and applies Gaussian
landmark jitter. It assigns source groups to splits before creating variants;
the current implementation generates static variants in all three splits.
These existing options can write into the new output root now:

```powershell
python categories.py prepare --category alphabet --datasets datasets_augmented --static-variants 8 --jitter 0.0075
python categories.py train --category alphabet --datasets datasets_augmented --run augmented_v1
```

Preparation creates category folders itself and requires each category output
to be empty. For another experiment use a fresh root such as
`--datasets datasets_augmented/v2` for both commands. Training writes to the
existing `runs/<category>/<run>/` layout.

Successful preparation prints accepted original-source counts, augmented static
sequence counts, resampled video/sequence counts, and total output sequences,
plus totals per split and gesture. It also saves `augmentation_summary.json`
inside the prepared category folder. Rejected or ignored sources are excluded.
Eight static variants means eight outputs per static source, not nine; videos
and multi-frame landmark inputs each produce one resampled output, not new
augmented variants. Existing prepared datasets are not changed automatically.

## Future implementation

- Add transform implementations under `transforms/` and their tests under
  `tests/`. Put documented presets under `configs/` once a loader is implemented.
- Integrate new augmentation after source-group split assignment. Apply new
  random transforms to training samples only; keep evaluation preprocessing
  deterministic. Changing existing validation/test jitter is a separate code change.
- Preserve source/group identity in the dataset manifest so variants from one
  source or signer cannot cross splits. Record the seed and transform settings
  in preprocessing metadata.
- Preserve gesture labels, left/right slot conventions, binary presence flags,
  and zero coordinates for absent hands. Prepared arrays must remain `(32, 128)`.
- Write previews and reports under their respective folders using an experiment
  name, for example `previews/alphabet_v1/` and `reports/alphabet_v1/`.

The `.gitkeep` files retain empty directories in Git. Generated previews,
reports, and prepared datasets are ignored.
