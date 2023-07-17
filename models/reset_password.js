const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    
    accessToken: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number,
        required:true
    }
},{
    timestamps: true
});

resetSchema.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  };
  
  resetSchema.statics.validPassword = function (password, user) {
    return bcrypt.compareSync(password, user);
  };
const Reset = mongoose.model('Reset', resetSchema);
module.exports = Reset;