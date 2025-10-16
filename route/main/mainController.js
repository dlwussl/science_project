exports.mainGetMid = (req,res) => {
    if (req.session.user !== undefined) {
        res.redirect('/logined/main');
        return;
    }
    res.render('main/logout_main')
}