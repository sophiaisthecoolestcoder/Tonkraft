"""Local dev server that mirrors Cloudflare Workers Assets.

Use this instead of `python3 -m http.server`, which cannot serve the
site any more: internal links are extensionless (/angebot, not
angebot.html), and a plain static server 404s on those.

Two behaviours copied from the Worker:
  * /angebot            -> serves angebot.html
  * /angebot.html       -> 301 redirects to /angebot  (canonical URL)
Caching is disabled so navigating between pages always shows the
latest HTML/CSS.

Run from this directory:
    python3 serve.py
"""
import http.server
import os
import socketserver
import sys


class NoCacheTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, path):
        """Map an extensionless request onto its .html file."""
        local = super().translate_path(path)
        if not os.path.exists(local) and not path.rstrip("/").endswith(".html"):
            candidate = super().translate_path(path.rstrip("/") + ".html")
            if os.path.isfile(candidate):
                return candidate
        return local

    def send_head(self):
        """Redirect /x.html -> /x, exactly as the Worker does."""
        raw = self.path.split("?", 1)[0].split("#", 1)[0]
        if raw.endswith(".html") and not raw.endswith("/index.html"):
            self.send_response(301)
            self.send_header("Location", raw[: -len(".html")])
            self.end_headers()
            return None
        return super().send_head()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    with NoCacheTCPServer(("", port), NoCacheHandler) as httpd:
        print(f"Tonkraft → http://localhost:{port}/  (no-cache)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
