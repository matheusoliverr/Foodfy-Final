const db = require('../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async deleteFile(id){
        try {
            const results = await db.query(` SELECT * FROM files WHERE id=$1 `, [id])
            const file = results.rows[0]

            if(String(file.path).includes("images")){
            fs.unlinkSync(`public${file.path}`)
            }

            return db.query(`DELETE FROM files WHERE id=$1`, [id])
        } catch (error) {
            console.error(error);
        }
    }
}