import { Router } from "express";
import userModel from '../dao/models/users.js'

const router = Router()

//api/sessions

//funciona ok
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exist = await userModel.findOne({ email });

    if (exist) return res.status(400).send({ status: "error", error: "Users already exists" })

    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    }

    let result = await userModel.create(user)
    res.status(200).send({ status: "success", message: "User registered", payload: user })
})

//funciona ok
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userExists = await userModel.findOne({ email, password });
    if (!userExists) return res.status(400).send({ status: "error", error: "Incorrect credentials" })

    req.session.user = {
        name: `${userExists.first_name} ${userExists.last_name}`,
        email: userExists.email,
        age: userExists.age,
    }
    res.status(200).send({ status: "success", payload: req.session.user, message: "Nuestro primer logueo" })
})

router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) { res.status(400).send({ error: 'logout error', message: error }) }
        res.status(200).send('Session ended.')
    })
})

export default router
