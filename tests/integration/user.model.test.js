it('should authenticate a user with valid credentials', done => {
    User.authenticate(newUserData.email, newUserData.password, (err, user) => {
        if (err) throw err;

        should.exist(user);
        should.not.exist(user.password);
        should.not.exist(user.passwordSalt);
        user.email.should.equal(newUserData.email);
        done();
    });
});

it('should not authenticate user with invalid credentials', done => {
    User.authenticate(newUserData.email, 'notuserpassowrd', (err, user) => {
        if (err) throw err;

        should.not.exist(user);
        done();
    });
});
