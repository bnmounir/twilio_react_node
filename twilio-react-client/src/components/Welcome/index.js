import React from "react";
import logo from "../../logo.svg";
import { Button, TextField, Grid, Paper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { useStyles } from "./styles";

export default function Welcome(props) {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<Paper variant="outlined" square>
				<div className={classes.margin}>
					<Grid container spacing={1} alignItems="flex-end">
						<Grid item>
							<AccountCircle />
						</Grid>
						<Grid item>
							<TextField
								minLength={6}
								type="text"
								value={props.username}
								id="username"
								label="Username"
								variant="filled"
								onChange={(e) => props.setUsername(e.target.value)}
							/>
						</Grid>
					</Grid>
				</div>
				<div className={classes.margin}>
					<Grid container spacing={1} alignItems="flex-end">
						<Grid item>
							<AccountCircle />
						</Grid>
						<Grid item>
							<TextField
								type="text"
								value={props.conversation}
								minLength={6}
								id="conversation"
								label="Conversation ID"
								variant="filled"
								onChange={(e) => props.setConversation(e.target.value)}
							/>
						</Grid>
					</Grid>
				</div>

				<Button
					fullWidth
					onClick={() => props.setShowForm(false)}
					variant="contained"
					color="primary"
				>
					Join!
				</Button>
			</Paper>

			<img className={classes.img} src={logo} alt="logo" />
		</div>
	);
}
