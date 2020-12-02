import React, { useState } from "react";
import GroupDetailedView, { IGroupDetailedViewProps } from "../detailedView/GroupDetailedView";
import RidesList from "./components/RidesList";
import { useHistory } from "react-router";
import Button from "../../../ui/button/Button";
import { ButtonBackground } from "../../../ui/button/enums/ButtonBackground";
import { ButtonColor } from "../../../ui/button/enums/ButtonColor";
import ButtonLink from "../../../ui/buttonLink/ButtonLink";
import { ButtonLinkBackground } from "../../../ui/buttonLink/enums/ButtonLinkBackground";
import { ButtonLinkColor } from "../../../ui/buttonLink/enums/ButtonLinkColor";
import {ButtonLinkStyle} from "../../../ui/buttonLink/enums/ButtonLinkStyle";
import { mainRoutes } from "../../../layout/components/LayoutRouter";
import ridesExample from "../../../../examples/exampleRides";
import { IRide } from "../../../../components/groups/interfaces/IRide";
import MediaQuery from "react-responsive";
import MapBoxRides from "../../../map/MapBoxRides";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { IReactI18nProps } from "../../../system/resources/IReactI18nProps";
import GroupsRouter from "../GroupsRouter";

interface IGroupRidesProps extends IGroupDetailedViewProps, RouteComponentProps, IReactI18nProps {

}

const GroupRides = (props: IGroupRidesProps) => {
	const history = useHistory();
	const cssClasses = {
		container: "ridesContainer",
		leftPanel: "rides--leftPanel",
		rightPanel: "rides--rightPanel",
		rightTopPanel: "rides--rightPanel__top",
		rightBottomPanel: "rides--rightPanel__bottom",
		leftLabels: "rides--leftPanel__label",
		leftList: "rides--leftPanel__list",
		leftOutline: "rides--leftPanel__outline",
		leftLabelsText: "rides--leftPanel__text"
	};
	const resources = {
		add: "addBtn",
		back: "prevBtn"
	};

	const rides: IRide[] = ridesExample;
	const [selectedRide, setSelectedRide] = useState(null);

	const setRide = (ride: IRide) => {
		if (ride !== null) {
			setSelectedRide(ride);
		}
	};
	const { url } = props.match;
	const { t } = props;

	return (
		<GroupDetailedView group={props.group}>
			<div className={cssClasses.leftPanel}>
			<div className={cssClasses.leftLabelsText}> {props.group.name}</div>
				<div className={cssClasses.leftLabels}>
					<Button onClick={() => {
						history.push(`/${mainRoutes.groups}`);
					}}
						background={ButtonBackground.Blue}
						color={ButtonColor.White}
					>
						{t(resources.back)}
					</Button>
					<ButtonLink
						style={ButtonLinkStyle.Button}
						color={ButtonLinkColor.Gray}
						background={ButtonLinkBackground.Gray}
						to={`${url}${GroupsRouter.routes.addGroup}`}
					>
						{t(resources.add)}
					</ButtonLink>
				</div>
				<div>

				</div>
				<div className={cssClasses.leftOutline}></div>
				<div className={cssClasses.leftList}>
					<RidesList rideSelected={selectedRide} setRide={setRide} rides={rides} />
				</div>
			</div>
			<MediaQuery query="(min-width: 900px)">
				<div className={cssClasses.rightPanel}>
					<MapBoxRides ride={selectedRide}></MapBoxRides>
				</div>
			</MediaQuery>
		</GroupDetailedView>

	);
};

export default withTranslation()(withRouter(GroupRides));
