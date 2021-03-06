import { RequestEndpoint } from "../../../../api/enum/RequestEndpoint";
import { RequestType } from "../../../../api/enum/RequestType";
import RequestCore from "../../../../api/requests/RequestCore";
import { GetRidesResponse } from "./GetRidesResponse";

export class GetRidesRequest extends RequestCore {
	constructor(init: {
		userId: string,
		owned?: boolean;
		participated?: boolean;
		past?: boolean;
	}) {
		super({
			properties: {
				method: RequestType.GET,
				endpoint: RequestEndpoint.GET_RIDES_BY_USER_ID,
				queries: {
					userId: init.userId,
					owned: init.owned,
					past: init.past,
					participated: init.participated,
				},
			}
		});
	}
	async send() {
		return await super.fetch<GetRidesResponse>();
	}
}
