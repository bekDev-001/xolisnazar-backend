const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/multer").fields([
  { name: "photo", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);
const {
  signUp,
  signIn,
  logOut,
  postNews,
  updateNews,
  deleteNews,
  postCategory,
  updateCategory,
  deleteCategory,
  postAd,
  updateAds,
  deleteAds,
  getContacts,
  getContactById,
  postTodo,
  updateTodo,
  getAllTodos,
  deleteTodo,
  postNewspaper,
  putNewspaper,
  deleteNewspaper,
  createPortret,
  updatePortret,
  deletePortret,
  translator,
} = require("../controllers/adminController");

//! Admins
//* Sign up of new admin
router.post("/signUp", signUp);
//* Sign in of admin
router.post("/signIn", signIn);
//* Log out of admin
router.get("/logOut", authMiddleware, logOut);
//! News
//* Posts a new News
router.post("/postNews", authMiddleware, upload, postNews);
//* Update the news
router.put("/updateNews/:id", authMiddleware, upload, updateNews);
//* Delete the news
router.delete("/deleteNews/:id", authMiddleware, deleteNews);
//! Category
//* Posts a new category
router.post("/postCategory", authMiddleware, upload, postCategory);
//* Update the category
router.put("/updateCategory/:id", authMiddleware, upload, updateCategory);
//* Delete the category
router.delete("/deleteCategory/:id", authMiddleware, deleteCategory);
//! Ads
//* Posts a new ads
router.post("/postAd", authMiddleware, upload, postAd);
//* Updates the ads
router.put("/updateAds/:id", authMiddleware, upload, updateAds);
//* Delete the ads
router.delete("/deleteAds/:id", authMiddleware, deleteAds);
//! Contact requests
//* All contact requests
router.get("/getContacts", authMiddleware, getContacts);
//* One contact by id
router.get("/getContactById/:id", authMiddleware, getContactById);
//! ToDo list
//* Creates a todo
router.post("/postTodo", authMiddleware, postTodo);
//* Updates a todo
router.put("/updateTodo/:id", authMiddleware, updateTodo);
//* Get all todos
router.get("/getAllTodos", authMiddleware, getAllTodos);
//* Delete todo by id
router.delete("/deleteTodo/:id", authMiddleware, deleteTodo);
//! Newspapers
//* Creates a newspaper
router.post("/postNewspaper", authMiddleware, upload, postNewspaper);
//* Edits a newspaper
router.put("/putNewspaper/:id", authMiddleware, putNewspaper);
//* Deletes a newspaper
router.delete("/deleteNewspaper/:id", authMiddleware, deleteNewspaper);
//! Portret
//* Create portret
router.post("/postPortret", createPortret);
//* Update portret
router.put("/putPortret/:id", updatePortret);
//* Delete portret
router.delete("/deletePortret/:id", deletePortret);
//! Translator
//* POST Krill => Lotin
router.post("/translate", translator);

module.exports = router;
