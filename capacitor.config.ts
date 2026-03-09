import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.badminton.score',
  appName: '羽毛球计分',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
