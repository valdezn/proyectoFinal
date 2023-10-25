import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../daos/models/users.model.js';
import { createHash, isValidPassword } from "../utils.js";
import CartManager from "../daos/clases/mongo/cartsManager.js";

const cartManager = new CartManager();

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField: 'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userModel.findOne({email: username});
        
                if(user){
                    console.log('User already exists.')
                    return done(null,false)
                }
                
                const newCart = await cartManager.addCart()
                const cartId = newCart._id
                
                let rol = 'user'
                if (username === process.env.ADMIN_EMAIL) {
                    rol = 'admin'
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cartId: cartId,
                    role: rol
                }
                let result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done('Error al obtener el usuario: ' +error);
            }
        }
    ))
        
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username,password,done) => {
        try{
            const user = await userModel.findOne({email: username})
            if(!user) {
                console.log("User doesn't exist")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            user.last_connection = Date.now()
            user.save()
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        let user = await userModel.findOne({first_name: profile._json.name})
        console.log(user)
        if (user === 'null'){
            let newUser = {
                first_name: profile._json.name,
                last_name: 'lastName',
                email: profile.profileUrl, //github no comparte el mail
                age: 25,
                password: '',
                cartId: '649b92000715b85820510f22',
                rol: 'user'
            }
            const result = await userModel.create(newUser);
            done(null, result);
        } else {
            done(null, user)
        }
    }))
    
    passport.serializeUser(async (user, done) => {
        done(null, user._id);
      })
      
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
      })
}

export default initializePassport;