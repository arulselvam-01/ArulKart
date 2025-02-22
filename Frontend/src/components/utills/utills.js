import CryptoJS from "crypto-js"

const secret_key = "FDBCA59368D78"

export const encrypt = (data)=>{
    data = JSON.stringify(data)

    const encrypted_data = CryptoJS.AES.encrypt(data, secret_key).toString()

    return encrypted_data
}

export const decrypt = (data)=>{
    const bytes = CryptoJS.AES.decrypt(data, secret_key)
    var decrypted_data = bytes.toString(CryptoJS.enc.Utf8)
    decrypted_data = JSON.parse(decrypted_data)

    return decrypted_data
}