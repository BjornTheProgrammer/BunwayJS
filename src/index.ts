import { RouteConfig, MiddlewareFuncOptions, ErrorFuncOptions, BunAppOptions, FuncOptions, Params } from "./types";
import { BunwayResponse } from "./response";
import { BunwayRouter } from "./router";
import { ServeOptions, Server } from "bun";
import { addToRouteConfig } from "./utils";

export class Bunway {
	private index: number = 0;
	private routeConfig: RouteConfig[] = [];
	private websocketEnabled: boolean;
	private websocketPath: string;
	private afterMiddleware: MiddlewareFuncOptions[] = [];
	private errorFunction?: ErrorFuncOptions;
	private beforeMiddleware: MiddlewareFuncOptions[] = [
		({req, res, server}) => {
			const url = new URL(req.url);
			if (this.websocketEnabled && url.pathname === this.websocketPath && !server.upgrade(req)) {
				res.send(new Response(null, { status: 404 }));
			};
		}
	];

	constructor({ websocketEnabled = false, websocketPath = '/ws' }: BunAppOptions) {
		this.websocketPath = websocketPath;
		this.websocketEnabled = websocketEnabled;
	}

	before (func: MiddlewareFuncOptions) {
		this.beforeMiddleware.push(func);
	}
	after (func: MiddlewareFuncOptions) {
		this.afterMiddleware.push(func);
	}

	any (path: string, func: FuncOptions | BunwayRouter) {
		addToRouteConfig(this.routeConfig, path, func, 'ANY');
	}

	get (path: string, func: FuncOptions) {
		addToRouteConfig(this.routeConfig, path, func, 'GET');
	}

	post (path: string, func: FuncOptions) {
		addToRouteConfig(this.routeConfig, path, func, 'POST');
	}

	put (path: string, func: FuncOptions) {
		addToRouteConfig(this.routeConfig, path, func, 'PUT');
	}

	patch (path: string, func: FuncOptions) {
		addToRouteConfig(this.routeConfig, path, func, 'PATCH');
	}

	delete (path: string, func: FuncOptions) {
		addToRouteConfig(this.routeConfig, path, func, 'DELETE');
	}

	async run (req: Request, server: Server) {
		const url = new URL(req.url);

		// '/path/to/thing' -> ['path', 'to', 'thing']
		const subdirs = url.pathname.slice(1).split('/');


		return await runMethodRequest(req, subdirs, this.routeConfig, server);
	}

	error (func: ErrorFuncOptions) {
		this.errorFunction = func;
	}

	listen<BunServeOptions = ServeOptions> (options?: Omit<BunServeOptions, 'fetch'>) {
		const self = this;

		return Bun.serve<BunServeOptions>({
			async fetch (req: Request, server: Server) {
				// Run before middleware.
				for (const middleware of self.beforeMiddleware) {
					const res = new BunwayResponse();
					await middleware({req, res, server});
					const response = res.getSend();
					if (response !== undefined) return response;
				}

				// Run route
				const response = await self.run(req, server);
				if (response !== undefined) return response;

				// Run after middleware
				for (const middleware of self.afterMiddleware) {
					const res = new BunwayResponse();
					await middleware({req, res, server});
					const response = res.getSend();
					if (response !== undefined) return response;
				}

				// Run catch all error route
				if (self.errorFunction) return self.errorFunction({req, server, extra: { params: {}, wildcard: '' }});
				else return new Response('404!', { status: 404 });
			},
			...options
		});
	}
}

async function runMethodRequest (req: Request, subdirs: string[], mapObjs: RouteConfig[], server: Server) {
	const method = req.method;
	const obj = getNCompatibleRoute(0, subdirs, mapObjs, method)
	if (!obj) return;
	const { route, params, wildcard } = obj;

	const res = new BunwayResponse();
	await route.function({req, res, server, extra: { params, wildcard }});
	return res.getSend();
}

function getNCompatibleRoute (n: number, subdirs: string[], routeConfig: RouteConfig[], method: string) {
	let i = 0;
	for (const route of routeConfig) {
		if (!(route.method === 'ANY' || route.method === method)) continue;
		const routePath = route.path.slice(1).split('/');

		if (routePath.length !== subdirs.length && !route.path.includes('*')) continue;

		const compatibleObj = arePathsCompatible(subdirs, routePath);
		if (compatibleObj === false) continue;
		const { params, wildcard } = compatibleObj;
		if (i++ !== n) continue;

		return {route, params, wildcard};
	}

	return null;
}

function arePathsCompatible (subdirs: string[], mapPath: string[]) {
	const params: Params = {};
	const wildcard: string = '';
	for (let i = 0; i < mapPath.length; i++) {
		if (mapPath[i][0] === ':') {
			params[mapPath[i].slice(1)] = subdirs[i];
			continue;
		}
		if (mapPath[i] === '*') return { params, wildcard: subdirs.slice(i).join('/') };
		if (subdirs[i] !== mapPath[i]) return false;
	}

	return { params, wildcard };
}

export function serveStatic (path: string, headers?: object): FuncOptions {
	return async ({ req, res, extra }) => {
		const file = Bun.file(`./${path}/${extra.wildcard}`);

		if (await file.exists()) res.send(new Response(file, {
			headers: {
				"Content-Type": file.type,
				...headers
			},
		}));
	}
}
