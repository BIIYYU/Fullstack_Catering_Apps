import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "MOHON LOGIN KE AKUN ANDA"});
    }
    const user = await Users.findOne({
        where:{
            uuid: req.session.userId
        }
    });
    if(!user)return res.status(401).json({msg: "USER TIDAK DITEMUKAN"});
    req.userId = user.id;
    req.role = user.role;
    
    next(); 
} 

export const adminOnly = async (req, res, next) => {
    const user = await Users.findOne({
        where:{
            uuid: req.session.userId
        }
    });
    if(!user)return res.status(401).json({msg: "USER TIDAK DITEMUKAN"});
    if(user.role !== "admin")
    {
        return res.status(403).json({msg: "User Tidak Memiliki Akses"});
    }
    next(); 
} 