import mime from "mime-types";

const authorized = ["image/jpeg", "image/png"];

export const PicsAuth = filename => authorized.includes(mime.lookup(filename));

export default PicsAuth;