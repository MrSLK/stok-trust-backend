# Build
FROM node:22-alpine AS build
WORKDIR /
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn run build
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0" 
EXPOSE 8080
CMD [ "node", "dist/src/main.js"]