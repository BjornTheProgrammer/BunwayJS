export class BunwayResponse {
	private sendResponse?: Response;

	send(res: Response) {
		this.sendResponse = res;
	}

	getSend() {
		return this.sendResponse;
	}
}
