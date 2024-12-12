import { initFederation } from '@angular-architects/native-federation';
import { getRemoteFederationConfig, removeLocalRemoteFederationConfig } from '@utils/utils';

(async function loadRemoteConfigUrl() {
  try {
    const remoteFederationConfig = await getRemoteFederationConfig();
    initFederation({ "app": remoteFederationConfig })
      .catch(err => console.error(err))
      .then(_ => import('./bootstrap'))
      .catch(err => console.error(err));
    console.log('initFederation - custom config loaded');
  } catch (error) {
    alert('error');
    console.error(error);
    removeLocalRemoteFederationConfig();
    initFederation('/assets/federation.manifest.json')
      .catch(err => console.error(err))
      .then(_ => import('./bootstrap'))
      .catch(err => console.error(err));
    console.log('initFederation - loading default config');
  }
})();
