const Recipe = require("../models/Recipe")
const File = require("../models/File")
const User = require("../models/User")
const Chef = require("../models/Chef")
const RecipeFile = require("../models/RecipeFile")

module.exports = {
    async index(req,res){

        let recipes = await Recipe.showAll(req.query)

        const chefs = await Chef.findAll()
        
        const users = await User.findAll()
    
        return res.render("site/main", {recipes, chefs, users})
        
    },
    async show(req, res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]
        
        let chef = ""

        if(recipe.chef_id){
            chef = await Chef.findOne({ where: { id: recipe.chef_id } })
        } else if(recipe.user_id){
            chef = await User.findOne({ where: { id: recipe.user_id } })
        }
    
        return res.render("site/recipe", {recipe, chef})
        
    },
    about(req,res){
        return res.render("site/about")

    },
    async list(req,res){
        let { filter, limit } = req.paginate
        let total = 0

        const recipes = await Recipe.showAll(req.paginate)
        
        if(recipes.length != 0){
            total = Math.ceil(recipes[0].total_recipes / limit)
        }

        const pagination = {
            ...req.paginate,
            total
        }

        const chefs = await Chef.findAll()

        const users = await User.findAll()
        
        return res.render("site/recipes", {recipes, pagination, filter, chefs, users})
        
    },
    async post(req,res){
        try{

            req.body.ingredients = `{${req.body.ingredients}}`
            req.body.preparation = `{${req.body.preparation}}`

            let fields = []

            Object.keys(req.body).map(field => {
                if(req.body[field] != "") fields.push([field, req.body[field]])
            })

            const filteredFields = Object.fromEntries(fields)

            const recipeId = await Recipe.create(filteredFields)

            const filesPromise = req.files.map(async file => {
                file.path = String(file.path).replace("public", "")

                const fileId = await File.create({
                    name: file.filename,
                    path: file.path
                })

                await RecipeFile.create({
                    recipe_id: recipeId,
                    file_id: fileId
                })
            })
                
            await Promise.all(filesPromise)

            if(req.session.isAdmin == false){
                const results = await User.findRecipes(req.session.userId)
                const recipes = results.rows

                const chef = await User.findOne({ where: {id: req.session.userId} })
                
                
                return res.render("admin/recipes/listing", {
                    recipes,
                    chef,
                    success: "Receita cadastrada com sucesso!"
                })
            } else {
                const recipes = await Recipe.showAll(req.query)

                const chefs = await Chef.findAll()
                
                
                return res.render("admin/recipes/listing", {
                    recipes,
                    chefs,
                    success: "Receita cadastrada com sucesso!"
                })
            }

            
            
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/create", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    
    },
    async put(req,res){
        try{

            req.body.ingredients = `{${req.body.ingredients}}`
            req.body.preparation = `{${req.body.preparation}}`

            let fields = []

            Object.keys(req.body).map(field => {
                if(req.body[field] != "" && field != "removed_files") fields.push([field, req.body[field]])
            })

            const filteredFields = Object.fromEntries(fields)

            await Recipe.update(req.body.id, filteredFields)

            let results = await Recipe.find(req.body.id)
            const recipe = results.rows[0]

            const chef = await Chef.findOne({where: { id: recipe.chef_id }})

            return res.render("admin/recipes/recipe", {
                recipe,
                chef,
                success: "Receita atualizada com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/edit", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }

    },
    async delete(req,res){
        let results = await Recipe.find(req.body.id)
        const recipe = results.rows[0]

        const chefs = await Chef.findAll()

        try{
            const { id } = req.body
            const files = await RecipeFile.findAll({where: {recipe_id: id}})        

            const deleteFiles = files.map(file => {
                RecipeFile.deleteFile(file.file_id)
                File.deleteFile(file.file_id)
                
            })
            
            await Promise.all(deleteFiles)

            await Recipe.delete(id)

            if(req.session.isAdmin == false){
                const results = await User.findRecipes(req.session.userId)
                const recipes = results.rows

                const chef = await User.findOne({ where: {id: req.session.userId} })
                
                
                return res.render("admin/recipes/listing", {
                    recipes,
                    chef,
                    success: "Receita deletada com sucesso!"
                })
            } else {
                const recipes = await Recipe.showAll(req.query)

                const chefs = await Chef.findAll()
                
                
                return res.render("admin/recipes/listing", {
                    recipes,
                    chefs,
                    success: "Receita deletada com sucesso!"
                })
            }
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/edit", {
                recipe,
                chefs,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    }
}
