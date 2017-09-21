var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
function convertDate(date) {
    var d = new Date(date);
    date = d.getHours() + "h"+" Thứ "+ d.getDay() +", " + d.getDate() + "-"+ d.getMonth()+"-"+d.getFullYear();
    return date;
}
var Category = Schema({
    slug: { type: String, lowercase: true, required: [true, 'Không được bỏ trống.'], unique: true },
    title: { type: String, default: '', required: [true, 'Không được bỏ trống.'] },
    des: { type: String, default: '', required: [true, 'Không được bỏ trống.'] },
    image_id: { type: Schema.ObjectId, ref: 'Image' },
    created_at: { type: Date, default: Date.now ,get: convertDate },
});
Category.plugin(uniqueValidator, { message: '{VALUE} đã bị trùng.' });
module.exports = mongoose.model('Category', Category);