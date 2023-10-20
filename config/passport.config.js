import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';

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

    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.d647f9e9afbc82bd",
        clientSecret:"4121a1da05bf8a877d8005e5b7b5aba3fbacd8bd",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile);
            let user = await usersModel.findOne({email:profile._json.email})

            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age:18,
                    email:profile._json.email,
                    password:''
                }
                let result = await usersModel.create(newUser);
                done(null, result);
            } else {
                done(null,user);
            }
            
        } catch (error){
            console.log("Aquí está fallando la wea")
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user); //req.user
    })
}

export default initializePassport;