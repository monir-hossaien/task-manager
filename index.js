import { PORT } from "./app/config/config.js";
import app from "./app.js"




app.listen(PORT, ()=>{
    console.log(`server run success on http://localhost:${PORT}`);
    
})