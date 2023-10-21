export default class UserShortDTO {
    constructor(result) {
        this.users = [];

        for (const docs of result) {
            const user = {
                first_name: docs.first_name,
                email: docs.email,
                role: docs.role,
                last_connection: docs.last_connection
            };
            this.users.push(user); 
        }
    }
}
