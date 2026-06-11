from openjdk:21-jdk-slim
env MYSQL_ROOT_PASSWORD=root
run apt-get update && apt-get install -y ffmpeg nginx && rm -rf /var/lib/apt/lists/*
copy nginx.conf /etc/nginx/nginx.conf
expose 80 443
cwd /app
entrypoint ["nginx", "-g", "daemon off;"]
