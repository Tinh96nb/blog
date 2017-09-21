var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var Tag = Schema({
    tag_name: { type: String, unique: true ,required: [true, 'Không được bỏ trống.'], unique: true },
    created_at: { type: Date, default: Date.now },
});
Tag.plugin(uniqueValidator, { message: '{VALUE} đã bị trùng.' });
module.exports = mongoose.model('Tag', Tag);