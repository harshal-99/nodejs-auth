import express from "express"
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local"
import MongoStore from "connect-mongo"
import bcrypt from "bcrypt";

import User from "./model/user.js";
import authRouter from "./routes/authRouter.js";
import {errorHandler, unknownEndpoint} from "./utils/middleware.js";
import {configureDB, JWT_SECRET, MONGODB_URI} from "./utils/config.js";

const app = express()

await configureDB()

const sessionStore = new MongoStore({
	mongoUrl: MONGODB_URI,
	// mongooseConnection: connection,
	collection: 'session',

})
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cors())

app.use(session({
	secret: JWT_SECRET,
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 30,
	}
}))


passport.use(new LocalStrategy.Strategy({}, async (username, password, done) => {
	try {
		const user = await User.findOne({username})
		if (!user) return done(null, false, {message: "Incorrect username"})
		const isMatch = await bcrypt.compare(password, user.passwordHash)
		if (!isMatch) {
			return done(null, false, {message: "Incorrect password"})
		}
		return done(null, user)
	} catch (e) {
		return done(e, null)
	}
}))

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		if (!user) return done(null, false, {message: "Invalid User"})
		done(null, user)
	} catch (e) {
		done(e, null)
	}
})


app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
