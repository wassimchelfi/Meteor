import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Messages} from '../both/collections'
import {Coins} from '../both/collections'
import {HTTP} from 'meteor/http'
import './main.html';

if (Meteor.isDevelopment) {
  window.Messages = Messages;
  window.Coins = Coins;
}

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});


Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },

  title(str) {
    return `${str} Titre de JS ${str}`
  }

});



Template.hello.events({
  'click .js-add-1'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },

  'click .js-add-5'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 5);
  },

});


Template.form.events({
  'submit .js-form-message'(event, instance) {
    event.preventDefault();

    let message = event.target.js_message.value;
    console.log("Pression Btn Form", message);

    let messageDoc = {
      content: message,
      dateAdd: new Date()
    }

    let id = Messages.insert(messageDoc)
    console.log(id);
    event.target.js_message.value = '';
    console.log('MongoDB contenu', Messages.findOne({
      _id: id
    }).content);
  },
});

Template.form.helpers({
  messages() {
    return Messages.find().fetch();
  }
});

Template.coins.helpers({
  create: function () {

  },
  rendered: function () {

  },
  destroyed: function () {

  },
});

Template.coins.events({
  'click .js-getCoin': function (event, template) {

    collecte()
    setInterval(collecte(5), 60000 * 10);

  }
});

function collecte(mn) {
  for (i = 1; i < 5; i++) {
    setInterval(getData(i), 60000 * mn);
  }
}

function getData(i) {
  HTTP.call('GET', `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20gecko_desc%2C%20gecko_asc%2C%20market_cap_asc%2C%20market_cap_desc%2C%20volume_asc%2C%20volume_desc%2C%20id_asc%2C%20id_desc&per_page=250&page=${i}&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d%2C%2014d%2C%2030d%2C`, {
    params: {}
  }, function (error, response) {
    if (error) {
      console.log(error);
    } else {

      let date = new Date();
      Coins.insert({
        response,
        date
      })

      console.log(response);
      /*
      This will return the HTTP response object that looks something like this:
      {
        content: "String of content...",
        data: [{
          "body": "The body of the post with the ID 5."
          "id": 5,
          "title": "The title of the post with the ID 5.",
          "userId": 1
        }],
        headers: {  Object containing HTTP response headers }
        statusCode: 200
      }
      */
    }
  });
}