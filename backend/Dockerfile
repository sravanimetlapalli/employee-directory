# Here we are using multi-stage builds
# Stage 1: Builder
FROM python:3.11-slim AS Builder

# set a workdirectory on container
WORKDIR /app

# Install system dependencies needed for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# COPY and Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \ 
    pip install --no-cache-dir -r requirements.txt

# Stage 2 as Runtime
FROM python:3.11-slim AS Runtime

# set workdir
WORKDIR /app

# Install only system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# copy installed packages from builder
COPY --from=Builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=Builder /usr/local/bin /usr/local/bin

# Copy application code
COPY app/ ./app/
COPY migrations/ ./migrations/
COPY alembic.ini .

# create non-root user
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# expose port
EXPOSE 8000

# healthchecks
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# start FASTAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



