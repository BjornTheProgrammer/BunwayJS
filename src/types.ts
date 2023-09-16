import { Server } from "bun";
import { BunwayResponse } from "./response";

export type Params = { [key:string]: string }
export type ExtraContext = { params: Params, wildcard: string };
export type Context = { req: Request, res: BunwayResponse, server: Server, extra: ExtraContext };

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'ANY';

export type ErrorFuncOptions = (context: Omit<Context, 'res'>) => Response;
export type MiddlewareFuncOptions = (context: Omit<Context, 'extra'>) => void | Promise<void>;
export type FuncOptions = (context: Context) => void | Promise<void>;
export type RouteConfig = { method: HTTPMethod, path: string, function: FuncOptions }

export type BunAppOptions = {
	websocketEnabled?: boolean,
	websocketPath?: string,
}
