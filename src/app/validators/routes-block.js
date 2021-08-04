const Recipe = require("../models/Recipe")
const User = require("../models/User")

function admin(req, res, next){
    let error = ""

    if(req.session.isAdmin){
        error = "passed"
    } else {
        error = "Somente administradores podem realizar esta ação!"
    }

    if(error != "passed"){
        return res.send(error)
    }
    
    next()
}

function user(req, res, next){
    let error = ""

    if(req.session.userId){
        error = "passed"
    } else {
        error = "Somente usuários podem realizar esta ação!"
    }

    if(error != "passed"){
        return res.send(error)
    }
    
    next()
}

async function recipe(req, res, next){
    const recipeIndex = req.params.index
    let error = ""

    let results = await Recipe.find(recipeIndex)
    const recipe = results.rows[0]

    const user = await User.findOne({ where: {id: req.session.userId} })

    if(user && recipe.user_id == user.id){
        error = "passed"
    } else {
        error = "Somente administradores podem realizar esta ação!"
    }

    if(req.session.isAdmin) error = "passed"

    if(error != "passed"){
        return res.send(error)
    }
    
    next()
    
}


module.exports = {
    admin,
    user,
    recipe
}