app.post("/score",(req,res)=>{

    const {userId,score} = req.body;

    db.query(
        "INSERT INTO scores(user_id,score) VALUES (?,?)",
        [userId,score]
    );

    res.json({
        message:"儲存成功"
    });
});