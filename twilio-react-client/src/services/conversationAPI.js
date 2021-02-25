import { Client as ConversationsClient } from "@twilio/conversations";
import axios from "axios";

export default class ConversationClient {
	constructor(uniqueName, conversationID) {
		this.uniqueName = uniqueName;
		this.conversationID = conversationID;
		this.token = null;
		this.client = null;
		this.conversation = null;
		this.messages = [];
		this.participants = [];
		this.handleChat();
		this.getConversation();
	}

	getToken = async (userEmailOrUniqueID) => {
		try {
			const response = await axios.post(`http://localhost:5000/token`, {
				uniqueName: userEmailOrUniqueID,
			});
			console.log(response);
			const {
				data: { token },
			} = response;
			return token;
		} catch (err) {
			throw new Error("unable to get token; ", err);
		}
	};

	getParticipantsAndMessages = async (conversation) => {
		const members = await conversation.getParticipants();

		this.participants = members.map((member) =>
			member.identity
				? member.identity
				: "SMS@" + member.sid.slice(member.sid.length - 4)
		);

		const { items: remoteMessages } = await conversation.getMessages();
		if (remoteMessages) {
			this.messages = remoteMessages;
		}
	};

	joinConversation = async (conversation) => {
		if (conversation.status !== "joined") {
			await conversation.join();
		}
		this.conversation = conversation;

		conversation.on("messageAdded", (message) => {
			this.messages = [...this.messages, message];
		});
	};

	handleChat = async () => {
		this.token = await this.getToken(this.uniqueName);
		this.client = await ConversationsClient.create(this.token);

		this.client.on("tokenAboutToExpire", async () => {
			this.token = await this.getToken(this.uniqueName);
			this.client.updateToken(this.token);
		});

		this.client.on("tokenExpired", async () => {
			this.token = await this.getToken(this.uniqueName);
			this.client.updateToken(this.token);
		});

		this.client.on("conversationJoined", this.getParticipantsAndMessages);

		this.client.on("participantJoined", this.getParticipantsAndMessages);
		// To learn more about event go here https://media.twiliocdn.com/sdk/js/conversations/releases/1.1.0/docs/index.html
	};

	getConversation = async () => {
		if (!this.client) return;
		try {
			// participant are created in the backend (because of private nature of conversations)
			const conversation = await this.client.getConversationByUniqueName(
				this.conversationID
			);
			this.joinConversation(conversation);
		} catch (e) {
			// If we reached this block, one of 2 things happened
			// 1: conversation doesn't exist
			// or, 2: the participant is not part of the conversation (meaning it's not visible)
			try {
				await axios.post(`http://localhost:5000/conversation`, {
					conversationId: this.conversationID,
					userEmailOrUniqueID: this.uniqueName,
				});
				// in the server
				// we try 1: to add the user to the conversation
				// if that fails we try to create the channel + add the user
				// now it should be visible to this participant
				const conversation = await this.client.getConversationByUniqueName(
					this.conversationID
				);
				// we try joining again
				this.joinConversation(conversation);
			} catch (error) {
				throw new Error(
					"Unable to join conversation, please reload this page " + error
				);
			}
		}
	};

	handleAddByPhoneNumber = async (phoneNumber) => {
		if (
			this.client &&
			typeof phoneNumber === "string" &&
			phoneNumber.length === 10
		) {
			await axios.post(`http://localhost:5000/conversation/phone`, {
				phoneNumber: "+1" + phoneNumber,
				conversationId: this.conversationID,
			});
		}
	};

	closeConnection = () => this.client.shutdown();

	sendMessage = (text) => {
		this.conversation.sendMessage(String(text).trim());
	};

	onDrop = (acceptedFiles) => {
		if (this.conversation) {
			acceptedFiles.forEach((file) => {
				console.log(file);
				const reader = new FileReader();
				reader.onabort = () => console.log("file reading was aborted");
				reader.onerror = () => console.log("file reading has failed");
				reader.onload = () => {
					// Do whatever you want with the file contents
					this.conversation.sendMessage({
						contentType: file.type,
						media: reader.result,
					});
				};
				reader.readAsArrayBuffer(file);
			});
		}
	};
}
