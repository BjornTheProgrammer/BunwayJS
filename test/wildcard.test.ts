import { expect, test, describe } from "bun:test";
import { Bunway } from "../src";
import { Server } from "bun";

const port = process.env.PORT || 3000;

describe('Testing Wildcard Matching', async () => {
	let server: Server;

	test('Starting Server', () => {
		const app = new Bunway({});

		app.get('/test/a', (({res}) => {
			res.send(new Response('/test/a', { status: 200 }));
		}))
		
		app.get('/test/*', (({res}) => {
			res.send(new Response('/test/*', { status: 200 }));
		}))

		app.get('/test/b', (({res}) => {
			res.send(new Response('/test/b', { status: 200 }));
		}))

		server = app.listen({ port });
	})

	test("/test/a", async () => {
		const response = await fetch(`http://localhost:${port}/test/a`)
		expect(await response.text()).toBe('/test/a');
	});

	test("/test/b", async () => {
		const response = await fetch(`http://localhost:${port}/test/b`)
		expect(await response.text()).toBe('/test/*');
	});

	test("/test/c", async () => {
		const response = await fetch(`http://localhost:${port}/test/c`)
		expect(await response.text()).toBe('/test/*');
	});

	test('Stopping Server', () => {
		server.stop(true);
	})
}) 
