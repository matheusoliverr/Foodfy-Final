const Base = require('./Base')

const db = require("../config/db")

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    findRecipes(id){
        return db.query(`
            SELECT a.id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at, ARRAY_AGG(files.path) AS files_path, ARRAY_AGG(files.id) AS files_id
            FROM (
                SELECT recipes.*, recipe_files.file_id AS file_id
                FROM recipes
                LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
            ) AS a
            LEFT JOIN files ON(a.file_id = files.id)
            WHERE a.user_id = $1
            GROUP BY a.id, a.user_id, a.chef_id, a.title, a.ingredients, a.preparation, a.information, a.created_at
        `, [id])
    }
}