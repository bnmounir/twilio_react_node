import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
	container: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "#202124",
		padding: "20px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	margin: {
		margin: theme.spacing(1),
	},
	button: {
		position: "absolute",
		top: theme.spacing(2),
		right: theme.spacing(2),
	},
	img: {
		width: "300px",
		height: "300px",
		pointerEvents: "none",
		animation: "$mySpinner infinite 20s linear",
	},
	"@keyframes mySpinner": {
		from: {
			transform: "rotate(0deg)",
		},
		to: {
			transform: "rotate(360deg)",
		},
	},
}));
