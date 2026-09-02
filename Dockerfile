# ─────────────────────────────────────────────────────────────
# Stage 1: Build frontend
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . ./

ENV NODE_ENV=production

RUN pnpm run build


# ─────────────────────────────────────────────────────────────
# Stage 2: Build ngx_brotli using Chainguard/Wolfi
# ─────────────────────────────────────────────────────────────
FROM cgr.dev/chainguard/nginx:latest-dev AS brotli-builder

USER root

RUN apk update && apk add --no-cache \
    gcc \
    make \
    cmake \
    git \
    wget \
    brotli-dev \
    brotli-static \
    pcre2-dev \
    zlib-dev \
    openssl-dev \
    glibc-dev

WORKDIR /build

RUN set -eux; \
    NGINX_VERSION="$(nginx -v 2>&1 | sed 's|.*/||')"; \
    echo "Building ngx_brotli for Nginx ${NGINX_VERSION}"; \
    \
    wget -q \
        "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz"; \
    \
    tar -xzf \
        "nginx-${NGINX_VERSION}.tar.gz"; \
    \
    git clone \
        --depth 1 \
        --recurse-submodules \
        https://github.com/google/ngx_brotli.git; \
    \
    cd /build/ngx_brotli/deps/brotli; \
    \
    mkdir out; \
    cd out; \
    \
    cmake \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
        -DBROTLI_BUILD_TESTS=OFF \
        -DBROTLI_BUILD_TOOLS=OFF \
        ..; \
    \
    make -j"$(nproc)"; \
    \
    cd "/build/nginx-${NGINX_VERSION}"; \
    \
    ./configure \
        --with-compat \
        --add-dynamic-module=/build/ngx_brotli; \
    \
    make modules; \
    \
    mkdir -p /brotli-modules; \
    \
    cp objs/ngx_http_brotli_filter_module.so \
        /brotli-modules/; \
    \
    cp objs/ngx_http_brotli_static_module.so \
        /brotli-modules/


# ─────────────────────────────────────────────────────────────
# Stage 3: Minimal Chainguard runtime
# ─────────────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────────────
# Stage 3: Minimal Chainguard runtime
# ─────────────────────────────────────────────────────────────
FROM cgr.dev/chainguard/nginx:latest AS release

# Brotli Nginx modules
COPY --from=brotli-builder \
    /brotli-modules/ \
    /usr/lib/nginx/modules/

# Brotli runtime libraries
COPY --from=brotli-builder \
    /usr/lib/libbrotlienc.so.1.2.0 \
    /usr/lib/

COPY --from=brotli-builder \
    /usr/lib/libbrotlienc.so.1 \
    /usr/lib/

COPY --from=brotli-builder \
    /usr/lib/libbrotlicommon.so.1.2.0 \
    /usr/lib/

COPY --from=brotli-builder \
    /usr/lib/libbrotlicommon.so.1 \
    /usr/lib/

# Frontend
COPY --from=frontend-builder \
    /app/dist \
    /usr/share/nginx/html

# Nginx configuration
COPY nginx-main.conf \
    /etc/nginx/nginx.conf

COPY nginx.conf \
    /etc/nginx/conf.d/default.conf

EXPOSE 80
