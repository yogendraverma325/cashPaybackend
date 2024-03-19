import jwt from "jsonwebtoken";

const generateSessionToken = async data => {
    const token = jwt.sign(data, "7858tn8yf8nt7y8r88n4c8nc"

        //     {
        //     expiresIn: (data.source === 1) ? process.env.ENCRYPTION_EXPIRY_MOBILE : process.env.ENCRYPTION_EXPIRY,
        // }

    );
    return token;
};

export default {
    generateSessionToken
}