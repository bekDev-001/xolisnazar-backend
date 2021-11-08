const ClickModel = require("../../models/ClickModel");
const {
  isAccountExistCommon,
  getPayingCostCommon,
  markAsPaidCommon,
} = require("../common");
const { checkSignString } = require("./middleware");

exports.clickPrepare = async (req, res) => {
  try {
    const body = {
      click_trans_id: req.body.click_trans_id,
      service_id: req.body.service_id,
      click_paydoc_id: req.body.click_paydoc_id,
      merchant_trans_id: req.body.merchant_trans_id,
      amount: req.body.amount,
      action: req.body.action,
      error: req.body.error,
      error_note: req.body.error_note,
      sign_time: req.body.sign_time,
      sign_string: req.body.sign_string,
    };

    if (!checkSignString(body, false)) {
      return res.json({
        error: -1,
        error_note: "Auth failed",
      });
    }

    const prepare = new ClickModel(body);
    console.log(prepare);
    const check_id = prepare.merchant_trans_id;

    const has_account = await isAccountExistCommon(check_id);
    if (!has_account) {
      return res.json({
        error: -5,
        error_note: "Check not found",
      });
    }
    const cost = await getPayingCostCommon(check_id);

    if (cost != prepare.amount) {
      return res.json({
        error: -2,
        error_note: "Invalid amount",
      });
    }

    const savedPrepare = await prepare.save();

    const is_allready_paid = await ClickModel.findOne({
      click_trans_id: prepare.click_trans_id,
    });
    if (!is_allready_paid) {
      return res.json({
        error: -4,
        error_note: "Check allready paid",
      });
    }

    return res.json({
      click_trans_id: savedPrepare.click_trans_id,
      merchant_trans_id: savedPrepare.merchant_trans_id,
      merchant_prepare_id: savedPrepare._id,
      error: savedPrepare.error,
      error_note: savedPrepare.error_note,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: -8,
      error_note: "Unknown error",
    });
  }
};

exports.clickComplete = async (req, res) => {
  try {
    const complete = {
      click_trans_id: req.body.click_trans_id,
      service_id: req.body.service_id,
      click_paydoc_id: req.body.click_paydoc_id,
      merchant_trans_id: req.body.merchant_trans_id,
      merchant_prepare_id: req.body.merchant_prepare_id,
      amount: req.body.amount,
      action: req.body.action,
      error: req.body.error,
      error_note: req.body.error_note,
      sign_time: req.body.sign_time,
      sign_string: req.body.sign_string,
    };

    if (!checkSignString(complete, true)) {
      return res.json({
        error: -1,
        error_note: "Auth failed",
      });
    }

    const exists = await ClickModel.findOne({
      click_trans_id: complete.click_trans_id,
    });

    if (!exists) {
      return res.json({
        error: -9,
        error_note: "Not found",
      });
    }
    if (exists.marchant_prepare_id) {
      return res.json({
        click_trans_id: complete.click_trans_id,
        merchant_trans_id: complete.merchant_trans_id,
        merchant_confirm_id: complete._id,
        error: complete.error,
        error_note: complete.error_note,
      });
    }

    await ClickModel.findOneAndUpdate({ _id: exists._id }, { $set: complete });

    if (complete.error) {
      return res.json({
        click_trans_id: complete.click_trans_id,
        merchant_trans_id: complete.merchant_trans_id,
        merchant_confirm_id: complete._id,
        error: complete.error,
        error_note: complete.error_note,
      });
    }

    const check_id = complete.merchant_trans_id;
    await markAsPaidCommon(check_id);

    return res.json({
      click_trans_id: complete.click_trans_id,
      merchant_trans_id: complete.merchant_trans_id,
      merchant_confirm_id: complete._id,
      error: complete.error,
      error_note: complete.error_note,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: -8,
      error_note: "Unknown error",
    });
  }
};

// integratsiya yakuniga yetdi :) Katta rahmat Yusufjon aka
// clickga serverga qo'ygandan kyn prepare complete endpointlarni beraslar
