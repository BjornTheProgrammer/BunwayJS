import { expect, test, describe } from "bun:test";
import { Bunway } from "../src";
import { Server, WebSocketHandler, WebSocketServeOptions, sleep } from "bun";

const port = process.env.PORT || 3000;

describe('Testing Websocket Connection with HTTP Server', () => {
	let server: Server;

	test('Starting Server', () => {
		const app = new Bunway({ websocketEnabled: true, websocketPath: '/socket' });
		
		app.get('/', (({res}) => {
			res.send(new Response('Hello World Sockets!', { status: 200 }));
		}))

		const websocket: WebSocketHandler = {
			open(ws) {
				ws.send('connected to test!');
			},
			message (ws, message) {
				ws.send(`receieved: ${message}`);
			},
			close(ws, code, message) {
				ws.send(`closed due to ${code}!`);
			}
		}

		server = app.listen<WebSocketServeOptions>({ port, websocket });
	})

	test('GET Method', async () => {
		const response = await fetch(`http://localhost:${port}`)
		expect(await response.text()).toBe('Hello World Sockets!');
	});

	let socket: WebSocket;
	test('Socket Connect', async () => {
		socket = new WebSocket(`ws://localhost:${port}/socket`);
		socket.addEventListener('message', (event) => expect(event.data).toBe('connected to test!'), { once: true });

		// Adding a sleep due to this pending issue here https://github.com/oven-sh/bun/issues/2476
		await sleep(1000);
	});

	test('Socket Message', () => {
		socket.addEventListener("message", event => {
			expect(event.data).toBe('receieved: hello world!');
		}, { once: true });

		socket.send('hello world!');
	})

	test('Socket Close', async () => {
		socket.addEventListener("message", event => {
			expect(event.data).toBe('closed due to 1000!');
		}, { once: true });

		socket.close(1000, 'test')
	})

	test('Stopping Server', () => {
		server.stop(true);
	})
}) 
