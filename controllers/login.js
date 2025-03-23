const users = [{username: 'admin', password: 'admin'}, {username: 'admin2', password: 'admin2'}]

exports.getLogin =  (req, res) =>{

    //render login page, if the credentials are invalid display an error message
    res.render('login', {error: req.session.error});
}

exports.postLogin = async (req, res) =>{

    const {username, password} = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if(user){
        //session for admin
        req.session.user = username;

        //delete th error and redirect to admin page
        delete req.session.error;
        res.redirect('/admin');
    }
    else{
       // if the credentials are invalid display an error message and redirect to the login page
        req.session.error = 'Invalid username or password';
        res.redirect('/login');
    }
}

exports.getLogout = function (req, res) {
    // clear the session then display the login view.
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.render('error', {message: 'Error, please try again'});
        }
        else {
            console.log('session is clear...ready to login');
            res.redirect('/login');
        }
    });
}