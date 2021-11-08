const router = require("express").Router();
const {
  getLastNews,
  getLastNewsById,
  getAllNews,
  getCategoryNewsById,
  getNews,
  addView,
  getAllCategories,
  getNewspapers,
  getJournals,
  getCategory,
  getAllAds,
  getAds,
  getHomepageAds,
  currency,
  postContact,
  createBill,
  getAllNewspaperBills,
  createSubsBill,
  getAllSubscriptionBills,
  getPortret,
  getPortrets,
} = require("../controllers/indexController");

//! News
//* Gets a news by id
router.get("/getNews/:id", getNews);
//* Gets all news
router.get("/getAllNews", getAllNews);
//* Gets news by category id
router.get("/getCategoryNews/:id", getCategoryNewsById);
//* Update the view of the news by id
router.put("/addView/:id", addView);
//* Get last news
router.get("/getLastNews", getLastNews);
//* Get last news
router.get("/getLastNews/:id", getLastNewsById);
//! Category
//* Gets all categories
router.get("/getAllCategories", getAllCategories);
//* Gets a category by id
router.get("/getCategory/:id", getCategory);
//* Gets all newspapers
router.get("/getNewspapers", getNewspapers);
//* Gets all journals
router.get("/getJournals", getJournals);
//! Ads
//* Gets all ads
router.get("/getAllAds", getAllAds);
//* Gets an ads by categoryid
router.get("/getCategoryAds/:categoryid", getAds);
//* Gets an ads by homepage boolean
router.get("/getAds/homepage", getHomepageAds);
//! Contact form
router.post("/postContact", postContact);
//! Currency data
router.get("/currency", currency);
//! SoldNewspapers
//* Creates a bill for newspaper
router.post("/createNewspaperBill", createBill);
//* Gets all newspapers bills
router.get("/getAllNewspaperBills", getAllNewspaperBills);
//! Subscription
//* Creates a bill for subscription
router.post("/createSubsBill", createSubsBill);
//* Gets all subscription bills
router.get("/getAllSubscriptionBills", getAllSubscriptionBills);
//! Portret
//* Get all portrets
router.get("/getAllPortret", getPortrets);
//* Get single portret
router.get("/getSinglePortret/:id", getPortret);

module.exports = router;
