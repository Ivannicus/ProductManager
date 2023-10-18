import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => { 
        try{
            const { first_name, last_name, age } = req.body;
            const exists = await usersModel.findOne({ email: username });
    
            if (exists) {
                console.log("User already exists")
                return done(null, false);
            }
    
            const user = await usersModel.create({
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            });
    
            return done(null, user);
        } catch (error) {
            return done(`Error al registrar el usuario ${error.message}`)
        }
    }));
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => { 
        try{
            const user = await usersModel.findOne({ email: username });
    
            if(!user){
                console.log("User doesn't exists")
                return done(null, false)
            }
    
            if(!isValidPassword(user, password)){
                return done(null, false)
            }
    
            return done(null, user); // Seteado en req.user
    
        } catch (error) {
            return done(`Error al loguear el usuario ${error.message}`)
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user); //req.user
    })
}

export default initializePassport;