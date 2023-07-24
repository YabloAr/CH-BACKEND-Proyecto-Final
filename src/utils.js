//Paso Uno, crear utils
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//de aca nos vamos a App.js
export default __dirname;