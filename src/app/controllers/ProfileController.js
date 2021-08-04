const User = require("../models/User")
const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const { hash } = require("bcryptjs")

module.exports = {
    async index(req, res){

        const user = await User.findOne({where: {id: req.session.userId}})

        
        const name = user.name.split(" ")
        const shortName = name[0]

        return res.render("admin/users/profile", {user, shortName})
    },
    async put(req, res){
        try{
            req.body.password = await hash(req.body.password, 8)
            await User.update(req.user.id, {
                name: req.user.name,
                email: req.user.email
            })

            const recipes = await Recipe.showAll(req.query)
    
            const chefs = await Chef.findAll()

            return res.render("site/main", {
                recipes,
                chefs,
                success: "Perfil atualizado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/users/profile", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    },
    async show(req, res){

        const chef = await User.findOne({ where: {id: req.session.userId} })

        const results = await User.findRecipes(chef.id)
        const recipes = results.rows


        return res.render("admin/recipes/listing", {
            recipes,
            chef
        })
    },
    async createRecipe(req, res){

        const results = await User.findOne({ where: {id: req.session.userId} })
        const chef = results

        return res.render("admin/recipes/create", {chef})
        
        
    }
}