# Stage 1: Build mã nguồn React Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Cài đặt Nginx phục vụ production build
FROM nginx:alpine
# Sao chép thư mục dist đã build vào đúng thư mục root của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Xóa file cấu hình mặc định cũ của Nginx để tránh xung đột
RUN rm /etc/nginx/conf.d/default.conf
# Sao chép file cấu hình tùy chỉnh mới vào đúng vị trí
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]