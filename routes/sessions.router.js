// Rutas para trabajar con servicios de sessions
import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res)=> {
    res.status(201).send({status: "Success", message: "User registered"})
});

router.get('/failregister', async(req, res) => {
    console.log("Register Failed");
    res.send({error:"Failed"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}) ,async (req, res) => {
    if(!req.user) {
        return res.status(400).send({status: "Error", error: "Invalid Credentials"})
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    res.send({status: 'Success', payload: req.user})
});

router.get('/failedlogin', (req, res) => {
    res.send({error:'Failed Login'})
});

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res)=>{});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req,res) => {
    req.session.user = req.user;
    res.redirect('/')
})


router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({status: 'Error', error: 'Logout fail'})
        res.redirect('/');
    })
})

export default router;