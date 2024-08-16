import axios from 'axios';

const DOLBY_API_KEY = process.env.REACT_APP_DOLBY_API_SECRET;
const DOLBY_API_SECRET = process.env.REACT_APP_DOLBY_API_SECRET;

export const getAuthToken = async () => {
    
    console.log("DOLBY_API_KEY---------",DOLBY_API_KEY);
    try {
        const response = await axios.post(
            'https://api.dolby.io/v1/auth/token',
            {
                key: DOLBY_API_KEY,
                secret: DOLBY_API_SECRET,
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Dolby.io auth token:', error);
        throw error;
    }
};
