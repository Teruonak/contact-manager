describe('Sign in user', () => {
    it('should sign in a user with valid credentials', (done) => {
        request({
            method: 'POST',
            url: baseUrl + '/auth/signin',
            form: {
                'email': userFixture.email,
                'password': 'P@ssw0rd!'
            },
            json: true
        }, (err, res, body) => {
            if (err) throw err;

            res.statusCode.should.equal(200);
            body.email.should.equal(userFixture.email);
            should.not.exist(body.password);
            should.not.exist(body.passwordSalt);
            done();
        });
    });

    it('should not sign in a user with invalid credentials', (done) => {
        request({
            method: 'POST',
            url: baseUrl + '/auth/signin',
            form: {
                'email': userFixture.email,
                'password': 'incorrectpassword'
            },
            json: true
        }, (err, res, body) => {
            if (err) throw err;

            res.statusCode.should.equal(400);
            body.message.should.equal('Invalid email or password.');
            done();
        });
    });
});
