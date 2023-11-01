import tblMenu from "../models/MenuModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getMenus = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await tblMenu.findAll({
                attributes:['uuid', 'name', 'price'],
                include:[{
                    model: Users,
                    attributes:['name', 'email'],
                }]
            });
        } else {
            response = await tblMenu.findAll({
                attributes:['uuid', 'name', 'price'],
                where:{userId: req.userId},
                include:[{
                    model: Users,
                    attributes:['name', 'email']
                }]
            });
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getMenuById = async (req, res) => {
    try {
        const menu = await tblMenu.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if(!menu)
            return res.status(404).json({msg: "Data Tidak Ditemukan"});
        
        let response;
        if(req.role === "admin"){
            response = await tblMenu.findOne({
                attributes: ['uuid','name','price'],
                where:{
                    id: menu.id
                },
                include:[{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await tblMenu.findOne({
                attributes: ['uuid','name','price'],
                where:{
                    [Op.and]:[{id: menu.id}, {userId: req.userId}],
                },
                include:[{
                    model: Users,
                    attributes:['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createMenu = async (req, res) => {
    const {name, price} = req.body;
    try {
        await tblMenu.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "Menu Created Successfuly"});
    } catch (error) {
        res.saatus(500).json({msg:error.message});
    }
}

export const updateMenu = async (req, res) => {
    try {
        const menu = await tblMenu.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if(!menu)
            return res.status(404).json({msg: "Data Tidak Ditemukan"});

        const {name, price} = req.body;
        
        if(req.role === "admin"){
            await tblMenu.update({name, price},{
                where:{
                    id: menu.id
                }
            });
        } else {
          if(req.userId !== menu.userId)
            return res.status(403).json({msg: "Akses Terlarang"})

          await tblMenu.update({name, price},{
            where:{
                [Op.and]:[{id: menu.id}, {userId: req.userId}]
            }
          });
        }
        res.status(200).json({msg: "Menu Updated Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteMenu = async (req,res) => {
    const menu = await tblMenu.findOne({
        where:{
            uuid: req.params.id
        }
    });

    if(!menu) return res.status(404).json({msg: "Data Not Found!"});

    try {
        await tblMenu.destroy({
            where:{
                id: menu.id
            }
        });
        res.status(200).json({msg: "Menu Deleted Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}


