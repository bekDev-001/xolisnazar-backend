const Subscription = require("../../models/Subscription");
const SoldNewspaper = require("../../models/SoldNewspaper");
const { PaymeIntegrator } = require("payme-merchant-integrator");
const { isAccountExistCommon, markAsPaidCommon, getPayingCostCommon } = require('../common');

const isAccountExist = async (account) => {
  return await isAccountExistCommon(account.check_id)
};

const getPayingCost = async (account) => {
  return getPayingCostCommon(account.check_id)
};

const markAsPaid = async (account, amount) => {
  await markAsPaidCommon(account.check_id)
};

const canCancel = async (account) => {
  // will be implemented when cancel available
  return false;
}

const markAsCancel = async (account) => {
  // will be implemented when cancel available
}

const paymeIntegrator = new PaymeIntegrator({
  db_str: process.env.DB_CONNECT,
  collection: "payme_transactions", // collection name to save transactions
  type: "one-time", // enum ['one-time', 'cumulative'] one time fee or cumulative
  password: process.env.PAYME_PASSWORD,
  isAccountExist,
  markAsPaid,
  getPayingCost, // optional for 'cumulative' type
  canCancel,
  markAsCancel
});

module.exports = paymeIntegrator;
