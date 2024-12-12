/*
The remote JSON must have the following structure, but you can add more entries:
{
    "app": "http://localhost:4201/remoteEntry.js",
}
*/
import { ConfigValues } from '../enums/config.enum';

const LOCAL_STORAGE_REMOTE_FEDERATION_CONFIG_NAME = 'remoteFederationConfig';

export async function getRemoteFederationConfig(): Promise<string> {
    const response = await fetch(ConfigValues.REMOTE_FEDERATION_CONFIG_URL + '/raw?timestamp=' + new Date().getTime());
    const data = await response.json();
    let remoteFederationConfig = localStorage.getItem(LOCAL_STORAGE_REMOTE_FEDERATION_CONFIG_NAME) || 'app';
    if (!!remoteFederationConfig === true && typeof remoteFederationConfig === 'string' && !remoteFederationConfig.startsWith('http')) {
        remoteFederationConfig = data[remoteFederationConfig]
    }
    return remoteFederationConfig;
}

export function removeLocalRemoteFederationConfig() {
    localStorage.removeItem(LOCAL_STORAGE_REMOTE_FEDERATION_CONFIG_NAME);
}