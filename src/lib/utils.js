module.exports = {
    iso(timestamp){
        const time = new Date(timestamp)

        const year = time.getUTCFullYear()
        const month = `0${time.getUTCMonth()+1}`.slice(-2)
        const day = `0${time.getUTCDate()}`.slice(-2)

        return `${year}-${month}-${day}`
    }
}