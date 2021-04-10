const argon2 = require('argon2');

module.exports = {
    hash: async function(pass){
        var hash = await argon2.hash(pass, {
            type: argon2.argon2id,
            hashLength: 64,
        });
        return hash;
    },
}
