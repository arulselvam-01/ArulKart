class error_handler extends Error{
    constructor(message,status_code){
        super(message)
        this.status_code = status_code
        Error.captureStackTrace(this, constructor)

        return this
    }
}

module.exports = error_handler