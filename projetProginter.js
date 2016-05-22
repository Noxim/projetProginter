
itemList = new Mongo.Collection('items');
archives = new Mongo.Collection('archives');
evenementsEnCours = new Mongo.Collection('event');
ListeParticipants = new Mongo.Collection('participants');

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
  'afficherobjets': function(){
  return ListeObjets.find();
},
  'afficherparticipants': function(){
  return ListeParticipants.find();
},
  'compter' : function(){
	var nombre = ListeParticipants.find().count();
	if (nombre>0){return nombre+" participants";}
	else {return nombre+" participant";}
}
});
  });
//events
  Template.pageAccueil.events({
    
  });
  Template.profil.events({
    
  });
  Template.formulaire.events({
    
  });
  Template.evenement.events({
  'click .choixobjet': function(){
  /*Je veux que la case choisie disparaisse uniquement après avoir cliqué dessus ET avoir confirmé son nom*/
},
Template.ajouterparticipant.events({/*Le participant confirme avec son nom à l'événement dans ListeParticipants*/
'submit form': function(ajout){
ajout.preventDefault();
var nomParticipant = ajout.target.participant.value;
ListeParticipants.insert({
participant: nomParticipant
});
}
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
//methodes
Meteor.methods({

});
