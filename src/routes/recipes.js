const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")

const AdminController = require("../app/controllers/AdminController")
const RecipeController = require("../app/controllers/RecipeController")

const RouteValidator = require("../app/validators/routes-block")
const RecipeValidator = require("../app/validators/recipe")

routes.post("/", RouteValidator.user, multer.array("file", 5), RecipeValidator.post, RecipeController.post)
routes.put("/", RouteValidator.user, multer.array("file", 5), RecipeValidator.put, RecipeController.put)
routes.delete("/", RouteValidator.user, RecipeController.delete)

routes.get("/", RouteValidator.user, AdminController.index)
routes.get("/create", RouteValidator.user, AdminController.create)
routes.get("/:index", RouteValidator.recipe, RouteValidator.user, AdminController.show)
routes.get("/:index/edit", RouteValidator.recipe, RouteValidator.user, AdminController.edit)

module.exports = routes