import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
	container: {
		width: "100%",
		maxWidth: "900px",
		height: "80vh",
		backgroundColor: "#202124",
		padding: "20px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		// alignItems: "center",
	},

	chatSection: {
		width: "100%",
		height: "75vh",
		margin: "5px",
		overflow: "hidden",
		padding: "10px",
		// display: "block",
		// [theme.breakpoints.up("md")]: {
		// 	display: "flex",
		// 	margin: "30px",
		// },
	},
	headBG: {
		backgroundColor: "#e0e0e0",
	},
	membersList: {
		// display: "none",
		// [theme.breakpoints.up("md")]: {
		// 	display: "block",
		// },
	},
	// messagingContainer: {
	//   [theme.breakpoints.up('md')]: {},
	// },
	messagesArea: {
		height: "65vh",
		overflowY: "auto",
		borderRight: "1px solid #e0e0e0",
	},
	bottomSender: {
		padding: "10px",
	},
	fabSend: {
		// position: "absolute",
		// bottom: theme.spacing(2),
		right: theme.spacing(1),
	},
	imgCard: {
		width: "200px",
		height: "300px",
	},
	flexContainer: {
		display: "flex",
		flexDirection: "row",
		padding: 0,
	},
}));
