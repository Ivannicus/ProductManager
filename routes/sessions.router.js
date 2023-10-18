// Rutas para trabajar con servicios de sessions
import { Router } from "express";
import usersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

// Primer Servicio para registrar el usuario
router.post('/register', async (req, res)=> {
    try{
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await usersModel.findOne({ email });

        let is_admin = false

        if (exists) {
            return res.status(400).send({status: "Error", message: "User already exist"})
        }

        if (email === "adminCoder@coder.com" && password === "adminCod3r123"){
            is_admin = true;
        } 
        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            is_admin
        });

        res.status(201).send({status: "Success", message: "User registered"})
    } catch (error) {
        res.status(500).send({status: 'error', message: error.message})
    }
});

// Segundo Servicio para loguear el usuario
router.post('/login', async (req, res) => {
    try{

        const { email, password } = req.body;
        const user = await usersModel.findOne({ email });

        if(!user){
            return res.status(400).send({status: "Error", message: "Incorrect credentials"})
        }
       
        if(!isValidPassword(user, password)){
            return res.status(401).send({status: "Error", message: "Incorrect credentials"})
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            is_admin: user.is_admin
        }
        console.log(4)
        res.send({ status: "Success", message: "Login Success"})

    } catch (error) {
        res.status(500).send({status: 'error', message: error.message})
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({status: 'Error', error: 'Logout fail'})
        res.redirect('/');
    })
})

export default router;