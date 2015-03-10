/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

 'use strict';

 var Faker = require ('../../node_modules/faker/build/build/faker.min')
// Models
var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Question = require('../api/question/question.model');
var Article = require('../api/article/article.model');
var Tag = require('../api/tag/tag.model');


// Seeds
Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

Tag.find().remove(function(){
  Tag.create({
    name: 'hurtroom',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    questions_id: [],
    questions_count: 112,
    articles_id: [],
    articles_count: 123,
    votes_count: 23,
    views_count: 102
  }, {
    name: 'เบื่อความรัก',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    questions_id: [],
    questions_count: 2131,
    articles_id: [],
    articles_count: 1,
    votes_count: 3,
    views_count: 3213
  }, {
    name: 'เบื่อชีวิต',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    questions_id: [],
    questions_count: 3,
    articles_id: [],
    articles_count: 5,
    votes_count: 8,
    views_count: 9
  }
  )
})

User.find({}).remove(function() {
  for (var c = 0; c < 10; c++) {
    User.create({
      provider: 'local',
      name: {
        first: Faker.name.firstName(),
        last: Faker.name.lastName()
      },
      coverimg: Faker.image.avatar(),
      summary: Faker.lorem.sentence(),
      reason: Faker.lorem.sentences(),
      email: Faker.internet.email(),
      username: Faker.internet.userName(),
      password: 'test'
    })
  }
  User.create({
    provider: 'local',
    name: {
      first: Faker.name.firstName(),
      last: Faker.name.lastName()
    },
    coverimg: Faker.image.avatar(),
    summary: Faker.lorem.sentence(),
    reason: Faker.lorem.sentences(),
    email: 'test@test.com',
    username: Faker.internet.userName(),
    password: 'test'
  }, {
    provider: 'local',
    name: {
      first: 'Supakorn',
      last: 'Laohasongkram'
    },
    coverimg: Faker.image.avatar(),
    summary: Faker.lorem.sentence(),
    reason: Faker.lorem.sentences(),
    role: 'admin',
    email: 'admin@admin.com',
    username: Faker.internet.userName(),
    password: 'admin'
  }, function() {
    User.find(function(err, users){
      for (var i in users) {
        for (var yo = 0; yo < 10; yo++) {
          Article.find({}).remove(function(){    
            Article.create({
              name: Faker.lorem.sentence(),
              importance: Faker.lorem.sentence(),
              summary: Faker.lorem.sentences(),
              body: Faker.lorem.paragraphs() + Faker.lorem.paragraphs(),
              coverImg: Faker.image.nature(),
              tags: [{name:'ความรัก'},{name: 'ครอบครัว'}],
              owner: {
                _ownerId: users[i]._id,
                username: users[i].username,
                summary: users[i].summary,
                role: users[i].role
              }
            })
          })
          Question.find({}).remove(function(){        
            Question.create({
              searchname: 'สวัสดี|ครับ| |ผม|ชื่อ|กร|ครับ| |ยิน|ดี|ที่|ได้|รู้|จัก',
              name: 'สวัสดีครับ ผมชื่อกรครับยินดีที่ได้รู้จัก',
              body: Faker.lorem.paragraph(),
              votes: ['yoyoyo','yoyo'],
              votes_count: Faker.random.number(100),
              jais_count: Faker.random.number(100),
              answers_count: Faker.random.number(10),
              views: Faker.random.number(100),
              tags: [{name:'เพื่อน'},{name: 'การงาน'}],
              topic: 'ครอบครัว',
              owner: {
                _ownerId: users[i]._id,
                username: users[i].username,
                role: users[i].role,
                coverimg: Faker.image.avatar()
              },
              created: Faker.date.recent()
            })

            Question.create({
              searchname: 'ผ|มอ|ยา|กทํา|เว็บ|ให้|เสร็จ| |ผม|ชื่อ|กร|ครับ',
              name: 'ผมอยากทําเว็บให้เสร็จ ผมชื่อกรครับ',
              body: Faker.lorem.paragraph(),
              votes: ['yoyoyo','yoyo'],
              votes_count: Faker.random.number(100),
              jais_count: Faker.random.number(100),
              answers_count: Faker.random.number(10),
              views: Faker.random.number(100),
              tags: [{name:'ธุรกิจ'},{name:'ครอบครัว'}],
              topic: 'การงาน',
              owner: {
                _ownerId: users[i]._id,
                username: users[i].username,
                role: users[i].role,
                coverimg: Faker.image.avatar()
              },
              created: Faker.date.past()
            })

          })  
        }
      }
    })
});
});







