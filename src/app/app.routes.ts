import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { ErrorLandingComponent } from '@components/errorLanding/errorLanding.component';
import { getRemoteFederationConfig, removeLocalRemoteFederationConfig } from '@utils/utils';

export const routes: Routes = [
    {
      path: 'errorLanding',
      component: ErrorLandingComponent
    },
    {
      path: '',
      loadChildren: async () => loadRemoteModule({
        remoteEntry: await loadRemoteConfigUrl(),
        exposedModule: './routes'
      })
      .then(m => m.routes)
    }
];

async function loadRemoteConfigUrl(): Promise<string> {
  try {
    const remoteFederationConfig = await getRemoteFederationConfig();
    return remoteFederationConfig;
  } catch (error) {
    console.error(error);
    removeLocalRemoteFederationConfig();
    return '/assets/federation.manifest.json';
  }
}