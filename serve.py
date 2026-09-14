#!/usr/bin/env python3
"""
Local security headers test server for sefakozan.com.tr
Runs an HTTP server with the required security headers and blocks hidden files.
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class SecureHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self';")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        super().end_headers()

    def do_GET(self):
        # Block access to hidden files/directories (.git, .env, .htaccess, etc.)
        clean_path = self.path.split('?')[0]
        parts = clean_path.strip('/').split('/')
        if any(part.startswith('.') for part in parts if part):
            self.send_error(404, "File not found")
            return
        super().do_GET()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5501
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, SecureHTTPRequestHandler)
    print(f"[*] Güvenli test sunucusu başlatıldı: http://127.0.0.1:{port}")
    print("[*] Güvenlik başlıkları: HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy")
    print("[*] Kapatmak için Ctrl+C tuşlayın.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Sunucu durduruldu.")

if __name__ == "__main__":
    main()
