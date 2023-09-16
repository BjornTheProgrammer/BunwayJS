import { expect, test, describe } from "bun:test";
import { Bunway, serveStatic } from "../src";
import { Server } from "bun";
import { BunwayRouter } from "../src/router";

const port = process.env.PORT || 3000;

describe('Testing Routers', async () => {
	let server: Server;

	test('Starting Server', () => {
		const app = new Bunway({});

		app.get('/', (({res}) => {
			res.send(new Response('Hello World!', { status: 200 }));
		}))

		const router = new BunwayRouter()

		router.get('/test', (({res}) => {
			res.send(new Response('test route!'));
		}))

		app.any('/tester', router);

		app.get('/tester/test', (({res}) => {
			res.send(new Response('This should not be seen!'))
		}))

		server = app.listen({ port });
	})

	test("/", async () => {
		const response = await fetch(`http://localhost:${port}/`)
		expect(await response.text()).toBe('Hello World!');
	});

	test("/tester/test", async () => {
		const response = await fetch(`http://localhost:${port}/tester/test`)
		expect(await response.text()).toBe('test route!');
	});

	test('Stopping Server', () => {
		server.stop(true);
	})
}) 
