import Boom from 'boom';
import JWT from 'jsonwebtoken';

export const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-user-id": user.id.toString()
        },
        email: user.email
    };

    const options = {
        expiresIn: '10d',
        issuer: 'graphql-egitimi',
        audience: user.id.toString(),
    }

    JWT.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, options, (err, token) => {
        if (err) {
            return reject(Boom.internal(err));
        }
        
        resolve(token);
    });
  });
};