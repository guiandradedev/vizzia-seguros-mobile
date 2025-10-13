import 'dotenv/config'; // Importa as variáveis do .env

export default ({ config }: { config: any }) => {
    return {
        ...config,
        extra: {
            API_BASE_URL: process.env.API_BASE_URL,
            GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
            GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
            GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
        },
    };
};