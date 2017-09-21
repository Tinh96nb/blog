var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
/* Conver Date */
function convertDate(date) {
    var d = new Date(date);
    date = d.getHours() + "h"+" Thứ "+ d.getDay() +", " + d.getDate() + "-"+ d.getMonth()+"-"+d.getFullYear();
    return date;
}

var Aticle = Schema({
    title: { type: String, default: '', required: [true, 'Không được bỏ trống.'] },
    body: { type: String, default: '', required: [true, 'Không được bỏ trống.'] },
    type_layout: { type: String, default: '' },
    slug: { type: String, lowercase: true, required: [true, 'Không được bỏ trống.'], unique: true },
    created_by_id: { type: Schema.ObjectId, ref: 'User', required: [true, 'Không được bỏ trống.'] },
    image_id: { type: Schema.ObjectId, ref: 'Image' },
    category_id: [{ type: Schema.ObjectId, ref: 'Category' }],
    view: { type: Number, default: 1 },
    daft: { type: Boolean, default: true },
    des: { type: String, default: 'Descreption',required: [true, 'Không được bỏ trống.']},
    tags_id: [{ type: Schema.ObjectId, ref: 'Tag' }],
    created_at: { type: Date, default: Date.now , get: convertDate },
    updated_at: { type: Date, default: Date.now }
});

Aticle.plugin(uniqueValidator, { message: '{VALUE} đã bị trùng.' });
module.exports = mongoose.model('Aticle', Aticle);