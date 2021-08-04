const Base = require('./Base')
const db = require("../config/db")

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    deleteFile(id){
        try{
            return db.query(`
                DELETE FROM recipe_files
                WHERE file_id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    }
}