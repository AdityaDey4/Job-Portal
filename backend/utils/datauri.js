import DataUriParser from "datauri/parser.js"
//This is a module that helps convert file data (like images or PDFs) into a Data URI.
// A Data URI is a way to include file data (usually base64-encoded) directly in web pages or network requests, typically used for embedding small files (like images) without needing separate hosting.

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString(); //extension name
    return parser.format(extName, file.buffer); // convert the file into datauri
}

export default getDataUri;