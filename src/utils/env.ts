import Constants from 'expo-constants';

interface ExtraConfig {
    API_BASE_URL: string;
    GOOGLE_IOS_CLIENT_ID: string;
    GOOGLE_ANDROID_CLIENT_ID: string;
}

const env = Constants.expoConfig?.extra as ExtraConfig;

export default {
    API_BASE_URL: env.API_BASE_URL,
    GOOGLE_IOS_CLIENT_ID: env.GOOGLE_IOS_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: env.GOOGLE_ANDROID_CLIENT_ID,
};