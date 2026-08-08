FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
COPY ./requirements-render.txt /app/requirements-render.txt

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        g++ \
        libpq-dev \
 && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
# If a render-friendly requirements file exists, prefer it (smaller, avoids heavy ML builds).
RUN if [ -f /app/requirements-render.txt ]; then \
            pip install --no-cache-dir -r /app/requirements-render.txt ; \
        else \
            pip install --no-cache-dir -r /app/requirements.txt ; \
        fi

COPY . /app

EXPOSE 8000
ENV PORT=8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
