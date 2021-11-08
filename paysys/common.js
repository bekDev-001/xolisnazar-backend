const SoldNewspaper = require("../models/SoldNewspaper");
const Subscription = require("../models/Subscription");

exports.isAccountExistCommon = async (check_id) => {
  const is_user_exist = await SoldNewspaper.findById(check_id);

  if (!is_user_exist) {
    const is_subscription_exist = await Subscription.findOne({
      _id: check_id,
    });
    if (!is_subscription_exist || is_subscription_exist.paid) {
      return false;
    }
  } else if (is_user_exist.paid) {
    return false;
  }
  return true;
};

exports.getPayingCostCommon = async (check_id) => {
  const check = await SoldNewspaper.findOne({ _id: check_id });
  if (!check) {
    const subscription = await Subscription.findOne({
      _id: check_id,
    });
    return subscription.amount;
  }
  return check.paymentAmount;
};

exports.markAsPaidCommon = async (check_id) => {
  const exists = await SoldNewspaper.findOneAndUpdate(
    { _id: check_id },
    { $set: { paid: true } }
  );
  if (exists === null) {
    await Subscription.findOneAndUpdate(
      { _id: check_id },
      { $set: { paid: true } }
    );
  }
};
