/*
	Static Serve Starting Template
*/
import { Bunway, serveStatic } from "../../src";

// Create app
const app = new Bunway({});

// Add routes to app
app.any('/public/*', serveStatic('/public'));

app.listen({ port: 3000 });
console.log('Bunway is online!')
