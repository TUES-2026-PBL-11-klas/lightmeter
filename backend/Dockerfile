# Build stage
FROM oven/bun:canary AS build

WORKDIR /app
COPY package.json bun.lock* ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY . .

RUN bun build ./src/index.ts \
    --outfile server \
    --target bun \
    --compile \
    --minify \
    --bytecode

# Deploy stage
FROM gcr.io/distroless/cc AS release

WORKDIR /app
COPY --from=build --chown=1000:1000 /app/server .

# has no /etc/passwd for resolving UID 
USER 1000
EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT [ "/app/server" ]