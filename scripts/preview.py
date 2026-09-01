#!/usr/bin/env python3
import argparse
import socket
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial


ROOT = Path(__file__).resolve().parents[1]


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def port_is_available(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def find_available_port(start_port, max_attempts):
    for port in range(start_port, start_port + max_attempts):
        if port_is_available(port):
            return port
    return 0


def main():
    parser = argparse.ArgumentParser(description="Start a local preview server for the website.")
    parser.add_argument("--port", type=int, default=8000, help="First port to try. Default: 8000.")
    parser.add_argument("--attempts", type=int, default=50, help="How many ports to try. Default: 50.")
    args = parser.parse_args()

    port = find_available_port(args.port, args.attempts)
    handler = partial(NoCacheHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    actual_port = server.server_address[1]

    print(f"Preview running at http://127.0.0.1:{actual_port}", flush=True)
    print("Press Ctrl+C to stop.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPreview stopped.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
