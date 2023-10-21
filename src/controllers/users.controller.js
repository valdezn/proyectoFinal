import UserManager from "../daos/clases/mongo/userManager.js"

export default class UsersController {
    constructor() {
        this.usersManager = new UserManager()
    }

    async getUsersController (req, res, next) {
        let limit = Number(req.query.limit) || 10
        let page = Number(req.query.page)
        let sort = Number(req.query.sort)
        let filter = req.query.filter
        let filterVal = req.query.filterVal
        const result = await this.usersManager.getUsers(
          limit,
          page,
          sort,
          filter,
          filterVal
        );

        res.send(result);
    }

    async getUserController(email) {
        const result = await this.usersManager.getUser(email)
        return result
    }

    async deleteUsersController(req, res) {
        const result = await this.usersManager.deleteUsers(req, res)
        return result
    }

    async deleteUserController(req, res) {
        const result = await this.usersManager.deleteUser(req, res)
        return result
    }

    async editRoleController(req, res) {
        const user = await this.usersManager.editRole(req, res) 
        return user
    }
}