export default class UserDTO {
    constructor(userLog){
        this.first_name = userLog.first_name,
        this.last_name = userLog.last_name,
        this.email = userLog.email,
        this.role = userLog.role
        this.cart = userLog.cartId
        this.documents = userLog.documents
    }
}