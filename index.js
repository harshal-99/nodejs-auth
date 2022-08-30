import * as http from "http";
import app from "./src/app.js";
import {PORT} from "./src/utils/config.js";

const server = http.createServer(app)

server.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})
