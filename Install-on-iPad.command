#!/bin/zsh
set -eu
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")"
finish() { printf '\n계속하려면 Enter를 누르세요. '; read -r answer; }
trap 'code=$?; if [ "$code" -ne 0 ]; then printf "\n준비가 중단되었습니다. 위 오류를 확인하세요.\n"; finish; fi' EXIT
printf '\nGOOGLE TIMER · 아이패드 설치 준비\n\n'
if ! /usr/bin/xcodebuild -version; then
  printf '\nApp Store에서 Xcode를 설치하고 한 번 실행해 초기 설정을 마친 뒤 다시 실행하세요.\n'
  exit 1
fi
xcode_major=$(/usr/bin/xcodebuild -version | /usr/bin/awk '/^Xcode/{split($2,v,".");print v[1]}')
if [ "${xcode_major:-0}" -lt 26 ]; then
  printf '\nXcode 26 이상이 필요합니다. App Store에서 Xcode를 업데이트하세요.\n'
  exit 1
fi
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  printf '\nNode.js 22 이상이 필요합니다. https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행하세요.\n'
  exit 1
fi
node -e 'if(Number(process.versions.node.split(".")[0])<22){console.error("Node.js 22 이상으로 업데이트하세요.");process.exit(1)}'
cd native
printf '\n1/3 필요한 패키지를 준비합니다. 첫 실행에는 인터넷이 필요합니다.\n'
npm ci
printf '\n2/3 아이패드 앱에 타이머 화면을 내장합니다.\n'
npm run prepare:web
printf '\n3/3 iOS 프로젝트를 동기화합니다.\n'
npx --no-install cap sync ios
printf '\n준비 완료. Xcode를 엽니다.\n'
printf '아이패드를 Mac에 연결한 뒤, App → Signing & Capabilities → Team을 선택하고 실행(▶)하세요.\n'
open ios/App/App.xcodeproj
finish
