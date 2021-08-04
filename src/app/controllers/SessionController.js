const User = require("../models/User")
const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

const mailer = require("../../lib/mailer")
const crypto = require("crypto")
const { hash } = require("bcryptjs")

module.exports = {
    loginForm(req, res){
        return res.render("site/users/login")
    },
    async login(req, res){
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin
        req.session.userName = req.user.name

        const recipes = await Recipe.showAll(req.query)

        const chefs = await Chef.findAll()

        const name = req.user.name.split(" ")
        const shortName = name[0]
        
        return res.render("site/main", {
            recipes,
            chefs,
            success: `Bem vindo ${shortName}!`
        })
    },
    logout(req, res){
        let shortName = ""

        if(req.session.userName){
            const name = req.session.userName.split(" ")
            shortName = name[0]
        }
        

        req.session.destroy()

        return res.render("site/users/login", {
            success: `Até a próxima ${shortName}!`
        })
    },
    async index(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        const chefs = await Chef.findAll()
    
        return res.render("site/main", {recipes, chefs})
        
    },
    forgotForm(req, res){
        return res.render("site/users/forgot-password")
    },
    async forgot(req, res){
        try{
            const { id, email } = req.user

            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours()+1)

            await User.update(id, {
                reset_token: token,
                reset_token_expires: now,
            })

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Precisa de uma senha nova?',
                html: `<h2>Esqueceu sua senha?</h2>
                <p>Sem problemas, aqui está um link para você escolher uma nova senha.</p>
                <p>Agora pode continuar aproveitando da nossa plataforma o quanto quiser!</p>
                <p>
                    <a href="http://localhost:3000/reset-password?token=${token}" target="_blank">Clique Aqui</a>
                </p>
                `,
            })

            return res.render("site/users/forgot-password", {
                success: "Solicitação concluída! Verifique seu email."
            })
        } catch(err){
            console.error(err)
            return res.render("site/users/forgot-password", {
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    },
    resetForm(req, res){
        return res.render("site/users/reset-password")
    },
    async reset(req, res){
        const { id, password } = req.user

        const cryptedPassword = await hash(password, 8)

        await User.update(id, {
            password: cryptedPassword,
            reset_token: "",
            reset_token_expires: ""
        })

        return res.render("site/users/login", {
            success: "Senha atualizada com sucesso!"
        })
    }
}