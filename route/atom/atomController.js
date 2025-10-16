const db = require('../../db/db.js')

exports.makeAtom = (req, res) => {
    const {redCount, whiteCount, electronCount} = req.body;
    console.log(redCount, whiteCount, electronCount);
    db.query('select * from users where username=?',[req.session.user.username],(err1,res2) => {
        if (err1) return console.log(err1);
        const uid = res2[0].id;
        db.query('select * from atom where proton = ? and netron = ? and electron = ?',[redCount,whiteCount,electronCount],(err2,res1) => {
            if (err2) return console.log(err2);
            if (res1.length === 0) {
                console.log(1000);
                res.redirect('/logined/main');
                return;
            }
            const aid = res1[0].number;
            console.log(aid)
            db.query('insert into history(isotope_number,user_id) values (?,?)',[aid,uid],(err,res3) => {
                if (err) return console.log(err);
                console.log("success");
            })
        })
    })

}