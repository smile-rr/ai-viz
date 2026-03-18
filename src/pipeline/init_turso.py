"""Initialize Turso database tables — run once to set up the schema."""

import sys
from pathlib import Path

# Ensure project root is on sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv

load_dotenv(PROJECT_ROOT / ".env")

from src.db.turso import TursoSync


def main():
    print("=== Initializing Turso Database ===\n")
    try:
        turso = TursoSync()
        turso.connect()
        turso.init_tables()
        turso.close()
        print("\nAll tables created successfully.")
    except Exception as e:
        print(f"\nFailed to initialize Turso: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
