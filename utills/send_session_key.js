const { encrypt } = require("./utills")

exports.send_session_key = async (user, status_code, res)=>{


    console.log("LOG --> SEND SESSION ID / COOKIE")
    const session_key = user.generate_session_key()

    // setting cookies
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    }

    // hide the password
    user.password = undefined

    // semd cookie and response
    res.status(status_code)
        .cookie("arul_kart", session_key, options)
        .json({
            success : true,
            user : encrypt(user)
        })



}