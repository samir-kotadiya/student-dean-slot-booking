import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testing the login/logout endpoints:', () => {
  it('It should login with email and password', (done) => {
    const payload = {
      email: 'samir@gmail.com',
      password: '123456'
    };
    chai.request(app)
      .post('/v1/user/login')
      .set('Accept', 'application/json')
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({
          "statusCode": 200,
          "type": "success",
          "message": "OK",
          "data": {
            "status": true,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0NTYzODlhLTYwNDMtNDI4Zi04MTU4LTMzMDBiNDcyZjk2MSIsImlhdCI6MTY0NDA2NTY2M30.STfvi8WbjfHHjie8kNqYKlAffXPbUEzjeDlgHkHXL5I"
          }
        });
        done();
      });
  });

  it('It should return 400 incase of invalid login', (done) => {
    const payload = {
      email: 'samir@gmail.com-invalid',
      password: '123456'
    };
    chai.request(app)
      .post('/v1/user/login')
      .set('Accept', 'application/json')
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.data).to.include({
          "statusCode": 400,
          "type": "success",
          "action": "Failed",
          "message": "email not exits"
        });
        done();
      });
  });

  it('It should logout successfullt when valid token is passed', (done) => {
    chai.request(app)
      .get('/v1/user/logout')
      .set('Accept', 'application/json')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0NTYzODlhLTYwNDMtNDI4Zi04MTU4LTMzMDBiNDcyZjk2MSIsImlhdCI6MTY0NDA2NTY2M30.STfvi8WbjfHHjie8kNqYKlAffXPbUEzjeDlgHkHXL5I')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('status');
        done();
      });
  });

  it('It should logout 401 when in valid token is passed', (done) => {
    chai.request(app)
      .get('/v1/user/logout')
      .set('Accept', 'application/json')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0NTYzODlhLTYwNDMtNDI4Zi04MTU4LTMzMDBiNDcyZjk2MSIsImlhdCI6MTY0NDA2NTY2M30.STfvi8WbjfHHjie8kNqYKlAffXPbUEzjeDlgHkHXL5I')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        res.body.data.should.have.property('statusCode');
        expect(res.body.data).to.be('401');
        expect(res.body.data).message.be('Token expired');
        done();
      });
  });

  it('It should register success when valid paylod given', (done) => {
    const payload = {
      "role": "admin",
      "name": "samir admin",
      "email": "admin@gmail.com",
      "phone": "8511494795",
      "password": "admin@user",
      "confirmPassword": "admin@user"
    };
    chai.request(app)
      .post(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0NTYzODlhLTYwNDMtNDI4Zi04MTU4LTMzMDBiNDcyZjk2MSIsImlhdCI6MTY0NDA2NTY2M30.STfvi8WbjfHHjie8kNqYKlAffXPbUEzjeDlgHkHXL5I')
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('requestId');
        expect(res.body.data).message.be('OK');
        done();
      });
  });
});
