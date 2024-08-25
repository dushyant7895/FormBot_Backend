const express = require("express");
const router = express.Router();


const{createFolder,getFolders,updateFolder,deleteFolder,getFoldersByUser,getFolderId}=require("../controllers/Folder.controler")

const{auth}=require("../middleware/auth")


// Create a new folder
router.post("/createfolder/:id",auth, createFolder);

// Get all folders
router.get("/getfolders",auth, getFolders);

// Update a folder by ID
router.put("/updatefolder/:id",auth, updateFolder);

// Delete a folder by ID
router.delete("/deletefolder/:id",auth, deleteFolder);

router.get('/user/:userId', getFoldersByUser);

router.get('/getfolderid',auth,getFolderId)


module.exports = router;