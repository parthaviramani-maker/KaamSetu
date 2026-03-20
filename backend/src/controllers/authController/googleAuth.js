import { GOOGLE_CLIENT_ID, BACKEND_URL } from '../../config/config.js';

export default {
    handler: (req, res) => {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: `${BACKEND_URL}/api/v1/auth/google/callback`,
            response_type: 'code',
            scope: 'openid profile email',
            access_type: 'offline',
            prompt: 'select_account',
        });
        res.redirect(`${rootUrl}?${params.toString()}`);
    },
};
