# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install libvips dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    automake \
    autoconf \
    libtool \
    gtk-doc-tools \
    glib2.0-dev \
    librsvg2-dev \
    libexpat1-dev \
    libjpeg-dev \
    libexif-dev \
    libgif-dev \
    liborc-0.4-dev \
    libpng-dev \
    libpoppler-glib-dev \
    librsvg2-dev \
    libwebp-dev \
    libtiff-dev \
    libgsf-1-dev \
    libxml2-dev \
    libfftw3-dev \
    liblcms2-dev \
    libimagequant-dev \
    libmatio-dev \
    libopenslide-dev \
    libcfitsio-dev \
    libmagickcore-dev \
    libopenslide-dev \
    liborc-0.4-dev \
    libavformat-dev \
    libheif-dev \
    libde265-dev \
    libde265-examples \
    libraw-dev \
    pkg-config \
    libglib2.0-dev \
    libjpeg-turbo8-dev \
    libtiff5-dev \
    libgsf-1-dev \
    libvips \
    libheif-examples && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src/index.ts .
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]