import { Epic, ofType } from "redux-observable";
import { switchMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import {
	GroupsAction,
	GroupsActionTypes,
	IAddGroupAction,
	IAddGroupActionSuccess,
	IGetGroupsAction,
	IGetGroupsActionSuccess,
	IGetInvitesAction,
	IGetInvitessActionSuccess,
	InviteAction,
	InvitesActionTypes,
	IAnswerInviteAction,
	IAnswerInviteActionSuccess,
	RideAction,
	RidesActionTypes,
	IGetRidesAction,
	IGetRidesActionSuccess,
	IParticipateInRideAction,
	IParticipateInRideActionSuccess,
} from "./Types";
import { apiRequest, IRequestProps } from "../../../api/apiRequest";
import { RequestType } from "../../../api/enum/RequestType";
import { RequestEndpoint } from "../../../api/enum/RequestEndpoint";
import _ from "lodash";
import { toast } from "react-toastify";
import { tempUserId } from "../../../api/useRequest";

const tempCoords: Object = {
	"longitude": 0,
	"latitude": 0
}; // TODO: ZAORAĆ< POIBIERAC LAT,LNG

const addGroupEpic: Epic<GroupsAction> = (action$) =>
	action$.pipe(
		ofType(GroupsActionTypes.AddGroup),
		switchMap(async (action: IAddGroupAction) => {
			const response = await apiRequest({
				method: RequestType.POST,
				endpoint: RequestEndpoint.POST_ADD_GROUP,
				body: {
					name: action.group.name,
					code: action.group.code,
					ownerId: tempUserId,
				},
			});
			return response.result;
		}),
		mergeMap((response) => {
			return [
				<IAddGroupActionSuccess>{
					type: GroupsActionTypes.AddGroupSuccess,
					newGroup: response,
				},
			];
		}),
		catchError((err: Error) =>
			of(<any>{
				type: GroupsActionTypes.AddGroupError,
				error: err,
			})
		)
	);

const getGroupsEpic: Epic<GroupsAction> = (action$) =>
	action$.pipe(
		ofType(GroupsActionTypes.GetGroups),
		switchMap(async (action: IGetGroupsAction) => {
			let requestBody: IRequestProps;
			if (action.userOnly) {
				requestBody = {
					method: RequestType.GET,
					endpoint: RequestEndpoint.GET_USER_GROUPS,
					userId: tempUserId,
				};
			} else {
				requestBody = {
					method: RequestType.GET,
					endpoint: RequestEndpoint.GET_ALL_GROUPS,
				};
			}
			const response = await apiRequest(requestBody);
			return response.result;
		}),
		mergeMap((response) => {
			return [
				<IGetGroupsActionSuccess>{
					type: GroupsActionTypes.GetGroupsSuccess,
					groups: response,
				},
			];
		}),
		catchError((err: Error) =>
			of(<any>{
				type: GroupsActionTypes.GetGroupsError,
				error: err,
			})
		)
	);

const getInvitesEpic: Epic<InviteAction> = (action$) =>
	action$.pipe(
		ofType(InvitesActionTypes.GetInvites),
		switchMap(async (action: IGetInvitesAction) => {
			let requestBody: IRequestProps;
			if (action.userOnly) {
				requestBody = {
					// TODO
					method: RequestType.GET,
					endpoint: RequestEndpoint.GET_INVITES_BY_USER_ID,
					userId: tempUserId,
				};
			} else {
				requestBody = {
					method: RequestType.GET,
					endpoint: RequestEndpoint.GET_ALL_INVITES,
				};
			}
			const response = await apiRequest(requestBody);
			return response.result;
		}),
		mergeMap((response) => {
			return [
				<IGetInvitessActionSuccess>{
					type: InvitesActionTypes.GetInvitesSuccess,
					invites: response,
				},
			];
		}),
		catchError((err: Error) =>
			of(<any>{
				type: InvitesActionTypes.GetInvitesError,
				error: err,
			})
		)
	);

const answerInviteEpic: Epic<InviteAction> = (action$) =>
	action$.pipe(
		ofType(InvitesActionTypes.AnswerInvite),
		switchMap(async (action: IAnswerInviteAction) => {
			let requestBody: IRequestProps = {
				method: RequestType.PUT,
				endpoint: RequestEndpoint.PUT_CHANGE_INVITE,
				inviteId: action.inviteId,
				body: {
					groupInviteId: action.inviteId,
					isAccepted: action.accepted,
				},
			};
			const response = await apiRequest(requestBody);
			return {
				response: response.result,
				id: action.inviteId,
			};
		}),
		mergeMap((result) => {
			if (result.response === "ok") {
				return [
					<IAnswerInviteActionSuccess>{
						type: InvitesActionTypes.AnswerInviteSuccess,
						inviteId: result.id,
					},
					<IGetGroupsAction>{
						type: GroupsActionTypes.GetGroups,
						userOnly: true,
					}
				];
			} else {
				throw "Error occured in answering invitation";
			}
		}),
		catchError((err: Error) =>
			of(<any>{
				type: InvitesActionTypes.AnswerInviteError,
				error: err,
			})
		)
	);

const getRidesEpic: Epic<RideAction> = (action$) =>
	action$.pipe(
		ofType(RidesActionTypes.GetRides),
		switchMap(async (action: IGetRidesAction) => {
			let requestBody: IRequestProps = {
				// TODO
				method: RequestType.GET,
				endpoint: RequestEndpoint.GET_RIDES_AVAILABLE_BY_USER_ID,
				userId: action.userOnly ? tempUserId : null,
			};
			const response = await apiRequest(requestBody);
			return response.result;
		}),
		mergeMap((response) => {
			return [
				<IGetRidesActionSuccess>{
					type: RidesActionTypes.GetRidesSuccess,
					rides: response,
				},
			];
		}),
		catchError((err: Error) =>
			of(<any>{
				type: RidesActionTypes.GetRidesError,
				error: err,
			})
		)
	);

const participateInRideEpic: Epic<RideAction> = (action$) =>
	action$.pipe(
		ofType(RidesActionTypes.ParticipateInRide),
		switchMap(async (action: IParticipateInRideAction) => {
			let requestBody: IRequestProps = {
				// TODO
				method: RequestType.POST,
				endpoint: RequestEndpoint.PUT_RIDE_ADD_PARTICIPANT,
				rideId: action.rideId,
				body: {
					participantId: tempUserId,
					coordinates: tempCoords,
				}
			};
			const response = await apiRequest(requestBody);
			// return response;
			return {
				id: action.rideId,
			};
		}),
		mergeMap(response => {
			toast.success("Succesfully participated in ride!");
			return [
				<IGetRidesAction>{
					type: RidesActionTypes.GetRides,
					userOnly: true,
				},
				<IParticipateInRideActionSuccess>{
					type: RidesActionTypes.ParticipateInRideSuccess,
					rideId: response.id,
				}
			];
		}),
		catchError((err: Error) => {
			toast.error("Could not participate in ride :(");
			return of(<any>{
				type: RidesActionTypes.ParticipateInRideError,
				error: err,
			});
		})
	);

export const groupEpics = [addGroupEpic, getGroupsEpic, getInvitesEpic, answerInviteEpic, getRidesEpic, participateInRideEpic];