const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")

const ChefController = require("../app/controllers/ChefController")

const RouteValidator = require("../app/validators/routes-block")

routes.get("/", RouteValidator.admin, ChefController.index)
routes.get("/create", RouteValidator.admin, ChefController.create)
routes.get("/:index", RouteValidator.admin, ChefController.show)
routes.get("/:index/edit", RouteValidator.admin, ChefController.edit)

routes.post("/", RouteValidator.admin, multer.single("path_file", 5), ChefController.post)
routes.put("/", RouteValidator.admin, multer.single("path_file", 5), ChefController.put)
routes.delete("/", RouteValidator.admin, ChefController.delete)

module.exports = routes