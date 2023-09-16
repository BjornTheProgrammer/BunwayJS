import { expect, test, describe } from "bun:test";
import { Bunway, serveStatic } from "../src";
import { Server } from "bun";

const port = process.env.PORT || 3000;

describe('Testing Static Serving', async () => {
	let server: Server;

	test('Starting Server', () => {
		const app = new Bunway({});

		app.any('/public/*', serveStatic('public'))

		server = app.listen({ port });
	})

	test("/public/index.html", async () => {
		const response = await fetch(`http://localhost:${port}/public/index.html`)
		expect(await response.text()).toContain('<html>');
	});

	test("/public/main.js", async () => {
		const response = await fetch(`http://localhost:${port}/public/main.js`)
		expect(await response.text()).toContain('getElementById');
	});

	test("/public/css/style.css", async () => {
		const response = await fetch(`http://localhost:${port}/public/css/style.css`)
		expect(await response.text()).toContain('background-color');
	});

	test('Stopping Server', () => {
		server.stop(true);
	})
}) 
