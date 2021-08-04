const express = require('express')
const routes = express.Router()

const UserController = require("../app/controllers/UserController")

const UserValidator = require("../app/validators/user")
const RouteValidator = require("../app/validators/routes-block")

routes.get('/', RouteValidator.admin, UserController.list) 
routes.post('/', RouteValidator.admin, UserValidator.post, UserController.post) 
routes.get('/create', RouteValidator.admin, UserController.create) 
routes.put('/:id', RouteValidator.admin, UserValidator.put, UserController.put) 
routes.get('/:id/edit', RouteValidator.admin, UserController.edit) 
routes.delete('/:id', RouteValidator.admin, UserValidator.remove, UserController.delete) 

module.exports = routes