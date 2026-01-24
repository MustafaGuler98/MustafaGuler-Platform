#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="mustafa-prod-db"
DB_USER="mustafa"
DB_NAME="mustafa_platform"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M")
FILENAME="$BACKUP_DIR/mustafa_backup_$TIMESTAMP.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# 1. Create Backup
echo "[INFO] Starting backup for $DB_NAME..."

if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$FILENAME"; then
    echo "[SUCCESS] Backup created successfully: $FILENAME"
else
    echo "[ERROR] Backup failed!"
    exit 1
fi

# 2. Retention Policy (Delete backups older than 7 days)
echo "[INFO] Cleaning up old backups..."
find "$BACKUP_DIR" -type f -name "mustafa_backup_*.sql.gz" -mtime +7 -exec rm {} \;
echo "[INFO] Old backups cleaned."

# 3. Size Check
echo "[INFO] Backup size: $(du -h "$FILENAME" | cut -f1)"
echo "[Done]"
