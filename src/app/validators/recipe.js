const File = require("../models/File")
const User = require("../models/User")
const RecipeFile = require("../models/RecipeFile")


async function list(req, res, next){
    let { limit, page, filter } = req.query

    limit = limit || 9
    page = page || 1

    let offset = limit * (page-1)

    let paginate = {
        page,
        limit,
        offset,
        filter
    }

    req.paginate = paginate

    next()
}

async function post(req, res, next){

    let postError = false

    Object.keys(req.body).map(key => {
        if(req.body[key] == "" && key !=='information' && key !=='removed_files'){
            postError = true
            
        }
    })

    const chef = await User.findOne({ where: {id: req.session.userId} })

    if(postError){
        return res.render("admin/recipes/create", {
            recipe: req.body,
            chef,
            error: `Preencha todos os campos para continuar!`
        })
    }

    if(req.files.length == 0){ 
        return res.render("admin/recipes/create", {
            recipe: req.body,
            chef,
            error: `Envie ao menos uma foto!`
        })
    }

    if(req.session.isAdmin == false){
        req.body.user_id = req.session.userId
    }

    next()
}

async function put(req, res, next){

    Object.keys(req.body).map(key => {
        if(req.body[key] == "" && key !=='information' && key !== "removed_files" && key !== "file_id"){
            return res.render("admin/recipes/edit", {
                recipe: req.body,
                error: `Preencha todos os campos para continuar!`
            })
        }
    })


    if(req.files.length != 0){
        const newFilesPromise = req.files.map(async file =>{
            file.path = String(file.path).replace("public", "")
            const fileId = await File.create({
                name: file.filename,
                path: file.path
            })

            await RecipeFile.create({
                recipe_id: req.body.id,
                file_id: fileId
            })

        })
        await Promise.all(newFilesPromise)
    }
    

    if(req.body.removed_files){
        const removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        const removedFilesPromise = removedFiles.map(id =>{
            File.deleteFile(id)
            RecipeFile.deleteFile(id)
        })
        await Promise.all(removedFilesPromise)
    }

    if(req.session.isAdmin == false){
        req.body.chef_id = 0
        req.body.user_id = req.session.userId
    }

    next()
}

module.exports = {
    list,
    post,
    put
}