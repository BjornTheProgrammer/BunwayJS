/*
	Routes Starting Template
*/
import { Bunway } from "../../src";
import { router } from "./api";

// Create app
const app = new Bunway({});

// Add routes to app
app.get('/', ({ res }) => {
	res.send(new Response('Hello World!'));
})

app.get('/hello', ({ res, extra }) => {
	res.send(new Response(`World`));
})

// Add all router routes under /api
app.any('/api', router);

app.listen({ port: 3000 });
console.log('Bunway is online!')
