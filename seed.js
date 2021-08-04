const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')
const Chef = require('./src/app/models/Chef')
const RecipeFile = require('./src/app/models/RecipeFile')

let filesIds = []
let chefsIds = []
let totalRecipes = 16
let totalUsers = 10
let totalChefs = 5

async function createFiles(total){
    let files = []

    while(files.length<total){

        let fakerName = faker.name.firstName()

        while(fakerName.includes("'")){
            fakerName = faker.name.lastName()
        }

        files.push({
            name: fakerName,
            path: `${faker.image.avatar()}`
        })
    }

    const filesPromise = files.map((file) => File.create(file))

    filesIds = await Promise.all(filesPromise)

    return filesIds
}

async function createRecipeFiles(total){
    let files = []

    while(files.length<total){
        let fakerName = faker.name.firstName()

        while(fakerName.includes("'")){
            fakerName = faker.name.lastName()

        }

        files.push({
            name: fakerName,
            path: `${faker.image.unsplash.food()}`
        })
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)

    return filesIds
}

async function recipeIngredients(){
    let ingredients = []
    

    const totalIngredients = Math.ceil(Math.random()*4)

    while(ingredients.length < totalIngredients){
        ingredients.push(faker.commerce.product())
    }

    return Object.values(ingredients)
} 

async function recipePreparation(){
    let preparation = []

    const totalPreparation = Math.ceil(Math.random()*5)

    while(preparation.length < totalPreparation){
        preparation.push(faker.lorem.lines(1))
    }

    return Object.values(preparation)
}




async function createUsers(){
    let users = []
    const password = await hash('1111', 8)

    while(users.length < totalUsers){

        let fakerName = faker.name.firstName()

        while(fakerName.includes("'")){
            fakerName = faker.name.lastName()
        }

        if(users.length == 0){
            users.push({
                name: fakerName,
                email: faker.internet.email(),
                password,
                is_admin: true
            })
        } else {
            users.push({
                name: fakerName,
                email: faker.internet.email(),
                password,
                is_admin: false
            })
        }
    }

    const usersPromise = users.map(user => User.create(user))
    
    usersIds = await Promise.all(usersPromise)
}

async function createChefs(){
    let files = await createFiles(totalChefs)
    let chefs = []

    while(chefs.length < totalChefs){
        const selectedFile = files[Math.floor(Math.random()*(files.length*0.9999))]

        files = files.filter((file) => file != selectedFile)
        
        let fakerName = faker.name.firstName()

        while(fakerName.includes("'")){
            fakerName = faker.name.lastName()
        }

        chefs.push({
            name: fakerName,
            file_id: selectedFile
        })

    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes(){
    let recipes = []

    while(recipes.length<totalRecipes){
        const ingredients = await recipeIngredients()
        
        const preparation = await recipePreparation()
        
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * (chefsIds.length*0.9999))],
            title: faker.name.title(),
            ingredients: `{${ingredients}}`,
            preparation: `{${preparation}}`,
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
        })

        
    }


    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    
    const recipeFilesPromise = recipesIds.map(async recipeId => {
        
        let files = await createRecipeFiles(3)

        files.map(file => {
            RecipeFile.create({
                recipe_id: recipeId,
                file_id: file
            })
        })

    })

    await Promise.all(recipeFilesPromise)
}

async function init(){
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()
