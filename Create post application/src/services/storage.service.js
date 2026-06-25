const imageKit = require("@imagekit/nodejs");
require("dotenv").config(); // Load environment variables from .env file
const imageKitInstance = new imageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,

})

async function uploadFile(buffer){
    const result = await imageKitInstance.files.upload({
        file: buffer.toString("base64"), //buffer ko base64 mai convert karna hai
        fileName: "image.png"
    })

    return result;
}
module.exports=uploadFile;