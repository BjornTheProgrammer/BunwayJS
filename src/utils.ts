import { BunwayRouter } from "./router";
import { FuncOptions, HTTPMethod, RouteConfig } from "./types";

export function addToRouteConfig(routeConfig: RouteConfig[], path: string, func: FuncOptions | BunwayRouter, method: HTTPMethod) {
	if (func instanceof BunwayRouter) {
		for (const route of func.routeConfig) routeConfig.push({path: `${path}${route.path}`, function: route.function, method: route.method});
		return;
	}

	routeConfig.push({path, function: func, method});
}
