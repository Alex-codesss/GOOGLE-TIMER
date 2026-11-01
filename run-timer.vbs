Set oWS = CreateObject("WScript.Shell")
strDir = "C:\Users\rgann\Documents\ChatGPT\GOOGLE TIME\focus-dial"
chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
url = "http://127.0.0.1:4173"

' 백그라운드로 로컬 웹서버 실행 여부 확인 및 구동
cmd = "powershell -WindowStyle Hidden -Command ""if (-not (Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue)) { Start-Process python -ArgumentList '-m http.server 4173 --directory dist --bind 127.0.0.1' -WorkingDirectory '" & strDir & "' -WindowStyle Hidden; Start-Sleep -Milliseconds 400 } Start-Process '" & chromeExe & "' -ArgumentList '--app=" & url & "'"""
oWS.Run cmd, 0, False

