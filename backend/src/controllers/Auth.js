import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await Users.findOne({
        where: {email: req.body.email}
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const match = await argon2.verify(user.password, req.body.password);
    
    if(!match) return res.status(400).json({msg: "WRONG PASSWORD"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const role = user.role;
    const name = user.name;
    const email = user.email;

    /* alasan kenapa tidak menambahkan atribut melainkan diparse langsung kedalam json 
    adalah dikarenakan karena disini kita memerlukan password yang diambil langsung dari  */
    return res.status(200).json({uuid, name, email, role});
};

export const Me = async (req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "MOHON LOGIN KE AKUN ANDA"});
    }
    const user = await Users.findOne({
        attributes:['uuid', 'name', 'email', 'role'],
        where:{
            uuid: req.session.userId
        }
    });
    if(!user)return res.status(401).json({msg: "USER TIDAK DITEMUKAN"});
    res.status(200).json(user);
};

export const logOut = (req, res) => {
    req.session.destroy((err)=> {
        if(err) return res.status(400).json({msg: "TIDAK DAPAT LOGOUT"});
        res.status(200).json({msg: "ANDA TELAH LOGOUT"});
    });
};