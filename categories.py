"""Compatibility launcher; implementation lives in src/fsl_trainer."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from fsl_trainer.categories import main

if __name__ == "__main__":
    main()
