<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Starter Application for Node.js (This is the Server)

This sample project demonstrates a backend service for a Twilio Conversation APIs in a Node.js. The server runs on [localhost](http://localhost:5000).

these are the endpoints: **protect these routes**

- POST /token | expects { uniqueName } on req.body
- POST /conversation | { conversationId, userEmailOrUniqueID }
- POST /conversation/phone | { phoneNumber, conversationId }
- DELETE /conversation/delete | { conversationId }
- DELETE /participant/delete | { conversationId, identity }
- DELETE /participant/phone/delete | { conversationId, phoneNumber }

Checkout [Conversations API](https://www.twilio.com/conversations-api) for more.

## Configure the your keys

To run the application, you'll need to gather your Twilio account credentials and configure them
in a file named `.env`. To create this file from an example template, do the following in your
Terminal.

```bash
cp .env.example .env
```

Open `.env` in your favorite text editor and configure the following values.

### Configure account information

Every sample in the demo requires some basic credentials from your Twilio account. Configure these first.

| Config Value         | Description                                                                                                           |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).             |
| `TWILIO_API_KEY`     | Used to authenticate - [generate one here](https://www.twilio.com/console/dev-tools/api-keys).                        |
| `TWILIO_API_SECRET`  | Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/console/dev-tools/api-keys). |

#### A Note on API Keys

When you generate an API key pair at the URLs above, your API Secret will only be shown once -
make sure to save this information in a secure location.

### Configure product-specific settings

Depending on which demos you'd like to run, you may need to configure a few more values in your `.env` file.

### Configuring Twilio Chat

In addition to the above, you'll need to [generate a Chat Service](https://www.twilio.com/console/chat/services) in the Twilio Console. Put the result in your `.env` file.

| Config Value              | Where to get one. |
| :------------------------ | :---------------- | -------------------------------------------------------------------------------------------------------- |
| `TWILIO_CHAT_SERVICE_SID` | Conversation      | [Generate one in the Twilio Conversation console](https://www.twilio.com/console/conversations/services) |

## Run the sample application

Now that the application is configured, we need to install our dependencies from yarn.

```bash
yarn install
```

Now we should be all set! Run the application in development using nodemon:

```bash
yarn dev
```

Your application should now be running at [http://localhost:3000/](http://localhost:3000/).

## Meta

- No warranty expressed or implied. Software is as is.
- [MIT License](http://www.opensource.org/licenses/mit-license.html)
- Lovingly crafted for Twilio Developer Education.
