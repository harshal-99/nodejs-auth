import {Router} from "express";
import {body} from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import User from "../model/user.js";
import {validateErrors} from "../utils/middleware.js";

const authRouter = Router()

authRouter.post('/register',
	body('username').isString().trim().escape().isLength({min: 3}).withMessage('Username should be at least 3 chars long'),
	body('password').isString().trim().escape().isLength({min: 3}).withMessage('Password should be at least 3 chars long'),
	async (request, response, next) => {
		validateErrors(request, response, next)
		if (response.headersSent) return

		const {username, password} = request.body
		const passwordHash = await bcrypt.hash(password, 10)

		const user = new User({
			username, passwordHash
		})
		const savedUser = await user.save()
		response.status(201).json(savedUser)
	})

authRouter.post('/login',
	body('username').isString().trim().escape(),
	body('password').isString().trim().escape(),
	passport.authenticate('local', {}),
	async (request, response, next) => {
		response.status(200).json(request.user.toJSON())
	}
)

authRouter.post('/logout',
	async (request, response, next) => {
		request.logout((err) => {
			if (err) {
				console.log('err', err)
				return next(err)
			}
			if (response.headersSent) return
			response.json({message: 'logged out'})
		})
	})

authRouter.get('/', async (request, response, next) => {
	if (request.isAuthenticated()) {
		response.status(200).json({message: "you are logged in"})
	} else {
		response.status(400).json({message: "you are not logged in"})
	}
})

export default authRouter
