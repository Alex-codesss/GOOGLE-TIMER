# User maintenance requirements

- Maintain both the hosted web app (`dist/`) and native Android/iOS apps (`native/`). The user explicitly requested that the app versions continue to be maintained alongside the web version.
- For shared timer features, change the shared web source first, then run `npm ci` if dependencies require installation and `npm run sync` in `native/` to update native assets. Native generated web assets are ignored; builds must regenerate them.
- For changes affecting mobile behavior, validate native packaging and run the GitHub mobile build workflow; provide an updated Android APK when releasing user-visible shared changes. Do not report an APK as updated until its build succeeds.
- Keep iOS source compatible and validate the iOS simulator build when native changes warrant it. Device-installable iOS distribution requires the user's Apple signing; never describe simulator builds or unsigned source as an installable iPad/iPhone app.
- Preserve existing version tags and downloadable APKs. Give new releases distinct version numbers/tags and keep Android versionCode increasing for new APK versions.
- Preserve stable signing for upgrades. Current Android APK uses a cached development signing key; long-term distribution requires a separately retained signing key. Do not claim update compatibility when the signing key has changed.
- Keep the GitHub repository private and preserve the hosted site's existing audience unless the user asks to change access.
