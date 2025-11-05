exports.mainGetMid = (req,res) => {
    if (req.session.is_logined === true) {
        res.redirect('/logined/main');
    }
    else{
        res.render('main/logout_main')
    }
}