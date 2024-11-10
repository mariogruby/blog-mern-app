import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export const signup = (req, res, next) => {
    const { email, password, username } = req.body;
    if (email === "" || password === "" || username === "") {
        res.status(401).json({ message: 'Provide email, password and username' });
        return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address" });
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({
            message:
                "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter",
        });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "Account already exists" });
                return;
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({ email, password: hashedPassword, username });
        })
        .then((createdUser) => {
            const { email, _id, username } = createdUser;
            res.status(201).json({ email, _id, username })
        })
        .catch((err) => next(err));
};


export const login = (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password" })
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({ message: "Account not found." });
                return;
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
            if (passwordCorrect) {
                const { _id, email, username, userImage } = foundUser;
                const payload = { _id, email, username, userImage };
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "6h",
                });
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the account" });
            }
        })
        .catch((err) => next(err));
};

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).render("/logout", { message: err.message });
            return;
        }
        res.redirect("/")
    });
};

export const verify = (req, res, next) => {
        // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and is made available on `req.payload`
    res.status(200).json(req.payload);
    // Send back the token payload object containing the user data
};