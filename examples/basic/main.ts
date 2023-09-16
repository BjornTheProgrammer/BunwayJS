/*
	Basic Starting Template
*/
import { Bunway } from "../../src";

// Create app
const app = new Bunway({});

// Add routes to app
app.get('/', ({ res }) => {
	// res contians a method to send resposes to client
	res.send(new Response('Hello World!'));
})

// If user sends body like so, { name: 'Bjorn' }, will respond with "Hello Bjorn!"
app.post('/user', async ({ req, res }) => {
	const body = await req.json()
	if (!body) return;
	
	const { name } = body;

	res.send(new Response(`Hello ${name}!`));
})

// You can use the parameter as a variable, much like express
app.get('/book/:id', ({ res, extra }) => {
	const { id } = extra.params;
	res.send(new Response(`Getting book with id of ${id}`));
})

// Wildcards will match to everything with a * after it.
app.get('/recipe/*', ({ res, extra }) => {
	// wildcard variable will give you everything after the * from the route
	const { wildcard } = extra

	res.send(new Response(wildcard));
})

app.listen({ port: 3000 });
console.log('Bunway is online!')
