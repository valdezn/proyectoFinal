export default class UserDTO {
    constructor(userLog){
        this.first_name = userLog.user.first_name,
        this.last_name = userLog.user.last_name,
        this.email = userLog.user.email,
        this.role = userLog.user.role
        this.cart = userLog.user.cartId
        this.documents = userLog.user.documents
    }
}