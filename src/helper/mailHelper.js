import helper from "./helper.js";
import logger from "./logger.js";

export default function getAllListeners(eventEmitter) {

    eventEmitter.on('sendRegistrationMail', async (input) => {
        await registration(input);
    });

    eventEmitter.on('userForgotPassword', async (input) => {
        await forgotPassword(input);
    });
    
}

async function registration(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Registration Mail for ${userData.name}`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <h1>${userData.name}</h1>
            </body>
            </html>`,
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function forgotPassword(input) {
    try {

        console.log('forgotPassword mail.', JSON.parse(input));
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}
