const crypto = require('crypto');
const qs = require('qs');

// fetch this from environment variables
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const algorithm = 'sha256'

module.exports = (req, res, next) => {

    if (!req.headers['x-slack-signature'] || !req.headers['x-slack-request-timestamp']) {
        return res.status(400).send('Please make sure the valid headers are present in the request.');
    }

    const slackSignature = req.headers['x-slack-signature'];
    const requestBody = qs.stringify(req.body, {
        format: 'RFC1738'
    });

    const timestamp = req.headers['x-slack-request-timestamp'];

    const time = Math.floor(new Date().getTime() / 1000);

    if (Math.abs(time - timestamp) > 300) {
        return res.status(400).send('Ignore this request beacuse it is stale.');
    }

    if (!slackSigningSecret) {
        return res.status(400).send('Slack signing secret is empty.');
    }

    let sigBasestring = 'v0:' + timestamp + ':' + requestBody;

    let mySignature = 'v0=' +
        crypto.createHmac(algorithm, slackSigningSecret)
        .update(sigBasestring, 'utf8')
        .digest('hex');

    if (crypto.timingSafeEqual(
            Buffer.from(mySignature, 'utf8'),
            Buffer.from(slackSignature, 'utf8'))) {
        next();
    } else {
        return res.status(400).send('Verification failed');
    }
}