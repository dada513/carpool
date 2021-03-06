import { Epic, ofType } from "redux-observable";
import { switchMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import {
	GroupsAction,
	GroupsActionTypes,
	IAddGroupAction,
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
	IParticipateInRideActionError, IAddGroupActionError, IAddRideAction, IAddInvitesAction
} from "./Types";
import _ from "lodash";
import { toast } from "react-toastify";
import { GetGroupsRequest } from "../api/getGroups/GetGroupsRequest";
import { GetGroupsResponse } from "../api/getGroups/GetGroupsResponse";
import { AddGroupRequest } from "../api/addGroup/AddGroupRequest";
import { GetInvitesRequest } from "../api/getInvites/GetInvitesRequest";
import { AnswerInviteRequest } from "../api/answerInvite/AnswerInviteRequest";
import { AnswerInviteResponse } from "../api/answerInvite/AnswerInviteResponse";
import { GetInvitesResponse } from "../api/getInvites/GetInvitesResponse";
import { AddGroupResponse } from "../api/addGroup/AddGroupResponse";
import { GetRidesResponse } from "../api/getRides/GetRidesResponse";
import { GetRidesRequest } from "../api/getRides/GetRidesRequest";
import { ParticipateInRideResponse } from "../api/participateInRide/ParticipateInRideResponse";
import { ParticipateInRideRequest } from "../api/participateInRide/ParticipateInRideRequest";
import { foreach, getId } from "../../../helpers/UniversalHelper";
import { IAuthState } from "../../auth/store/State";
import { UpdateGroupRequest } from "../api/updateGroup/UpdateGroupRequest";
import { UpdateGroupResponse } from "../api/updateGroup/UpdateGroupResponse";
import { AddRideRequest, RideDirection } from "../api/addRide/AddRideRequest";
import { AddRideResponse } from "../api/addRide/AddRideResponse";
import { AddInviteRequest, IAddInviteRequestBody } from "../api/addInvite/AddInviteRequest";

const addGroupEpic: Epic<GroupsAction> = (action$, state$) =>
	action$.pipe(
		ofType(GroupsActionTypes.AddGroup),
		switchMap(async (action: IAddGroupAction) => {
			const ownerId: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
			const request: AddGroupRequest = new AddGroupRequest({
				body: {
					ownerId,
					location: {
						latitude: action.group.location.latitude,
						longitude: action.group.location.longitude,
					},
					code: action.group.code,
					name: action.group.name,
				}
			});
			const response: AddGroupResponse = await request.send();
			if (response.status > 200 || response.isError) {
				toast.error("Error while adding group: " + response.title ?? response.responseException?.exceptionMessage);
				return [
					<IAddGroupActionError>{
						type: GroupsActionTypes.AddGroupError,
						error: new Error(response.title ?? response.responseException?.exceptionMessage)
					}
				];
			} else {
				return [
					<IGetGroupsAction>{
						type: GroupsActionTypes.GetGroups,
						userOnly: false,
					}
				];
			}
		}),
		mergeMap((response) => response),
		catchError((err: Error) =>
			of(<any>{
				type: GroupsActionTypes.AddGroupError,
				error: err,
			})
		)
	);

const getGroupsEpic: Epic<GroupsAction> = (action$, state$) =>
	action$.pipe(
		ofType(GroupsActionTypes.GetGroups),
		switchMap(async (action: IGetGroupsAction) => {
			const uid: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
			const request: GetGroupsRequest = new GetGroupsRequest({
				userId: uid,
			});
			const response: GetGroupsResponse = await request.send();
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

const getInvitesEpic: Epic<InviteAction> = (action$, state$) =>
	action$.pipe(
		ofType(InvitesActionTypes.GetInvites),
		switchMap(async (action: IGetInvitesAction) => {
			const uid: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
			const request: GetInvitesRequest = new GetInvitesRequest({
				userOnly: action.userOnly,
				userId: uid,
			});
			const response: GetInvitesResponse = await request.send();
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
			const request: AnswerInviteRequest = new AnswerInviteRequest({
				groupInviteId: action.inviteId,
				isAccepted: action.accepted
			});
			const response: AnswerInviteResponse = await request.send();
			return {
				response: response.status,
				id: action.inviteId,
			};
		}),
		mergeMap((result) => {
			if (result.response === 200) {
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

const getRidesEpic: Epic<RideAction> = (action$, state$) =>
	action$.pipe(
		ofType(RidesActionTypes.GetRides),
		switchMap(async (_action: IGetRidesAction) => {
			const uid: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
			const ownedRequest: GetRidesRequest = new GetRidesRequest({
				userId: uid,
				owned: true,
			});
			const participatedRequest: GetRidesRequest = new GetRidesRequest({
				userId: uid,
				participated: true,
			});
			const ownedPastRequest: GetRidesRequest = new GetRidesRequest({
				userId: uid,
				owned: true,
				past: true
			});
			const participatedPastRequest: GetRidesRequest = new GetRidesRequest({
				userId: uid,
				participated: true,
				past: true
			});
			const responseOwned: GetRidesResponse = await ownedRequest.send();
			const responseParticipated: GetRidesResponse = await participatedRequest.send();
			const responsePastOwned: GetRidesResponse = await ownedPastRequest.send();
			const responsePastParticipated: GetRidesResponse = await participatedPastRequest.send();
			return {
				owned: responseOwned.result,
				participated: responseParticipated.result,
				ownedPast: responsePastOwned.result,
				participatedPast: responsePastParticipated.result
			};
		}),
		mergeMap((response) => {
			return [
				<IGetRidesActionSuccess>{
					type: RidesActionTypes.GetRidesSuccess,
					ridesOwned: response.owned,
					ridesParticipated: response.participated,
					ridesOwnedPast: response.ownedPast,
					ridesParticipatedPast: response.participatedPast
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
			const request: ParticipateInRideRequest = new ParticipateInRideRequest({
				rideId: action.rideId,
				participantId: getId(),
			});
			const response: ParticipateInRideResponse = await request.send();
			return {
				id: action.rideId,
				isSuccess: response.status === 200,
			};
		}),
		mergeMap(response => {
			if (response.isSuccess) {
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
			} else {
				toast.error("Error while participating in ride, try again...");
				return [
					<IParticipateInRideActionError>{
						type: RidesActionTypes.ParticipateInRideError,
						error: null,
					}
				];
			}
		}),
		catchError((err: Error) => {
			toast.error("Could not participate in ride :(");
			return of(<any>{
				type: RidesActionTypes.ParticipateInRideError,
				error: err,
			});
		})
	);

const addRideEpic: Epic<RideAction> = (action$, state$) => action$.pipe(
	ofType(RidesActionTypes.AddRide),
	switchMap(async (action: IAddRideAction) => {
		const uid: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
		let weekdays: number = 0;
		if (action.input.weekDays.all) {
			weekdays = 1111111;
		} else {
			if (action.input.weekDays.monday) {
				weekdays += 1;
			}
			if (action.input.weekDays.tuesday) {
				weekdays += 10;
			}
			if (action.input.weekDays.wednesday) {
				weekdays += 100;
			}
			if (action.input.weekDays.thursday) {
				weekdays += 1000;
			}
			if (action.input.weekDays.friday) {
				weekdays += 10000;
			}
			if (action.input.weekDays.saturday) {
				weekdays += 100000;
			}
			if (action.input.weekDays.sunday) {
				weekdays += 1000000;
			}
		}
		console.log(action.input);
		const request: AddRideRequest = new AddRideRequest({
			body: {
				rideDirection: action.input.rideDirection,
				date: action.input.date,
				weekDays: weekdays,
				ownerId: uid,
				groupId: action.input.groupId,
				location: action.input.location,
				price: 0,
			},
			recurring: action.input.recurring,
		});
		const response: AddRideResponse = await request.send();
		return <IGetRidesAction>{
			type: RidesActionTypes.GetRides,
		};
	}),
	mergeMap(res => [res]),
);

const addInviteEpic: Epic<InviteAction> = (action$, state$) => action$.pipe(
	ofType(InvitesActionTypes.AddInvites),
	mergeMap(async (action: IAddInvitesAction) => {
		const uid: string = (state$.value.auth as IAuthState).tokenInfo?.payload?.sub;
		const request: AddInviteRequest = new AddInviteRequest({
			body: {
				groupId: action.groupId,
				inviterId: uid,
				inviteAppUserId: undefined,
			}
		});
		action.userIds.forEach(async id => {
			(request.requestBody as IAddInviteRequestBody).inviteAppUserId = id;
			await request.send();
		});
		return [
			<IGetInvitesAction>{
				type: InvitesActionTypes.GetInvites,
				userOnly: true,
			}
		];
	}),
	switchMap(res => res)
)

export const groupEpics = [
	addGroupEpic,
	getGroupsEpic,
	getInvitesEpic,
	answerInviteEpic,
	getRidesEpic,
	participateInRideEpic,
	addRideEpic,
	addInviteEpic,
];
