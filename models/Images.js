var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = Schema({
    path: { type: String, lowercase: true, required: [true, 'Không được bỏ trống.'] },
    size: { type: String },
    type: { type: String },
    created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Image', Image);