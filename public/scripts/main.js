const recipeImage = document.querySelectorAll('.recipe-img')

for(let image of recipeImage){
    const imageId = image.getAttribute("id")
    image.addEventListener("click", function(){
        window.location.href = `/recipes/${imageId}`
    })
}

const details = document.querySelectorAll('.detail')


for(let detail of details){
    const detailsTitle = detail.querySelector('.details-title')
    const content = detail.querySelector('.details-content')
    detailsTitle.querySelector('.button').addEventListener("click", function(){
        const hidden = content.classList.contains('hidden')
        if(hidden){
            content.classList.remove('hidden')
            detailsTitle.querySelector('.button').innerHTML = "ESCONDER"
        }
        else{
            content.classList.add('hidden')
            detailsTitle.querySelector('.button').innerHTML = "MOSTRAR"
        }
    }
)}


function redirectButtonToIdLocation(button){
    const page = button.getAttribute("id")

    location.href = `${page}`
}


const currentPage = location.pathname
const menuItems = document.querySelectorAll(".header-links a")

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("open")
    }
}


function paginate(openPage, total){
    let pages = []
    for(let page=1; page <= total; page++){
        const limitPages = page == 1 || page == total
        const pagesBefore = (openPage - page) == 1
        const pagesAfter = (page - openPage) == 1

        if(limitPages || pagesBefore || pagesAfter || page==openPage){
            if(oldPage && page-oldPage !=1){
                if(page-oldPage==2){
                    pages.push(page-1)
                }else{
                    pages.push("... ")
                }
            }
            
            pages.push(page)
            
            oldPage = page
        }
    }
    return pages
}

function showPagination(pages){
    const filter = pagination.dataset.filter
    let paginationContent = ""

    for(page of pages){
        if(String(page).includes("...")){
            paginationContent += `<span>${page}</span>`
        }else{
            if(filter){
                paginationContent += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else{
                paginationContent += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = paginationContent

}

const pagination = document.querySelector(".paginate")

const openPage = +pagination.dataset.page
const totalPages = +pagination.dataset.total
let oldPage

const pages = paginate(openPage, totalPages)
showPagination(pages)

const paginationLinks = pagination.querySelectorAll("a")

for(link of paginationLinks){
    if((location.href).includes(link.getAttribute("href"))){
        link.classList.add("open")
    }
}