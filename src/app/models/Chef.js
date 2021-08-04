const Base = require("./Base")

const db = require("../config/db")

Base.init({table: 'chefs'})

module.exports = {
    ...Base,
    showAll(){
        try{
            return db.query(`
                SELECT chefs.*, count(recipes.id) AS total_recipes, files.path AS file_path
                FROM chefs
                LEFT JOIN files ON(chefs.file_id = files.id)
                LEFT JOIN recipes ON(chefs.id = recipes.chef_id)
                GROUP BY chefs.id, files.path
            `)
        } catch(err){
            console.error(err)
        }
    },

    find(index){
        try{
            return db.query(`
                SELECT chefs.*, count(recipes.id) AS total_recipes, files.path AS file_path
                FROM chefs
                LEFT JOIN recipes ON(chefs.id = recipes.chef_id)
                LEFT JOIN files ON(chefs.file_id = files.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id, files.path
            `, [index])
        } catch(err){
            console.error(err)
        }
    },

    recipeFind(id){
        try{
            return db.query(`
                SELECT recipes.id, recipes.title, ARRAY_AGG(a.files_path) AS files_path
                FROM recipes
                LEFT JOIN (
                    SELECT recipe_files.recipe_id, files.path AS files_path
                FROM recipe_files
                LEFT JOIN files ON (recipe_files.file_id = files.id)
                ) AS a ON (recipes.id = a.recipe_id)
                WHERE recipes.chef_id = $1
                GROUP BY recipes.id, recipes.title
                ORDER BY recipes.created_at DESC
            `, [id])
        } catch(err){
            console.error(err)
        }
    }
}