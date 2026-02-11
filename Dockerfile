# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app
COPY . .

# Install system libraries required by OpenCV and Rembg
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Pre-download the AI model
RUN python -c "from rembg import new_session; new_session('u2net')"

# Start the application
CMD uvicorn backend.api.main:app --host 0.0.0.0 --port ${PORT:-8080}