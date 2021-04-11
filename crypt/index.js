const argon2 = require('argon2');

module.exports = {
    hash: async function(pass){
        var hash = await argon2.hash(pass, {
            type: argon2.argon2id,
            hashLength: 64,
        });
        return hash;
    },
    verify: async function(hash, pass){
        var verifyBool = await argon2.verify(hash,pass);
        return verifyBool;
    },
}
