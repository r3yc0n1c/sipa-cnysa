Intall MinIO
```sh
docker pull minio/minio
mkdir -p ~/minio/data
```

Start MinIO deployment
```sh
docker run -d \
   -p 9000:9000 \
   -p 9001:9001 \
   -v ~/minio/data:/data \
   -e "MINIO_ROOT_USER=admin" \
   -e "MINIO_ROOT_PASSWORD=admin123" \
   minio/minio server /data --console-address ":9001"
```

Intall MinIO
```sh
docker pull redis
```

Start Redis
```sh
docker run -itd -p 6379:6379 redis
```