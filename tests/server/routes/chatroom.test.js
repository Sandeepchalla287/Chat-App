/* global describe it before afterEach beforeEach */

const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../server/app/main');
const db = require('../../../server/model');
const Message = require('../../../server/model/message');
const User = require('../../../server/model/user');
const Chatroom = require('../../../server/model/chatroom');

describe('Chatroom Routes', () => {
  before('Clear database', () => db.sync({ force: true }));
  afterEach('Clear database', () => db.sync({ force: true }));

  const message1 = {
    content: 'Hello world!',
    user_id: 1,
    chatroom_id: 1,
  };

  const message2 = {
    content: 'Example content.',
    user_id: 1,
    chatroom_id: 1,
  };

  const message3 = {
    content: 'Sometimes I get creative with seed data',
    user_id: 1,
    chatroom_id: 1,
  };

  beforeEach('Create a Message', () => {
    return User.create({
      name: 'Example',
      email: 'example@example.com',
      password: '12345',
    })
    .then(() => {
      return User.create({
        name: 'Stranger',
        email: 'strange@strange.com',
        password: 'somethingStrange',
      });
    })
    .then(() => {
      return Chatroom.create({
        name: 'Super Secret Chatroom',
      });
    })
    .then(() => Message.create(message1))
    .then(() => Message.create(message2))
    .then(() => Message.create(message3));
  });

  describe('Routes', () => {
    it('GET /api/chatrooms', () => {
      return request(app)
        .get('/api/chatrooms')
        .expect(200)
        .expect(res => expect(res.body.length).to.equal(1));
    });

    // Expect to get only the messages in that hatroom
    // Expect the order to be ascending from when it was created
    it('GET /api/chatrooms/:chatroomId/messages', () => {
      return request(app)
        .get('/api/chatrooms/1/messages')
        .expect(200)
        .expect(res => expect(res.body.length).to.equal(3))
        .expect(res => expect(res.body[0].content).to.equal(message1.content))
        .expect(res => expect(res.body[1].content).to.equal(message2.content))
        .expect(res => expect(res.body[2].content).to.equal(message3.content));
    });
  });
});