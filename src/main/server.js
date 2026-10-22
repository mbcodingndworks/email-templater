// server.js
const { protocol, net } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const SCHEME = 'app'; 
const RENDERER_DIR = path.join(__dirname, '../renderer');
const LIBS_DIR = path.join(__dirname, '../libs');

protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);


const MIME_OVERRIDES = {
  '.js': 'text/javascript',
};

function resolveSafe(baseDir, relativePath) {
  const filePath = path.normalize(path.join(baseDir, relativePath));
  if (!filePath.startsWith(baseDir)) return null; // blocca ../../
  return filePath;
}

async function serveFile(filePath) {
  try {
    const response = await net.fetch(pathToFileURL(filePath).toString());
    const override = MIME_OVERRIDES[path.extname(filePath)];
    if (override) {
      const headers = new Headers(response.headers);
      headers.set('content-type', override);
      return new Response(response.body, { status: response.status, headers });
    }
    return response;
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}

const RENDERER_ROUTES = {
  '/': 'application.html',
  '/application.html': 'application.html',
  '/epreview.html': 'epreview.html',
  '/settings.html': 'settings.html',
  '/application.js': 'application.js',
  '/strings.js': 'strings.js',
  '/bootstrap.js': 'bootstrap.js',
};

const LIB_ROUTES = {
  '/css.worker.bundle.js': 'css.worker.bundle.js',
  '/editor.worker.bundle.js': 'editor.worker.bundle.js',
  '/html.worker.bundle.js': 'html.worker.bundle.js',
  '/libs.renderer.bundle.js': 'libs.renderer.bundle.js',
};

function registerAppProtocol() {
  protocol.handle(SCHEME, (request) => {
    const { pathname } = new URL(request.url);
    const relativePath = decodeURIComponent(pathname);

    if (relativePath in RENDERER_ROUTES) {
      const filePath = resolveSafe(RENDERER_DIR, RENDERER_ROUTES[relativePath]);
      return filePath ? serveFile(filePath) : new Response('Forbidden', { status: 403 });
    }

    if (relativePath in LIB_ROUTES) {
      const filePath = resolveSafe(LIBS_DIR, LIB_ROUTES[relativePath]);
      return filePath ? serveFile(filePath) : new Response('Forbidden', { status: 403 });
    }

    if (relativePath.startsWith('/assets/')) {
      const filePath = resolveSafe(LIBS_DIR, relativePath.slice('/assets/'.length));
      return filePath ? serveFile(filePath) : new Response('Forbidden', { status: 403 });
    }

    const filePath = resolveSafe(RENDERER_DIR, relativePath);
    return filePath ? serveFile(filePath) : new Response('Not Found', { status: 404 });
  });
}

module.exports = { registerAppProtocol, SCHEME };