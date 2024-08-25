const express = require("express");
const router = express.Router();

const { saveForm, fetchform, deleteform, getFormByUser, fetchByUniqueUrl, getFormsByFolder, updateTheme } = require("../controllers/Form.controler");
const { auth } = require("../middleware/auth");

router.post("/saveform", auth, saveForm);
router.get("/fetchform/:formId", fetchform);
router.delete("/deleteform/:id", auth, deleteform);
router.get('/user/:userId', getFormByUser);
router.get('/fetchByUniqueUrl/:uniqueUrl', fetchByUniqueUrl);
router.get('/folder/:folderId', getFormsByFolder);
router.put('/updateTheme/:formId', auth, updateTheme);

module.exports = router;
