# GOOGLE TIMER 모바일 버전

웹 버전 v4의 기능을 기기에 내장하는 Android/iOS 프로젝트입니다. 외부 사이트 접속이나 ChatGPT 로그인이 필요하지 않으며 기본 타이머는 인터넷 없이 실행됩니다. 설정은 앱 내부에 저장됩니다. 웹 버전의 기존 설정은 자동으로 옮겨지지 않습니다.

## 안드로이드 APK

- 지원: Android 7.0 이상. 실제 기기의 Android System WebView 업데이트 권장.
- 앱 이름: GOOGLE TIMER
- 패키지: com.alexcodesss.googletimer
- GitHub Actions의 **Build GOOGLE TIMER mobile**을 실행하면 **GOOGLE-TIMER-Android-APK** 아티팩트가 생성됩니다.
- APK를 태블릿에 저장한 뒤 파일을 열어 설치합니다. 해당 파일을 여는 앱에 대한 설치 허용을 기기에서 요청할 수 있습니다.
- 제공 APK는 개인 사용/테스트용 개발 서명 버전입니다. Google Play에 게시하는 제품용 서명 버전은 별도로 준비해야 합니다.
- 빌드 환경에 개발 서명 키를 캐시하여 후속 APK의 덮어쓰기 설치를 지원합니다. 캐시가 만료되면 서명 키가 달라질 수 있으므로, 장기 배포 전에는 별도의 보관된 제품용 키로 전환해야 합니다.

로컬 빌드에는 Node.js 22 이상, Android Studio 2025.2.1 이상 및 JDK 21/Android SDK 36이 필요합니다.

```sh
cd native
npm ci
npm run sync
cd android
./gradlew assembleDebug
```

Windows에서는 마지막 명령 대신 `gradlew.bat assembleDebug`를 사용합니다.

## 애플 iPad/iPhone

APK는 애플 기기에 설치할 수 없습니다. 같은 기능의 iOS 프로젝트를 `ios/`에 준비했습니다.

- iOS/iPadOS 15 이상 지원.
- Mac과 Xcode 26 이상에서 프로젝트를 열어 기기에 서명 후 설치합니다.
- 개인 Apple 계정으로 연결된 기기에 직접 테스트 설치할 수 있으나, 무료 계정은 설치 유지와 배포에 제한이 있습니다.
- TestFlight/App Store 배포에는 Apple Developer Program 가입과 서명 설정이 필요합니다.
- GitHub Actions의 iOS 산출물은 **시뮬레이터 전용**이며 아이패드에 설치할 수 있는 IPA가 아닙니다.

```sh
cd native
npm ci
npm run prepare:web
npx cap sync ios
npx cap open ios
```

Xcode에서 App 타깃의 Signing & Capabilities에 자신의 Team을 선택하고, 연결한 iPad/iPhone을 대상으로 실행합니다. 다른 계정에서 bundle identifier가 사용 중이라면 본인 전용 식별자로 변경합니다.

개발자 계정이나 Mac 없이 당장 쓰려면 아이패드 Safari에서 기존 웹 버전을 열고 **공유 → 홈 화면에 추가 → 웹 앱으로 열기**로 사용합니다.

## 기능 범위

3자리 비밀번호/패턴 잠금, 원래 화면 유지 선택, 숫자 표시 선택, 종료 후 화면 전체 깜박임(기본 10초)을 포함합니다. 화면 켜짐 유지에는 네이티브 플러그인을 사용합니다. 앱이 백그라운드로 이동하거나 기기가 잠기면 알림은 지연될 수 있으므로 타이머 화면을 열어 둡니다.

모바일 플랫폼 파일은 Capacitor 공식 템플릿으로 생성했습니다. 의존성의 라이선스는 각 패키지를 따릅니다.
