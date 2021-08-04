const Photos = {
    currentPath: document.querySelector(".current-path"),
    recipeImages: document.querySelector(".recipe-images"),
    imageShow: document.querySelector("#image-show"),
    mainImage: document.querySelector(".img-detailed"),
    miniatureImages: document.querySelectorAll(".miniature-image"),
    input: "",
    photoLimit: 5,
    files: [],
    showPath(event){
        this.currentPath.innerHTML = `${event.target.files[0].name}`
    },
    showPhoto(event){
        const { files: fileList } = event.target

        Photos.input = event.target

        if(Photos.checkLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            Photos.files.push(file)

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = document.createElement("div")
                div.classList.add("image-show-area")
                div.appendChild(image)

                button = Photos.deleteButton()

                div.appendChild(button)

                this.imageShow.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        Photos.input.files = Photos.getFiles()
    },
    checkLimit(event){
        const { files } = event.target
        const { photoLimit, imageShow } = Photos
        const imagesShowed = []

        if(files.length > photoLimit){
            alert(`Envie no máximo ${photoLimit} fotos`)

            event.preventDefault()
            return true
        }

        imageShow.childNodes.forEach(area =>{
            if(area.classList && area.classList.value == "image-show-area"){
                imagesShowed.push(area)
            }
        })

        const totalPhotos = files.length + imagesShowed.length

        if(totalPhotos > photoLimit){
            alert(`Envie no máximo ${photoLimit} fotos`)
            event.preventDefault()

            return true
        }

        return false

    },
    getFiles(){
        const datatransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        Photos.files.forEach(file => {
            datatransfer.items.add(file)
        })
    },
    setMainImage(event){
        const { target } = event

        Photos.miniatureImages.forEach(image => image.classList.remove("active"))

        target.classList.add("active")
        Photos.mainImage.src = `${target.src}`
    },
    deleteButton(){
        const close = document.createElement("i")
        close.classList.add("material-icons")
        close.innerHTML = "close"
        close.onclick = Photos.deletePhoto

        return close
    },
    deletePhoto(event){
        const photoArea = event.target.parentNode
        const imageShowArea = document.querySelectorAll(".image-show-area")
        const photosArray = Array.from(imageShowArea)
        const index = photosArray.indexOf(photoArea)

        Photos.files.splice(index, 1)

        Photos.input.files = Photos.getFiles()

        photoArea.remove()
    },
    deleteOldPhoto(event){
        const photoArea = event.target.parentNode

        if(photoArea.id){
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles){
                removedFiles.value += `${photoArea.id},`
            }
        }

        photoArea.remove()
    }
}
