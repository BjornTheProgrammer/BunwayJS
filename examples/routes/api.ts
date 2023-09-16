/*
	API Router
*/
import { BunwayRouter } from "../../src/router";

export const router = new BunwayRouter();

router.get('/current-year', ({res}) => {
	res.send(new Response(`${new Date().getFullYear()}`))
})

router.get('/current-month', ({res}) => {
	res.send(new Response(`${new Date().getMonth()}`))
})
