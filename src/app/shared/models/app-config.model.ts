export interface IAppConfig {
    env: {
        name: string;
    };
    apiServer: {
        dataServer: string;
        serverName: string;
    };
    permissions: any;
    currentUserDetails: any;
    currentSettings: any;
    currentStoreDetails: any;
}