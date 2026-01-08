FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN groupadd -r appuser 2>/dev/null || true && \
    useradd -r -g appuser appuser 2>/dev/null || true && \
    chown -R appuser:appuser /app 2>/dev/null || true

# Create data directories and HuggingFace cache directory with proper permissions
RUN mkdir -p /app/data/faiss_index /app/data/documents /app/models /home/appuser/.cache/huggingface && \
    chown -R appuser:appuser /app/data /app/models /home/appuser

USER appuser

# Expose port
EXPOSE 8001

# Health check - use curl instead of Python to avoid module loading issues
# Health check - use curl instead of Python to avoid module loading issues
HEALTHCHECK --interval=30s --timeout=10s --start-period=300s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8001/health || exit 1

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
