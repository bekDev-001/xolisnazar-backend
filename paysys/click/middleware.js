const md5 = require('md5')

exports.checkSignString = (body, is_prepare) => {
    const str = `${body.click_trans_id}${body.service_id}${0}${body.merchant_trans_id}${is_prepare ? body.merchant_prepare_id : ''}${body.amount}${body.action}${body.sign_time}`;
    if (body.sign_string != md5(str)) {
        return false;
    }
    return true;
}

// const str = `${body.click_trans_id}${body.service_id}${
//   process.env.CLICK_SECRET_KEY
// }${body.merchant_trans_id}${is_prepare ? body.merchant_prepare_id : ""}${
//   body.amount
// }${body.action}${body.sign_time}`;

// CLICK_SECRET_KEY -> click berishi kk bo'lgan narsa 