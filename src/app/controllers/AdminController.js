const Recipe = require("../models/Recipe")
const File = require("../models/File")
const User = require("../models/User")
const Chef = require("../models/Chef")

module.exports = {
    async index(req,res){
        if(req.session.isAdmin == true){
            const recipes = await Recipe.showAll(req.query)

            const chefs = await Chef.findAll()
            const users = await User.findAll()

            return res.render("admin/recipes/listing", {recipes, chefs, users})
        } else {
            return res.redirect("/admin/profile/recipes")
        }
        
    },
    async create(req,res){
        const chefs = await Chef.findAll()

        return res.render("admin/recipes/create", {chefs})
    
    },
    async show(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]

        let chef = ""

        if(recipe.user_id){
            chef = await User.findOne({ where: {id: req.session.userId} })

        } else{
            chef = await Chef.findOne({where: {id: recipe.chef_id}})
        }
        
        return res.render("admin/recipes/recipe", {recipe, chef});
        
    },
    async edit(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]
        if(req.session.isAdmin == true){
            const chefs = await Chef.findAll()
        
            return res.render("admin/recipes/edit", {recipe, chefs});
        } else{
            const chef = await User.findOne({ where: {id: req.session.userId} })
            return res.render("admin/recipes/edit", {recipe, chef});
        }
        

    },
    
}
