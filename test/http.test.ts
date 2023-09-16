import { expect, test, describe } from "bun:test";
import { Bunway } from "../src";
import { Server } from "bun";

const port = process.env.PORT || 3000;

describe('Testing single HTTP Methods', () => {
	let server: Server;

	test('Starting Server', () => {
		const app = new Bunway({});
		
		app.get('/', (({res}) => {
			res.send(new Response('Hello World!', { status: 200 }));
		}))

		app.post('/', (({res}) => {
			res.send(new Response('Hello Worldv2!', { status: 200 }));
		}))

		app.patch('/', (({res}) => {
			res.send(new Response('Hello Worldv3!', { status: 200 }));
		}))

		app.put('/', (({res}) => {
			res.send(new Response('Hello Worldv4!', { status: 200 }));
		}))

		app.delete('/', (({res}) => {
			res.send(new Response('Hello Worldv5!', { status: 200 }));
		}))

		server = app.listen({ port });
	})

	test("GET Method", async () => {
		const response = await fetch(`http://localhost:${port}`)
		expect(await response.text()).toBe('Hello World!');
	});

	test("POST Method", async () => {
		const response = await fetch(`http://localhost:${port}`, { method: 'POST' })
		expect(await response.text()).toBe('Hello Worldv2!');
	});

	test("PATCH Method", async () => {
		const response = await fetch(`http://localhost:${port}`, { method: 'PATCH' })
		expect(await response.text()).toBe('Hello Worldv3!');
	});

	test("PUT Method", async () => {
		const response = await fetch(`http://localhost:${port}`, { method: 'PUT' })
		expect(await response.text()).toBe('Hello Worldv4!');
	});

	test("DELETE Method", async () => {
		const response = await fetch(`http://localhost:${port}`, { method: 'DELETE' })
		expect(await response.text()).toBe('Hello Worldv5!');
	});

	test('Stopping Server', () => {
		server.stop(true);
	})
}) 
