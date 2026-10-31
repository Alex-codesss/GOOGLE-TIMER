# Mac에서 GOOGLE TIMER를 아이패드에 설치하기

아이패드용 앱은 만들어져 있으며, 애플 기기 설치를 위한 본인의 서명이 필요합니다. 이 패키지는 iOS/iPadOS 15 이상을 지원하며, iPad/iPhone 시뮬레이터 빌드 확인을 마쳤습니다.

## 1. Mac 준비

1. Mac App Store에서 **Xcode 26 이상**을 설치합니다. Xcode를 한 번 열어 초기 설정을 완료합니다.
2. [Node.js 공식 사이트](https://nodejs.org/)에서 **22 이상인 LTS 버전**을 설치합니다.
3. GOOGLE-TIMER-iPad-Mac.zip을 Mac에 내려받고 압축을 풉니다.

Xcode 26을 설치할 수 없는 오래된 macOS라면 이 프로젝트를 그대로 빌드할 수 없습니다. macOS/Xcode 업데이트 가능 여부를 먼저 확인하세요.

## 2. 앱 프로젝트 열기

압축을 푼 폴더의 **Install-on-iPad.command**를 실행합니다. 처음에는 패키지를 내려받으므로 인터넷이 필요합니다. 준비가 끝나면 Xcode 프로젝트가 열립니다.

파일이 실행되지 않으면 Mac의 터미널에서 아래처럼 실행할 수도 있습니다. `cd` 뒤에는 압축을 푼 폴더를 Finder에서 터미널로 끌어 넣어 경로를 입력하세요.

```sh
cd "/압축을 푼 폴더 경로"
zsh Install-on-iPad.command
```

## 3. Apple 계정 및 서명

1. Xcode의 **Settings → Accounts / Apple Accounts → +**에서 본인의 Apple 계정으로 로그인합니다.
2. 왼쪽의 파란색 **App** 프로젝트 → **TARGETS의 App** → **Signing & Capabilities**를 엽니다.
3. **Automatically manage signing**을 켜고 **Team**에서 본인 이름의 **Personal Team**을 선택합니다.
4. Bundle Identifier가 사용 중이라는 오류가 나오면 `com.본인이름.googletimer`처럼 본인만의 영문 식별자로 바꿉니다.

Apple 계정의 비밀번호나 인증번호를 채팅에 보내지 마세요. Mac의 Apple 로그인 화면에서 직접 입력합니다.

## 4. 아이패드에 실행

1. 아이패드를 USB 케이블로 Mac에 연결하고, 아이패드에 나타나는 **이 컴퓨터를 신뢰** 요청을 직접 확인합니다.
2. Xcode 상단의 실행 기기에서 본인의 아이패드를 선택합니다. 시뮬레이터를 선택하지 마세요.
3. 아이패드에서 개발자 모드가 필요하다는 안내가 나오면 **설정 → 개인정보 보호 및 보안 → 개발자 모드**에서 직접 켜고, 재시동과 확인 절차를 진행합니다.
4. Xcode의 **▶ 실행**을 누릅니다. 서명과 빌드가 끝나면 아이패드에 **GOOGLE TIMER**가 설치되어 실행됩니다.
5. 개발자 신뢰를 요구하면 아이패드의 **설정 → 일반 → VPN 및 기기 관리**에서 본인 계정의 개발자 앱 항목을 확인합니다.

## 설치 후

- 앱에는 타이머가 내장되어 있어 기본 사용에 인터넷이나 ChatGPT 로그인이 필요하지 않습니다.
- 기존 웹 버전의 설정은 앱으로 자동 이전되지 않습니다.
- 앱을 열어 둔 상태에서 소리, 화면 켜짐 유지, 잠금, 종료 시 전체 화면 깜박임을 먼저 확인하세요.
- 무료 Personal Team으로 설치한 앱은 서명 프로파일이 **7일** 후 만료됩니다. Mac에 다시 연결하고 Xcode에서 실행해 갱신합니다.
- 장기 배포나 TestFlight/App Store 설치에는 Apple Developer Program 가입과 별도의 배포 서명이 필요합니다.

공식 안내: [기기에 앱 실행](https://help.apple.com/xcode/mac/current/en.lproj/dev5a825a1ca.html), [무료 Personal Team 제한](https://developer.apple.com/help/account/basics/about-your-developer-account/).
