import subprocess
import time
import urllib.request
import webbrowser
import os
import sys
from pathlib import Path

base_dir = Path(__file__).resolve().parent
dist_dir = base_dir / "dist"
chrome_exe = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
port = 4173
url = f"http://127.0.0.1:{port}"

def is_server_ready():
    try:
        with urllib.request.urlopen(url, timeout=0.5) as resp:
            return resp.status == 200
    except Exception:
        return False

if not is_server_ready():
    # Windows 백그라운드로 로컬 HTTP 서버 실행
    python_exe = sys.executable
    server_cmd = [
        python_exe,
        "-m",
        "http.server",
        str(port),
        "--directory",
        str(dist_dir),
        "--bind",
        "127.0.0.1"
    ]
    flags = 0
    if os.name == "nt":
        flags = subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
    
    subprocess.Popen(
        server_cmd,
        creationflags=flags,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        close_fds=True
    )
    # 서버 준비 대기
    for _ in range(10):
        time.sleep(0.2)
        if is_server_ready():
            break

# Chrome 단독 앱 창으로 열기
if chrome_exe.is_file():
    subprocess.Popen([str(chrome_exe), f"--app={url}"])
else:
    webbrowser.open(url)
