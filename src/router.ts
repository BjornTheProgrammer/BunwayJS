import { FuncOptions, RouteConfig } from "./types";
import { addToRouteConfig } from "./utils";

export class BunwayRouter {
	readonly routeConfig: RouteConfig[] = [];

	get (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'GET')
	}

	post (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'POST')
	}

	patch (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'PATCH')
	}

	put (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'PUT')
	}

	delete (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'DELETE')
	}

	any (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'ANY')
	}
}
