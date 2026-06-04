app.post("/login",(req,res)=>{

    const {username,password} = req.body;

    db.query(
        "SELECT * FROM users WHERE username=?",
        [username],
        async (err,result)=>{

            if(result.length===0){
                return res.json({
                    message:"帳號不存在"
                });
            }

            const ok =
            await bcrypt.compare(
                password,
                result[0].password
            );

            if(ok){

                res.json({
                    success:true,
                    userId:result[0].id
                });

            }else{

                res.json({
                    success:false
                });

            }

        }
    );
});