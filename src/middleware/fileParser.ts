import { RequestHandler, Request } from "express";
import formidable, { File } from "formidable";
export interface RequesWithFiles extends Request {
    files?: { [key: string]: File }
}

const fileParser: RequestHandler = async (req: RequesWithFiles, res, next) => {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;")) {
        return res.status(403).json({ error: "Only accepts form-data!" });
    }
    req.body = {}
    const form = formidable({
        multiples: false
    })
    const [fields, files] = await form.parse(req);
    for (let key in fields) {
        const field = fields[key];
        if (field) {
            req.body[key] = field[0];
        }
    }
    for (let key in files) {
        const file = files[key];
        const firstFile = file?.[0];
        if (!firstFile) continue;

        if (!req.files) {
            req.files = {};
        }
        req.files[key] = firstFile;
    }
    next()

}

export default fileParser;