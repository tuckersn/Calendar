import React, { useMemo } from "react";
import { useState } from "react";
import styled from "styled-components";
import { ButtonToggle } from "../inputs/ButtonToggle";
import { TextInput } from "../inputs/TextInput";
import { Popup } from "../style/Popup";
import { Event } from "../../shared/calendar/event";
import { MdEdit } from "react-icons/md";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor, Descendant } from "slate";
import { TextEditor } from "../inputs/TextEditor";
import { Button } from "@mui/material";

export interface EventPopupProps {
	event: Event | null;
	active: boolean;
	setActive: (active: boolean) => void;
}

const EventPopupContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	position: relative;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;

	>* {
		margin-top: 16px;
	}
`;

const EventPopupTitle = styled.div`
	font-size: 24px;
	font-weight: bold;
	color: white;
	overflow: hidden;
`;

const EventPopupDescription = styled.div`
	font-size: 18px;
	color: white;
	overflow: hidden;
`;


export function EventPopup(props: EventPopupProps) {
	const { active, setActive, event } = props;
	const [editMode, setEditMode] = useState(false);

	const [title, setTitle] = useState(event ? event.title : "");



	return (
		<Popup active={active} setActive={setActive}>
			<EventPopupContainer>
				{ 
					event === null ? null :	(editMode ? (<React.Fragment>
						<EventPopupTitle>
							Editing {title}
						</EventPopupTitle>
						
						<TextInput label="Title" value={title} onValueChange={(v) => {
							setTitle(v);
						}}></TextInput>
						{/* <TextInput label="Description" value={description} onValueChange={(v) => {
							setDescription(v);
						}}></TextInput> */}
						<TextEditor outerStyle={{
							flex: 1
						}}/>
						<div style={{
							border: "1px solid white",
							padding: "8px",
							marginTop: "8px",
						}}>
							Time picker would go here: {event.start.toLocaleDateString()} - {event.end.toLocaleDateString()}
						</div>
						<div style={{
							fontSize: "14px",
							color: "grey",
						}}>Event id: {event.id}</div>
						<div style={{
							display: "flex",
							width: "100%"
						}}>
							<Button variant="outlined">
								Close
							</Button>
							<Button variant="outlined">
								Revert
							</Button>
							<Button style={{
								alignSelf: "flex-end",
								marginLeft: "auto"
							}} variant="contained">
								Save
							</Button>
						</div>
					</React.Fragment>) : 
					<React.Fragment>
						<EventPopupTitle>{event.title}</EventPopupTitle>
						<EventPopupDescription>{event.description}</EventPopupDescription>
						<div>{event.start.toLocaleDateString()} to {event.end.toLocaleDateString()}</div>
						<div style={{
							fontSize: "14px",
							color: "grey",
						}}>Event id: {event.id}</div>
					</React.Fragment>)
				}
				<div style={{
					position: "absolute",
					top: 0,
					right: 0
				}}>
					<ButtonToggle small active={editMode} setActive={setEditMode}>
						<MdEdit size={18}/>
					</ButtonToggle>
				</div>
			</EventPopupContainer>
		</Popup>
	);
}
	