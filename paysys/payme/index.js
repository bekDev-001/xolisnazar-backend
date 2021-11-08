const router = require("express").Router();

const authenticate = require("./middleware");
const paymeIntegrator = require("./paymeIntegrator");

const handler = async (req, res) => {
    return await paymeIntegrator.handler(req, res);
};

router.post("/", authenticate, handler);

module.exports = router;
