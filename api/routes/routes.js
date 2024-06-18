const express=require ("express")
const router = express.Router()
const userController = require("../controller/userController")

router.post("/signup",userController.user)
router.post("/signin",userController.userSignin)
router.post("/google",userController.userGoogle)
router.post("/auth",userController.userAuth)
router.post("/user",userController.userUpdate)
router.post("/profile",userController.userDelete)
router.post("/List",userController.createList)
router.get("/lists",userController.getList)
router.post("/delete",userController.deleteList)
router.post("/month",userController.payMonth)
//router.post("/update",userController.countUpdate)
router.post("/change",userController.reviewUpdate)
router.post("/review",userController.TotalReview)


module.exports = router