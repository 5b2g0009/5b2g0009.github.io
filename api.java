app.post("/register", async (req,res)=>{

    const {username,password} = req.body;

    const hash = await bcrypt.hash(password,10);

    db.query(
        "INSERT INTO users(username,password) VALUES (?,?)",
        [username,hash],
        (err,result)=>{
            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"註冊成功"
            });
        }
    );
});