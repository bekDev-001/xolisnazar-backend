const router = require("express").Router();
const {clickPrepare, clickComplete} = require('./controller')

router.post("/prepare", clickPrepare);
router.post("/complete", clickComplete);

module.exports = router;
