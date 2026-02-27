FROM oven/bun:1.1.18-alpine AS build

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

FROM gcr.io/distroless/cc-debian12:nonroot AS release

WORKDIR /app
COPY --from=build --chown=65532:65532 /app/server .

USER 65532:65532
EXPOSE 3000
ENV NODE_ENV=production \
    PORT=3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
    CMD ["/app/server", "healthcheck"]

ENTRYPOINT ["/app/server"]

FROM oven/bun:1.1.18-alpine AS migrate

WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .

ENTRYPOINT ["bunx", "drizzle-kit", "push", "--force"]
