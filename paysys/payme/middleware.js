const paymeIntegrator = require("./paymeIntegrator");

const authenticate = async (request, reply, next) => {
  await paymeIntegrator.authenticate(request, reply, next);
};

module.exports = authenticate;
