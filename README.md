

# CoreShell

This is a shell project ready to work with one main micro-frontend project.

# Important

Every main dependency in remote may exist on shell, like Angular. Same angular-cli, angular-core, ngx-translate and others versions.

# Manifest URLs

Modify REMOTE_FEDERATION_CONFIG_URL config.enum.cts with your own remote config json.

Modify federation.manifest.json `app` property before build.

```json
{
	"app": "https://<url>/remoteEntry.json"
}
``````

# Build and sync 

Do a `ng build` and `npx cap sync` at the same time, to update native project with project files.

**Development**

```console
npm run prepare | npm run prepare-android | npm run prepare-ios
```

**Production**

```console
npm run prepare --configuration=production
```

# Run Android emulator

```console
npx cap run android
```

# Run iOS simulator

```console
npx cap run ios
```

# Open native project

Open native project on Android Studio or XCode.

```console
npx cap open android | npx cap open ios
```