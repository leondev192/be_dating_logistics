# Sử dụng Node.js phiên bản ổn định
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy file package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các dependencies
RUN yarn install

# Cài đặt NestJS CLI toàn cục để có thể sử dụng lệnh `nest`
RUN yarn global add @nestjs/cli

# Copy toàn bộ mã nguồn vào container
COPY . .

# Chạy lệnh prisma generate để cập nhật Prisma Client
RUN npx prisma generate

# Build ứng dụng NestJS sử dụng TypeScript
RUN yarn build

# Expose cổng ứng dụng
EXPOSE ${PORT}

# Chạy ứng dụng với môi trường phát triển
CMD ["yarn", "start:dev"]
