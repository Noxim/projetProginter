/* PACKAGES USED
  accounts-ui
  accounts-password
*/

itemList = new Mongo.Collection('items');
archives = new Mongo.Collection('archives');
evenementsEnCours = new Mongo.Collection('event');
contactsList = new Mongo.Collection('contacts');

if (Meteor.isClient) {
  Meteor.subscribe('theCurrentEvents');
  Meteor.subscribe('theContacts');
  Session.set('showingProfile', 1);

  Template.profil.helpers({
    // fonction pour afficher la liste des contacts, triés alphabétiquement
    'contacts': function(){
      var currentUserId = Meteor.userId();
      return contactsList.find({}, {sort: {name: 1} });
    },
    // fonction pour afficher la liste des événements en cours, triés du plus ancien au plus récent, puis alphabétiquement
    'event': function(){
      var currentUserId = Meteor.userId();
      return evenementsEnCours.find({createdBy: currentUserId}, {sort: {date:1, name: 1}});
    },

    // fonction pour afficher la liste des événements archivés, triés du plus récent au plus ancien, puis alphabétiquement
    'archives': function(){
      var currentUserId = Meteor.userId();
      return archives.find({createdBy: currentUserId}, {sort: {date:1, name: 1}});
    },

    // fonction pour mettre en évidence le contact sélectionné pour la modification
    'selectedContactClass': function(){
      var contactId = this._id;
      var selectedContact = Session.get('selectedContact');
      if (contactId == selectedContact) {
        return "selected"
      }
    },

    // fonction pour montrer le champ de modification d'un contact
    'showEditContact':function(){
      var selectedContactVar = Session.get('selectedContact');
      return contactsList.findOne(selectedContactVar);
    },

    // fonction pour montrer/cacher la page de profil
    'visibleProfilePage': function(){
      var visibleProfile = Session.get('showingProfile');
      if (visibleProfile == 1) {
        return "hideProfile"
      } else if (visibleProfile == 2) {
        Session.set('showingProfile', 0);
      }
    },

    // fonction pour changer la valeur du boutton "montrer/cacher le profil"
    'valueProfileButton': function(){
      var visibleProfile = Session.get('showingProfile');
      if (visibleProfile == 1) {
        return "Montrer le profil"
      } else {
        return "Cacher le profil"
      }
    }
  })

  Template.profil.events({
    // fonction pour ajouter un contact à la liste
    'submit .addContactForm': function(){
      event.preventDefault();
      var nomContactVar = event.target.nomContact.value;
      var emailContactVar = event.target.emailContact.value;
      //S'il n'y a pas de nom ou d'email dans le formulaire, message d'alerte.
      if (nomContactVar!="" && emailContactVar != ""){
        event.target.nomContact.value = "";
        event.target.emailContact.value = "";
        Meteor.call('insertContactData', nomContactVar, emailContactVar);
      } else{
        alert("Entrer un nom et un email");
      }
    },

    // fonction pour modifier un contact de la liste
    'submit .editContactForm':function(){
      event.preventDefault();
      var selectedContactVar = Session.get('selectedContact');
      var editNomContactVar = event.target.editNomContact.value;
      var editEmailContactVar = event.target.editEmailContact.value;
      //S'il n'y a pas de nom ou d'email dans le formulaire, message d'alerte et disparition du formulaire de modification.
      if (editNomContactVar != "" && editEmailContactVar != "") {
        Meteor.call('editContactData', selectedContactVar, editNomContactVar, editEmailContactVar);
        Session.set('selectedContact', "");
        event.target.editNomContact.value = "";
        event.target.editEmailContact.value = "";
      } else {
        alert("Aucune modification");
        Session.set('selectedContact', "");
      }
    },

    // fonction lors du click sur "modifier le contact"
    'click .editContact': function(){
      var contactId = this._id;
      Session.set('selectedContact', contactId);
    },

    // fonction lors du click sur "supprimer le contact"
    'click .deleteContact': function(){
      var contactId = this._id;
      Meteor.call('removeContactData', contactId);
    },

    // fonction lors du click sur "annuler" lors de la modification d'un contact
    'click .closeEdit': function(){
      Session.set('selectedContact', "");
    },

    // fonction lors du click sur "montrer/cacher le profil"
    'click .showProfilePage':function(){
      Session.set('showingProfile', Session.get('showingProfile')+1);
      var test1 = Session.get('showingProfile');
    },

    // fonction lors du click sur "créer un événement"
    'click .createEvent': function(){

    },

    // fonction lors du click sur "aller sur la page de l'événement"
    'click .goEvent': function(){
      var eventId = this._id;
      var dateUnsorted = evenementsEnCours.findOne({_id:eventId}).date;
      Meteor.call('sortDate', eventId, dateUnsorted);
    }
  })
}

if (Meteor.isServer) {
  Meteor.publish('theCurrentEvents', function(){
    var currentUserId = this.userId;
    return evenementsEnCours.find({createdBy:currentUserId})
  });

  Meteor.publish('theContacts', function(){
    var currentUserId = this.userId;
    return contactsList.find({createdBy:currentUserId})
  });

  Meteor.methods({
    // fonction pour insérer un contact dans la liste de contacts
    'insertContactData': function(nomContactVar, emailContactVar){
      var currentUserId = Meteor.userId();
      contactsList.insert({
        name: nomContactVar,
        email: emailContactVar,
        createdBy: currentUserId
      })
    },

    // fonction pour modifier un contact de la liste de contacts
    'editContactData': function(selectedContact, editNomContactVar, editEmailContactVar){
      var currentUserId = Meteor.userId();
      contactsList.update({
        _id: selectedContact,
        createdBy: currentUserId},
        {name: editNomContactVar,
        email: editEmailContactVar
      });
    },

    // fonction pour supprimer un contact de la liste de contacts
    'removeContactData': function(contactId){
      var currentUserId = Meteor.userId();
      contactsList.remove({
        _id: contactId,
        createdBy: currentUserId
      })
    },

    // fonction pour séparer la date (YYYY-MM-DD) en champs séparés DD, MM et YYYY dans le document
    'sortDate':function(eventId, dateUnsorted){
      var currentUserId = Meteor.userId();
      evenementsEnCours.update({
        _id: eventId,
        createdBy: currentUserId},
        {$set: {day: dateUnsorted.slice(8),
        month: dateUnsorted.slice(5,7),
        year: dateUnsorted.slice(0,4)}
      })
    }
  });
}