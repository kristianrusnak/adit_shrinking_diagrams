# Backend Environment Setup (without Docker)

The backend is built with FastAPI and Uvicorn. Follow the steps below to run it locally without Docker.

## Prerequisites

- [Python 3.11](https://www.python.org/downloads/) or newer (3.12 is also supported)
- [pip](https://pip.pypa.io/) (comes with Python)

Optional but recommended:

- [virtualenv](https://virtualenv.pypa.io/) or the built-in `venv` module for isolated environments

Verify your Python installation:

```bash
python3 --version
pip --version
```

## Create and activate a virtual environment

From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
```

## Install dependencies

With the virtual environment active, install the required packages:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs FastAPI, Uvicorn, and other utilities listed in `requirements.txt`.

## Apply database migrations

This project uses SQLite and Alembic for database migrations.
The database file (app.db) is not stored in Git, so each developer must create it locally.
After installing dependencies, from the repository root run:

```bash
cd backend
alembic upgrade head
```

This will:
- create the local app.db database
- apply all migration files from alembic/versions/
- create all tables (including users)
- add the default admin user if a migration exists for it

If you ever switch branches and see database-related errors (e.g. “no such table: users”), simply reset the database:

```bash
rm app.db
alembic upgrade head
```

## Run the development server

Start the FastAPI application with Uvicorn:

```bash
uvicorn AppPage.main:AppPage --reload --host 0.0.0.0 --port 8000
```

- The `--reload` flag enables auto-reload when files change.
- Visit http://localhost:8000/docs for the interactive API documentation.

Leave the terminal open while developing. Stop the server with `Ctrl+C`.

## Running tests

If you add backend tests, you can run them (with the virtual environment activated) using:

```bash
pytest
```

Install `pytest` first if it is not already part of your development dependencies:

```bash
pip install pytest
```

## Deactivating the virtual environment

When you are done working on the backend, deactivate the virtual environment with:

```bash
deactivate
```

## Creating a New Migration (when adding new tables or fields)

If you modify SQLAlchemy models (for example, add a new table or add a new column), you must create a new Alembic migration and apply it.
Follow these steps:

### 1. Make your changes in the models

Edit or create a model inside:
```
backend/app/models/
```
Example: create a new table Project in project.py.

### 2. Generate a new migration file
From the backend directory:
```
cd backend
alembic revision --autogenerate -m "add Project table"
```
Alembic will compare your models with the current database and create a migration file under:
```
backend/alembic/versions/
```

### 3. Review the migration file
Open the generated file and verify that:
- the new table creation is included
- or new columns appear correctly
- no unexpected operations were added

### 4. Apply the migration
After confirming the migration looks correct, run:
```
alembic upgrade head
```
This updates your local app.db with the new table.
