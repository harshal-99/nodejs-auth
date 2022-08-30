import {validationResult} from "express-validator";

export const errorHandler = (error, request, response, next) => {
	console.log(error.name)
	console.log(error.message)
	switch (error.name) {
		case 'ValidationError':
			return response.status(400).json({error: error.message})
		case 'JsonWebTokenError':
			return response.status(401).json({error: 'invalid token'})
		case 'TokenExpiredError':
			return response.status(401).json({error: 'token expired'})
	}
	next(error)
}

export const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "unknown endpoint"})
}

export const validateErrors = (request, response, next) => {
	const errors = validationResult(request)
	if (!errors.isEmpty()) {
		return response.status(400).json({error: errors.array()})
	}
}
