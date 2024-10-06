class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "Success"
    ){
       super(message)
       this.statusCode = statusCode
       this.data = data
       this.message = message
    }
}