const Twilio = require("twilio");
const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

console.clear();

const app = new express();
// replace with client url
var corsOptions = {
	origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// setup the config
const accessToken = new Twilio.jwt.AccessToken(
	config.TWILIO_ACCOUNT_SID,
	config.TWILIO_API_KEY,
	config.TWILIO_API_SECRET,
	{ ttl: 86400 }
);
const chatGrant = new Twilio.jwt.AccessToken.ChatGrant({
	serviceSid: config.TWILIO_CHAT_SERVICE_SID,
});

accessToken.addGrant(chatGrant);

app.post("/token", (req, res) => {
	const identity = req.body.uniqueName;
	accessToken.identity = identity;
	res.set("Content-Type", "application/json");
	res.send(
		JSON.stringify({
			token: accessToken.toJwt(),
			identity: identity,
		})
	);
});

// ============================================
// ====== HANDLE NEW-CONVERSATION HOOK ========
// ============================================

let client = Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
// let service = client.conversations.services(config.TWILIO_CHAT_SERVICE_SID);

app.post("/conversation", async (req, res) => {
	const { conversationId, userEmailOrUniqueID } = req.body;
	// fetch conversation if it exists
	console.log(req.body);
	try {
		let participant = await client.conversations
			.conversations(conversationId)
			.participants.create({
				identity: userEmailOrUniqueID,
			});
		res.status(200).send({ message: "User was create", participant });
	} catch (err) {
		console.trace(err);
		try {
			// create it otherwise
			await client.conversations.conversations.create({
				// messagingServiceSid: config.TWILIO_MESSAGING_SERVICE_SID,
				uniqueName: conversationId,
				friendlyName: conversationId,
			});
			let participant = await client.conversations
				.conversations(conversationId)
				.participants.create({
					identity: userEmailOrUniqueID,
				});
			res.status(200).send({
				message: "Channel and Participant were create!",
				participant,
			});
		} catch (error) {
			console.trace(err);
			res.status(400).send({ error });
		}
	}
});

app.post("/conversation/phone", async (req, res) => {
	const { phoneNumber, conversationId } = req.body;
	// Add user to conversation if it exists
	console.log("phone called with ", req.body);
	try {
		let participant = await client.conversations
			.conversations(conversationId)
			.participants.create({
				"messagingBinding.address": phoneNumber,
				"messagingBinding.proxyAddress": config.TWILIO_PHONE_NUMBER,
			});
		res.status(200).send({ message: "User was create", participant });
	} catch (e) {
		try {
			console.trace(e);
			// else we create a conversation and add user to it
			await client.conversations.conversations.create({
				uniqueName: conversationId,
				friendlyName: conversationId,
			});
			let participant = await client.conversations
				.conversations(conversationId)
				.participants.create({
					"messagingBinding.address": phoneNumber,
					"messagingBinding.proxyAddress": config.TWILIO_PHONE_NUMBER,
					identity: phoneNumber.slice(phoneNumber.length - 4),
				});
			res.status(200).send({
				message: "Channel and Participant were create!",
				participant,
			});
		} catch (error) {
			console.trace(error);
			res.status(400).send({ error });
		}
	}
});

app.delete("/conversation/delete", async (req, res) => {
	const { conversationId } = req.body;
	try {
		await client.conversations.conversations(conversationId).remove();
		res.status(200).send({ message: "Conversation deleted" });
	} catch (error) {
		console.trace(error);
		res.status(400).send({ error });
	}
});

app.delete("/participant/delete", async (req, res) => {
	const { conversationId, identity } = req.body;
	try {
		await client.conversations
			.conversations(conversationId)
			.participants({ identity })
			.remove();
		res.status(200).send({ message: "Participant deleted" });
	} catch (error) {
		console.trace(error);
		res.status(400).send({ error });
	}
});

// client.conversations.conversations.

app.delete("/participant/phone/delete", async (req, res) => {
	const { conversationId, phoneNumber } = req.body;
	console.log(phoneNumber);
	try {
		await client.conversations
			.conversations(conversationId)
			.participants.list(async (err, participants) => {
				if (err) throw new Error(err);
				else {
					participants
						.filter(
							(participant) =>
								participant.messagingBinding &&
								participant.messagingBinding.address === phoneNumber
						)[0]
						.remove();
				}
			});
		res.status(200).send({ message: "Participant deleted" });
	} catch (error) {
		console.trace(error);
		res.status(400).send({ error });
	}
});

app.listen(config.PORT, () => {
	console.log(`Application started at localhost:${config.PORT}`);
});
