import { Container } from "@material-ui/core";
import React from "react";
import Conversation from "./components/Conversation";
import Welcome from "./components/Welcome";

function App() {
	let [username, setUsername] = React.useState("");
	let [conversation, setConversation] = React.useState("");
	let [showForm, setShowForm] = React.useState(true);

	return (
		<Container maxWidth="lg">
			{showForm ? (
				<Welcome
					username={username}
					conversation={conversation}
					setUsername={setUsername}
					setConversation={setConversation}
					setShowForm={setShowForm}
				/>
			) : (
				<Conversation
					setShowForm={setShowForm}
					uniqueName={username}
					uniqueConversationName={conversation}
				/>
			)}
		</Container>
	);
}

export default App;
