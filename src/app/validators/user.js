const { compare } = require("bcryptjs")
const User = require("../models/User")

async function post(req, res, next){

    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == "" && key != "is_admin"){
            return res.render("admin/users/create", {
                user: req.body,
                error: "Preencha todos os campos!"
            })
        }
    }
    
    const user = await User.findOne({ where: {email: req.body.email} })
    
    if(user){
        return res.render("admin/users/create", {
            user: req.body,
            error: "Este usuário já está cadastrado!"
        })
    }


    next()
}

function put(req, res, next){
    const keys = Object.keys(req.body)
    let pageError = ""


    for(key of keys){
        if(req.body[key] == "" && req.body[key] != "is_admin") pageError = true
    }


    if(pageError){
        return res.render("admin/users/edit", {
        user: req.body,
        error: "Preencha todos os campos!"
        })
    }

    next()
}

async function profile(req, res, next){

    const { id, password, name, email } = req.body

    if(name == "" || email == ""){
        return res.render("admin/users/profile", {
            user: req.body,
            error: "Por favor preencha todos os campos."
        })
    }

    if(password == ""){
        return res.render("admin/users/profile", {
            user: req.body,
            error: "Por favor insira sua senha."
        })
    }

    const user = await User.findOne({ where: {id} })

    const checkPassword = await compare(password, user.password)

    if(!checkPassword){
        return res.render("admin/users/profile", {
            user: req.body,
            error: "Senha incorreta!"
        })
    }

    req.user = req.body

    next()


}

async function remove(req, res, next){
    const users = await User.findAll()

    if(req.session.userId == req.body.id){
        return res.render("admin/users/listing", {
            users,
            error: "Você não pode deletar sua própria conta!"
        })
    }

    next()
}

module.exports = {
    post,
    put,
    profile,
    remove
}