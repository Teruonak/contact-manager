'use strict';

/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

const http = require('http');
const request = require('request');
const chai = require('chai');
// const userFixture = require('../fixtures/user');
const should = chai.should();

// var mongoose = require('mongoose');
var app = require('../../server');
var config = app.get('config');
// var baseUrl = config.baseUrl;
// var User = mongoose.model('User');
// var Contact = mongoose.model('Contact');
// var appServer;

describe('Contacts endpoints test', function() {

    before((done) => {
        appServer = http.createServer(app);

        appServer.on('listening', function() {
            User.create(userFixture, function(err, user) {
                if (err) throw err;

                // authenticate the user
                request({
                    method: 'POST',
                    url: baseUrl + '/auth/signin',
                    form: {
                        'email': userFixture.email,
                        'password': 'P@ssw0rd!'
                    },
                    json: true
                }, function(err, res, body) {
                    if (err) throw err;

                    res.statusCode.should.equal(200);
                    done();
                });

            });
        });

        appServer.listen(config.port);
    });

    after(function(done) {
        appServer.on('close', function() {
            done();
        });

        mongoose.connection.db.dropDatabase(function(err) {
            if (err) throw err;

            appServer.close();
        });
    });

    afterEach((done) => {
        Contact.remove({}, function(err) {
            if (err) throw err;

            done();
        });
    });

    // describe('Save contact', () => {});

    describe('Create contact', () => {
        it('should create a new contact', (done) => {
            request({
                method: 'POST',
                url: `${apiUrl}/contacts`,
                form: {
                    'email': 'jane.doe@test.com',
                    'name': 'Jane Doe'
                },
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(201);
                body.email.should.equal('jane.doe@test.com');
                body.name.should.equal('Jane Doe');
                done();
            });
        });
    });

    describe('Get contacts', () => {
        before((done) => {
            Contact.collection.insert([{
                email: 'jane.doe@test.com'
            }, {
                email: 'john.doe@test.com'
            }], (err, contacts) => {
                if (err) throw err;

                done();
            });
        });

        it('should get a list of contacts', (done) => {
            request({
                method: 'GET',
                url: `${apiUrl}/contacts`,
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(200);
                body.should.be.instanceof(Array);
                body.length.should.equal(2);
                body.should.contain.a.thing.with.property('email', 'jane.doe@test.com');
                body.should.contain.a.thing.with.property('email', 'john.doe@test.com');
                done();
            });
        });
    });

    describe('Get contact', function() {
        let _contact;

        before((done) => {
            Contact.create({
                email: 'john.doe@test.com'
            }, (err, contact) => {
                if (err) throw err;

                _contact = contact;
                done();
            });
        });

        it('should get a single contact by id', (done) => {
            request({
                method: 'GET',
                url: `${apiUrl}/contacts/${_contact.id}`,
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(200);
                body.email.should.equal(_contact.email);
                done();
            });
        });

        it('should not get a contact if the id is not 24 characters', (done) => {
            request({
                method: 'GET',
                url: `${apiUrl}/contacts/U5ZArj3hjzj3zusT8JnZbWFu`,
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(404);
                done();
            });
        });
    });

    describe('Update contact', () => {
        let _contact;

        before((done) => {
            Contact.create({
                email: 'jane.doe@test.com'
            }, (err, contact) => {
                if (err) throw err;

                _contact = contact;
                done();
            });
        });

        it('should update an existing contact', (done) => {
            request({
                method: 'PUT',
                url: `${apiUrl}/contacts/${_contact.id}`,
                form: {
                    'name': 'Jane Doe'
                },
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(200);
                body.email.should.equal(_contact.email);
                body.name.should.equal('Jane Doe');
                done();
            });
        });
    });

    describe('Delete contact', () => {
        var _contact;

        before((done) => {
            Contact.create({
                email: 'jane.doe@test.com'
            }, (err, contact) => {
                if (err) throw err;

                _contact = contact;
                done();
            });
        });

        it('should update an existing contact', (done) => {
            request({
                method: 'DELETE',
                url: `${apiUrl}/contacts/${_contact.id}`,
                json: true
            }, (err, res, body) => {
                if (err) throw err;

                res.statusCode.should.equal(204);
                should.not.exist(body);
                done();
            });
        });
    });
});
