"""Local dev server with caching disabled — use instead of
`python3 -m http.server` so browsers always fetch the latest HTML/CSS
when you navigate between sub-pages.

Run from this directory:
    python3 serve.py
"""
import http.server
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
