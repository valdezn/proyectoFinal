import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

//devuelve la contraseña hasheada, es irreversible.
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//compareSync compara la contraseña sin hashear con el hasheado de la db
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


export const generateProducts = ()=>{
    return {
        ObjectId: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.urlPicsumPhotos(),
        category: faker.commerce.department(),
        stock: faker.number.int(100),
        code: faker.string.alphanumeric(10)
    }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname