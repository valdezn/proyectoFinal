import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import multer from "multer";

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

const determineDestination = (req, file, cb) => {
    let destination;
    
    if (req.body.type === 'profile') {
      destination = __dirname + '/public/profiles';
    } else if (req.body.type === 'products') {
      destination = __dirname + '/public/products';
    } else if (req.body.type === 'documents') {
      destination = __dirname + '/public/documents';
    } else {
      // Si el campo 'type' no coincide con ninguno de los casos anteriores, maneja el error
      return cb(new Error('Tipo de archivo no válido'));
    }
    console.log(req.body.type)
    cb(null, destination);
  };
  

const storage = multer.diskStorage({
    destination: determineDestination,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

export const uploader = multer({storage: storage});