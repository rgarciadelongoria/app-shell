import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.domain.appShell',
  appName: 'AppShell',
  webDir: 'dist/core-shell',
  server: {
    androidScheme: 'http',
    allowNavigation: ['*'],
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  },
};

export default config;
