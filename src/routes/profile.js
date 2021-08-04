const express = require('express')
const routes = express.Router()

const ProfileController = require("../app/controllers/ProfileController")

const RouteValidator = require("../app/validators/routes-block")
const UserValidator = require("../app/validators/user")

routes.put('/', RouteValidator.user, UserValidator.profile, ProfileController.put)
routes.get('/', RouteValidator.user, ProfileController.index) 
routes.get('/recipes', RouteValidator.user, ProfileController.show)
routes.get('/recipes/create', RouteValidator.user, ProfileController.createRecipe)

module.exports = routes