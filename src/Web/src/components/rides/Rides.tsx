import React, { useState } from "react";
import { useHistory } from "react-router";
import ButtonSmall from "../ui/buttonSmall/ButtonSmall";
import { ButtonSmallBackground } from "../ui/buttonSmall/enums/ButtonSmallBackground";
import { ButtonSmallColor } from "../ui/buttonSmall/enums/ButtonSmallColor";
import { ButtonSmallIcon } from "../ui/buttonSmall/enums/ButtonSmallIcon";
import ButtonLink from "../ui/buttonLink/ButtonLink";
import { ButtonLinkBackground } from "../ui/buttonLink/enums/ButtonLinkBackground";
import { ButtonLinkColor } from "../ui/buttonLink/enums/ButtonLinkColor";
import {ButtonLinkStyle} from "../ui/buttonLink/enums/ButtonLinkStyle";
import { mainRoutes } from "../layout/components/LayoutRouter";
import ridesExample from "../../examples/exampleRides";
import { IRide } from "../../components/groups/interfaces/IRide";
import MediaQuery from "react-responsive";
import MapBoxRides from "../map/MapBoxRides";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { IReactI18nProps } from "../system/resources/IReactI18nProps";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RidesOwner from "./components/RidesOwner";
import RidesParticipant from "./components/RidesParticipant";
import moment from "moment";
import "./Rides.scss";
import { random } from "lodash";
import exampleRides from "../../examples/exampleRides";

interface IRidesProps extends RouteComponentProps, IReactI18nProps {

}

const Rides = (props: IRidesProps) => {
	const cssClasses = {
		container: "rides--container",
		leftPanel: "rides--leftPanel",
		rightPanel: "rides--rightPanel",
		rightTopPanel: "rides--rightPanel__top",
		rightBottomPanel: "rides--rightPanel__bottom",
		leftLabels: "rides--leftPanel__label",
		leftList: "rides--leftPanel__list",
		leftOutline: "rides--leftPanel__outline",
		leftLabelsText: "rides--leftPanel__text",
		switchActive: "rides--leftPanel__switchActive",
		switch: "rides--leftPanel__switch",
		dateBar: "dateBar",
		dateBarRange: "dateBar__range",
		dateBarArrow: "dateBar__arrow"
	};

	const resources = {
		add: "addBtn",
		participant: "common.passenger",
		owner: "common.driver"
	};
	const ids = {
		to: "toId",
		from: "fromId"
	};

	// Pobierać dane z serwera z odpowiedniego endpointu
	const [ridesParticipant, setRidesParticipant] = useState(exampleRides);
	const [ridesOwner, setRidesOwner] = useState(exampleRides);

	const [selectedRide, setSelectedRide] = useState(null);
	const [userOwner, setUserOwner] = useState(false);
	const [switchCssClass, setSwitchCssClass] = useState({from: cssClasses.switchActive, to: null});

	const setRide = (ride: IRide) => {
		if (ride !== null) {
			setSelectedRide(ride);
		}
	};
	const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserOwner(event.target.checked);
		setSelectedRide(null);
		if (event.target.checked) {
			setSwitchCssClass({from: null, to: cssClasses.switchActive});
		} else {
			setSwitchCssClass({from: cssClasses.switchActive, to: null});
		}
	};

	const getWeek = offset => {
		const start = moment()
			.add(offset, "weeks")
			.startOf("isoWeek");
		const end = moment()
			.add(offset, "weeks")
			.endOf("isoWeek");
		const current = start.clone();
		const week = [];

		while (current.isBefore(end)) {
			week.push(current.format("YYYY-MM-DD"));
			current.add(1, "day");
		}

		return week;
	};
	const getDates = offset => {
		const week = getWeek(offset);
		const range = `${moment(week[0]).format("DD.MM")} - ${moment(week[6]).format(
			"DD.MM",
		)}`;

		const firstDay = moment(week[0]).format();
		const lastDay = moment(week[6]).format();
		return {
			firstDay,
			lastDay,
			range,
			week,
		};
	};
	const [dateOffset, setDateOffset] = useState(0);
	const [date, setDate] = useState(getDates(0));

	const onNextDate = () => {
		const newOffset = dateOffset + 1 ;
		setDate(getDates(newOffset));
		setDateOffset(newOffset);
		setSelectedRide(null);
	};
	const onPrevDate = () => {
		const newOffset = dateOffset - 1 ;
		setDate(getDates(newOffset));
		setDateOffset(newOffset);
		setSelectedRide(null);
	};

	const matchRides = (rides: IRide[]) => {

		const filtered = rides.filter(ride => {
			const current = moment(ride.date);
			if (current.isBetween(moment(date.firstDay), moment(date.lastDay))) {
				return ride;
			}
		});

		if (filtered.length) {
			return filtered;
		}
		return [];
	};

	const renderOwnerList = () => (
		<RidesOwner firstDay={date.firstDay} lastDay={date.lastDay} rideSelected={selectedRide} setRide={setRide} rides={ridesOwner} />
	);
	const renderParticipantList = () => (
		<RidesParticipant firstDay={date.firstDay} lastDay={date.lastDay} rideSelected={selectedRide} setRide={setRide} rides={ridesParticipant}/>
	);

	const UserSwitch = withStyles({
		switchBase: {
			color: "#6b98d1",
			"&$checked": {
				color: "#6b98d1",
			},
			"&$checked + $track": {
				backgroundColor: "#707070",
			},
			"& + $track": {
				backgroundColor: "#707070",
			}
		},
		checked: {},
		track: {},
	})(Switch);

	const renderList = () => {

		let list: JSX.Element;
		if (userOwner) {
			list = renderOwnerList();
		}	else {
			list = renderParticipantList();
		}
		return list;
	};

	const { url } = props.match;
	const { t } = props;

	return (
		<div className = {cssClasses.container}>
			<div className={cssClasses.leftPanel}>
				<div className={cssClasses.leftLabels}>
					<span> {t("Moje przejazdy")} </span>
					<ButtonLink
						style={ButtonLinkStyle.Button}
						color={ButtonLinkColor.Gray}
						background={ButtonLinkBackground.Gray}
						// to={`${url}${GroupsRouter.routes.addGroup}`}
					>
						{t(resources.add)}
					</ButtonLink>
				</div>
				<div className={cssClasses.switch}>
					<span className={switchCssClass.from} id={ids.from}> {t(resources.participant)}</span>
						<FormControlLabel
							control={<UserSwitch size="medium" checked={userOwner} onChange={handleSwitchChange} />}
							label=""
						/>
					<span className={switchCssClass.to} id={ids.to}> {t(resources.owner) }</span>
				</div>
				<div className={cssClasses.dateBar}>
					<div>
						<ButtonSmall
							className={cssClasses.dateBarArrow}
							color={ButtonSmallColor.Gray}
							background={ButtonSmallBackground.White}
							icon={ButtonSmallIcon.Left}
							onClick={() => onPrevDate()}
						/ >
					</div>
					<div className={cssClasses.dateBarRange}>{date.range}</div>
					<div >
						<ButtonSmall
							className={cssClasses.dateBarArrow}
							color={ButtonSmallColor.Gray}
							background={ButtonSmallBackground.White}
							icon={ButtonSmallIcon.Right}
							onClick={() => onNextDate()}
						/ >
					</div>
				</div>
				<div className={cssClasses.leftOutline}></div>
				<div className={cssClasses.leftList}>
				{renderList()}
				</div>
			</div>
			<MediaQuery query="(min-width: 900px)">
				<div className={cssClasses.rightPanel}>
					<MapBoxRides ride={selectedRide}></MapBoxRides>
				</div>
			</MediaQuery>
		</div>
	);
};

export default withTranslation()(withRouter(Rides));