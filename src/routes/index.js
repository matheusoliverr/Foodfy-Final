const express = require('express')
const routes = express.Router()

const profile = require("./profile")
const users = require("./users")
const chefs = require("./chefs")
const recipes = require("./recipes")

const RecipeController = require("../app/controllers/RecipeController")
const ChefController = require("../app/controllers/ChefController")
const SessionController = require("../app/controllers/SessionController")

const SessionValidator = require("../app/validators/session")
const RouteValidator = require("../app/validators/routes-block")
const RecipeValidator = require("../app/validators/recipe")


routes.use("/admin/recipes", recipes)
routes.use("/admin/chefs", chefs)
routes.use("/admin/profile", profile)
routes.use("/admin/users", users)

// SITE

routes.get("/", (req, res) => { return res.redirect('/main') })
routes.get("/main", RecipeController.index)
routes.get("/about", RecipeController.about)
routes.get("/recipes", RecipeValidator.list, RecipeController.list)
routes.get("/recipes/:index", RecipeController.show)
routes.get("/chefs", ChefController.list)


// SESSION

routes.get("/login", SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", RouteValidator.user, SessionController.logout)
routes.get("/forgot-password", SessionController.forgotForm)
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot)
routes.get("/reset-password", SessionController.resetForm)
routes.post("/reset-password", SessionValidator.reset, SessionController.reset)


module.exports = routes