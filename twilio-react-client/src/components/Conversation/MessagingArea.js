import React from "react";
import { Paper, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import moment from "moment";

function MessagingArea({
	messages,
	userEmailOrUniqueID,
	classes,
	messagesEndRef,
}) {
	return (
		<List className={classes.messagesArea}>
			{messages.length > 0
				? messages.map((msg) => {
						let isOwner = userEmailOrUniqueID === msg.author;
						if (msg.media) {
							let imgUrl = msg.tempImgUrl;
							console.log(imgUrl);
							return (
								<ListItem key={msg.sid}>
									<Grid container>
										<Grid item xs={12}>
											<ListItemText align={isOwner ? "right" : "left"}>
												<Paper elevation={3}>
													<img
														className={classes.imgCard}
														alt="mms"
														src={imgUrl}
													/>
												</Paper>
											</ListItemText>
										</Grid>
										<Grid item xs={12}>
											<ListItemText
												align={isOwner ? "right" : "left"}
												secondary={
													isOwner
														? `${moment(msg.dateCreated).fromNow(true)} ago`
														: `${msg.author}. | ${moment(
																msg.dateCreated
														  ).fromNow(true)} ago`
												}
											></ListItemText>
										</Grid>
									</Grid>
								</ListItem>
							);
						} else {
							return (
								<ListItem key={msg.sid}>
									<Grid container>
										<Grid item xs={12}>
											<ListItemText
												align={isOwner ? "right" : "left"}
												primary={msg.body}
											></ListItemText>
										</Grid>
										<Grid item xs={12}>
											<ListItemText
												align={isOwner ? "right" : "left"}
												secondary={
													isOwner
														? `${moment(msg.dateCreated).fromNow(true)} ago`
														: `${msg.author}. | ${moment(
																msg.dateCreated
														  ).fromNow(true)} ago`
												}
											></ListItemText>
										</Grid>
									</Grid>
								</ListItem>
							);
						}
				  })
				: "no messages"}
			<div ref={messagesEndRef} />
		</List>
	);
}

export default MessagingArea;
