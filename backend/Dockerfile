# Sử dụng môi trường Node.js nhẹ (Alpine Linux)
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Cài đặt ffmpeg để xử lý video
RUN apk add --no-cache ffmpeg

# Copy file package.json vào trước để cài thư viện
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ code còn lại vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Lệnh chạy server
CMD ["node", "index.js"]