const cryptoJs = require("crypto-js")

exports.decrypt = (data)=>{
    const bytes = cryptoJs.AES.decrypt(data, process.env.JWT_ENCRYPTION_KEY)
    var decrypted_data = bytes.toString(cryptoJs.enc.Utf8)
    decrypted_data = JSON.parse(decrypted_data)

    return decrypted_data
}

exports.encrypt = (data)=>{
    data = JSON.stringify(data)

    const encrypted_data = cryptoJs.AES.encrypt(data, process.env.JWT_ENCRYPTION_KEY).toString()

    return encrypted_data
}