var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var User = Schema({
    user_name: { type: String, required: [true, 'Username Không được bỏ trống.'], unique: true, maxlength: [20, "Username không quá 20 kí tự."] },
    real_name: { type: String, required: [true, 'Tên thật Không được bỏ trống.'] },
    password: { type: String },
    mail: { type: String, required: [true, 'Mail Không được bỏ trống.'], unique: true },
    image_id: { type: Schema.ObjectId, ref: 'Image' },
    created_at: { type: Date, default: Date.now },
}, { collection: 'users' });
User.plugin(uniqueValidator, { message: '{VALUE} đã có người dùng. Xin hãy thử lại khác.' });
module.exports = mongoose.model('User', User);