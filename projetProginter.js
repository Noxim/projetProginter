
itemList = new Mongo.Collection('items');
archives = new Mongo.Collection('archives');
evenementsEnCours = new Mongo.Collection('event');

if (Meteor.isClient) {
//helpers
  Template.pageAccueil.helpers({
  'click .createList': function(){

  } //Base du code pour l'event du template "créer une liste"//
  });
  Template.profil.helpers({
    
  });
  Template.formulaire.helpers({
    
  });
  Template.evenement.helpers({
    
  });
//events
  Template.pageAccueil.events({
    
  });
  Template.profil.events({
    
  });
  Template.formulaire.events({
    
  });
  Template.evenement.events({
    
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
//methodes
Meteor.methods({

});
