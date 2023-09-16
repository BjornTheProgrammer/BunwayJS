/*
	Websockets Starting Template
*/
import { WebSocketHandler, WebSocketServeOptions } from "bun";
import { Bunway } from "../../src";

// There is two options for websockets. One is to use the built in websocket upgrade, 
// or you can do it yourself.

// For option one, just modify the Bunway object to have these websocketEnabled set to true. 
// websocketPath is by default '/ws'.
const app = new Bunway({ websocketEnabled: true, websocketPath: '/socket' });

// Option two
app.any('/websockets', ({ req, res, server }) => {
	if (!server.upgrade(req)) res.send(new Response("Upgrade failed :(", { status: 500 }));
})

// Add routes to app
app.get('/', ({ res }) => {
	res.send(new Response('Websockets', { status: 200 }));
});

// Define a websocket object and add you logic.
const websocket: WebSocketHandler = {
	message(ws, message) {
	    if (message === 'ping') ws.send('pong');
	    else ws.send('recieved ping!');
	},
}

// choose which bun serve options you want to use, and provide the websocket object.
app.listen<WebSocketServeOptions>({ port: 3000, websocket });
console.log('Bunway is online!')
