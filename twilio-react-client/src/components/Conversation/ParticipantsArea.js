import React from "react";
import {
	Grid,
	Divider,
	TextField,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Avatar,
	Fab,
} from "@material-ui/core";

import { Add } from "@material-ui/icons";

function ParticipantsArea() {
	let phoneNumber,
		setPhoneNumber,
		conversation,
		handleAddByPhoneNumber,
		participants = []; // need to implement using the conversation class

	return (
		<>
			<Grid item xs={12}>
				<Grid container>
					<Grid item xs={10}>
						<TextField
							// required
							id="add-phone-input"
							label="Add phone participant"
							type="text"
							InputProps={{ maxLength: 10, minLength: 10 }}
							placeholder="1231231234"
							value={phoneNumber}
							disabled={!conversation}
							onChange={(e) => setPhoneNumber(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={2} align="right">
						<Fab
							type="submit"
							color="secondary"
							aria-label="add-participant"
							onClick={handleAddByPhoneNumber}
							disabled={!conversation}
						>
							<Add />
						</Fab>
					</Grid>
				</Grid>

				<Divider />
				<Grid direction="row">
					<List>
						{participants.map((member, index) => (
							<ListItem button key={member}>
								<ListItemIcon>
									<Avatar
										alt={member}
										src={`https://material-ui.com/static/images/avatar/${
											index + 1
										}.jpg`}
									/>
								</ListItemIcon>
								<ListItemText primary={member} />
								<ListItemText secondary="status" align="right"></ListItemText>
							</ListItem>
						))}
					</List>
				</Grid>
				<Divider />
			</Grid>
		</>
	);
}

export default ParticipantsArea;
