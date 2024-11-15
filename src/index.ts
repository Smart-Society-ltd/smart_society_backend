import dotenv from "dotenv";
import connectMongodb from './db/config.js';
import app from "./app.js";

dotenv.config({
  path: './.env'
});


const initialize = async () => {
  try {

    await connectMongodb();

    app.on('error', (error) => {
      console.log(error);
    })
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error);
  }
}

initialize();



