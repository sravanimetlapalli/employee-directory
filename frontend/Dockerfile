# Builder Stage
# Base image
FROM node:18-alpine AS Builder

# workdir
WORKDIR /app

# copy and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# copy sourcecode
COPY . .

#Builds react app for production
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine AS Runtime

RUN rm /etc/nginx/conf.d/default.conf
# COPY Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy react build output
COPY --from=Builder /app/build /usr/share/nginx/html

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3\
     CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

