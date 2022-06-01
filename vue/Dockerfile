FROM alpine

# Working dir
WORKDIR /app
COPY . .

# Install dependence
RUN apk add nginx nodejs npm && \
    npm -g install pnpm && \
    pnpm install && \
    pnpm build

# Nginx config file
RUN echo "server {" > /etc/nginx/http.d/default.conf && \
    echo "  listen 80 default_server;" >> /etc/nginx/http.d/default.conf && \
    echo "  listen [::]:80 default_server;" >> /etc/nginx/http.d/default.conf && \
    echo "  location / {" >> /etc/nginx/http.d/default.conf && \
    echo "    root /app/dist;" >> /etc/nginx/http.d/default.conf && \
    echo "    try_files \$uri \$uri/ /index.html;" >> /etc/nginx/http.d/default.conf && \
    echo "    index index.html;" >> /etc/nginx/http.d/default.conf && \
    echo "  }" >> /etc/nginx/http.d/default.conf && \
    echo "}" >> /etc/nginx/http.d/default.conf

# Port
EXPOSE 80

ENTRYPOINT /usr/sbin/nginx -g "daemon off;"
