exports.getAdmin =  async (req, res) =>{
    const user = req.session.user;
    //if the session expired redirect to login page
    if(!user) {
        return res.redirect('/login');
    }

    //render admin page
    res.render('admin');
}