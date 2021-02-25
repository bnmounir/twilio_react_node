import React, { useState, useRef, useEffect, useCallback } from "react";
import { Client as ConversationsClient } from "@twilio/conversations";
import axios from "axios";
import {
	Paper,
	Grid,
	Divider,
	TextField,
	Fab,
	Button,
	Container,
} from "@material-ui/core";

import { Send, Photo } from "@material-ui/icons";
import { DropzoneDialog } from "material-ui-dropzone";
import { useStyles } from "../Welcome/styles";
import MessagingArea from "./MessagingArea";

function Conversation(props) {
	let userEmailOrUniqueID = props.uniqueName;
	let conversationId = props.uniqueConversationName;

	const classes = useStyles();
	const messagesEndRef = useRef(null);

	const [phoneNumber, setPhoneNumber] = useState("");
	const [text, setText] = useState("");
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [conversation, setConversation] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [client, setClient] = useState(null);
	const [open, setOpen] = useState(false);

	const getParticipantsAndMessages = async (conversation) => {
		let members = await conversation.getParticipants();
		console.log("102", members);
		let parsedMembers = members.map((member) =>
			member.identity
				? member.identity
				: "SMS@" + member.sid.slice(member.sid.length - 4)
		);
		console.log(parsedMembers);
		setParticipants(parsedMembers);
		const { items } = await conversation.getMessages();

		if (items && items.length > 0) {
			let remoteMessages = await items.map((msg) => {
				if (msg.media) {
					msg.media
						.getContentTemporaryUrl()
						.then((url) => (msg.tempImgUrl = url))
						.catch((err) => console.log(err));
					return msg;
				}
				return msg;
			});
			setMessages(remoteMessages);
		}
	};

	const joinConversation = useCallback(async (conversation) => {
		console.log(conversation);
		if (conversation.status !== "joined") {
			await conversation.join();
		}
		setConversation(conversation);
		setLoading(false);

		conversation.on("messageAdded", (message) => {
			console.log("called ahead");
			setMessages((messages) => [...messages, message]);
		});
	}, []);

	const handleChat = useCallback(async () => {
		let token = "";

		setLoading(true);
		const getToken = async (userEmailOrUniqueID) => {
			const response = await axios.post(`http://localhost:5000/token`, {
				uniqueName: userEmailOrUniqueID,
			});
			console.log(response);
			const {
				data: { token },
			} = response;
			return token;
		};
		try {
			token = await getToken(userEmailOrUniqueID);
		} catch {
			throw new Error("Unable to get token, please reload this page");
		}

		const client = await ConversationsClient.create(token);
		setClient(client);

		client.on("tokenAboutToExpire", async () => {
			token = await getToken(userEmailOrUniqueID);
			client.updateToken(token);
		});

		client.on("tokenExpired", async () => {
			token = await getToken(userEmailOrUniqueID);
			client.updateToken(token);
		});

		client.on("conversationJoined", getParticipantsAndMessages);

		client.on("participantJoined", getParticipantsAndMessages);
		// To learn more about event go here https://media.twiliocdn.com/sdk/js/conversations/releases/1.1.0/docs/index.html

		try {
			// participant are created in the backend (because of private nature of conversations)
			const conversation = await client.getConversationByUniqueName(
				conversationId
			);
			joinConversation(conversation);
		} catch (e) {
			console.log(e);
			// If we reached this block it means one of 2 things
			// 1 - conversation doesn't exist
			// 2 - the participant is not part of the conversation (meaning it's not visible)
			try {
				await axios.post(`http://localhost:5000/conversation`, {
					conversationId,
					userEmailOrUniqueID,
				});
				// in the server
				// we try 1: to add the user to the conversation
				// if that fails we try to create the channel + add the user
				// now it should be visible to this participant
				const conversation = await client.getConversationByUniqueName(
					conversationId
				);
				// we try joining again
				joinConversation(conversation);
			} catch (error) {
				throw new Error(
					"Unable to join conversation, please reload this page " + error
				);
			}
		}
	}, [conversationId, joinConversation, userEmailOrUniqueID]);

	const handleAddByPhoneNumber = async () => {
		console.log(phoneNumber);
		if (
			client &&
			typeof phoneNumber === "string" &&
			phoneNumber.length === 10
		) {
			let response = await axios.post(
				`http://localhost:5000/conversation/phone`,
				{
					phoneNumber: "+1" + phoneNumber,
					conversationId,
				}
			);
			setPhoneNumber("");
			console.log(response);
		}
	};

	useEffect(() => {
		handleChat();
	}, [handleChat]);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	};

	// handles scroll events on new message added
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// close the connection on unmount
	// useEffect(() => {
	// 	return () => {
	// 		// close the connection on unmount
	// 		if (client) {
	// 			client.shutdown();
	// 			setClient(null);
	// 			console.log("conversation client has been shutdown!");
	// 		}
	// 	};
	// }, [client]);

	const sendMessage = () => {
		if (text && text !== "") {
			setLoading(true);
			conversation.sendMessage(String(text).trim());
			setText("");
			setLoading(false);
		}
	};

	const handleSendWithEnter = (e) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	const onDrop = (acceptedFiles) => {
		if (conversation) {
			acceptedFiles.forEach((file) => {
				console.log(file);
				const reader = new FileReader();
				reader.onabort = () => console.log("file reading was aborted");
				reader.onerror = () => console.log("file reading has failed");
				reader.onload = () => {
					// Do whatever you want with the file contents
					conversation.sendMessage({
						contentType: file.type,
						media: reader.result,
					});
				};
				reader.readAsArrayBuffer(file);
			});
			setOpen(false);
		}
	};

	return (
		<Container className={classes.container}>
			<DropzoneDialog
				open={open}
				filesLimit={1}
				onSave={onDrop}
				acceptedFiles={["image/*"]}
				showPreviews={true}
				maxFileSize={5000000}
				onClose={() => setOpen(false)}
			/>
			<Button
				className={classes.button}
				onClick={() => props.onClose(true)}
				variant="contained"
				color="secondary"
			>
				Close Conversation
			</Button>
			<Grid container component={Paper} className={classes.chatSection}>
				<Grid item xs={12}>
					<MessagingArea
						messages={messages}
						userEmailOrUniqueID={userEmailOrUniqueID}
						classes={classes}
						messagesEndRef={messagesEndRef}
					/>

					<Divider />
					<Grid container className={classes.bottomSender}>
						<Grid item xs={9}>
							<TextField
								required
								id="outlined-basic-email send-messages"
								label="Type Something"
								type="text"
								// multiline
								// rows={2}
								value={text}
								disabled={!conversation}
								onChange={(e) => setText(e.target.value)}
								fullWidth
								onKeyUp={handleSendWithEnter}
							/>
						</Grid>

						<Grid item xs={3} align="right">
							<Fab
								type="submit"
								color="primary"
								aria-label="send"
								onClick={sendMessage}
								disabled={!conversation}
								className={classes.fabSend}
							>
								<Send />
							</Fab>

							<Fab
								type="submit"
								color="inherit"
								aria-label="picture"
								onClick={() => setOpen(true)}
								disabled={!conversation}
							>
								<Photo />
							</Fab>
						</Grid>
					</Grid>
					<Divider />
				</Grid>
			</Grid>
		</Container>
	);
}

export default Conversation;
