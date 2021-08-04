const Base = require("./Base")

const db = require("../config/db")

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async showAll(paginate){
        try{
            const { filter, limit, offset } = paginate

            let results = 1
            let queryOrder = ``
            let queryTotal = `(SELECT count(*) FROM recipes) AS total_recipes`

            if(filter){

                queryTotal = `(SELECT count(*) FROM recipes WHERE recipes.title ILIKE '%${filter}%') AS total_recipes`

                queryOrder = `
                WHERE a.title ILIKE '%${filter}%' 
                GROUP BY a.id, a.chef_id, a.title, a.created_at, a.updated_at, a.total_recipes, a.user_id
                ORDER BY a.updated_at ASC`


            } else {
                queryOrder = `
                GROUP BY a.id, a.chef_id, a.title, a.user_id, a.created_at, a.updated_at, a.total_recipes
                ORDER BY a.created_at DESC`

            }

            let query = `
                SELECT a.id, a.chef_id, a.user_id, a.title, a.updated_at, a.created_at, a.total_recipes, ARRAY_AGG(files.path) AS files_path
                FROM (
                    SELECT recipes.*, recipe_files.file_id AS file_id, ${queryTotal}
                    FROM recipes
                    LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
                ) AS a
                LEFT JOIN files ON(a.file_id = files.id)  
                ${queryOrder}
            `


            if(limit){
                query = `${query}
                LIMIT $1 OFFSET $2
                `

                results = await db.query(query, [limit, offset])
            } else {

                results = await db.query(query)
            }

            return results.rows

        } catch(err){
            console.error(err)
        }
    },

    find(index){
        try{
            return db.query(`
                SELECT a.id, a.chef_id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at, ARRAY_AGG(files.path) AS files_path, ARRAY_AGG(files.id) AS files_id
                FROM (
                    SELECT recipes.*, recipe_files.file_id AS file_id
                    FROM recipes
                    LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
                ) AS a
                LEFT JOIN files ON(a.file_id = files.id)
                WHERE a.id = $1
                GROUP BY a.id, a.chef_id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at
            `, [index])
        } catch(err){
            console.error(err)
        }
    }
}