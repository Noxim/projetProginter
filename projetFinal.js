/* PACKAGES USED
  accounts-ui
  accounts-password
  fullcalendatr:fullcalendar
*/

itemList = new Mongo.Collection('items');
inviteList = new Mongo.Collection('invites');
archives = new Mongo.Collection('archives');
evenementsEnCours = new Mongo.Collection('event');
contactsList = new Mongo.Collection('contacts');
participantList = new Mongo.Collection('participants');

if (Meteor.isClient) {
  Meteor.subscribe('theCurrentEvents');
  Meteor.subscribe('theArchives');
  Meteor.subscribe('theContacts');
  Meteor.subscribe('theItems');
  Meteor.subscribe('theInvites');
  Meteor.subscribe('theParticipants');

  Session.set('showingAccueil', 0);
  Session.set('showingProfile', 0);
  Session.set('showingFormulaire', 0);
  Session.set('showingEvenement', 1);

  Template.pageAccueil.helpers({
    'visibleAccueilPage': function(){
      var visibleAccueil = Session.get('showingAccueil');
      if (visibleAccueil % 2 == 0) {
        return "hidePage"
      } else{
        Session.set('showingProfile', 0);
        Session.set('showingFormulaire', 0);
        Session.set('showingEvenement', 0);
      }
    },

    // fonction pour changer la valeur du boutton "montrer/cacher le profil"
    'valueAccueilButton': function(){
      var visibleAccueil = Session.get('showingAccueil');
      if (visibleAccueil % 2 == 0) {
        return "Montrer l'accueil"
      } else {
        return "Cacher l'accueil"
      }
    }
  })

  Template.profil.helpers({
    // fonction pour afficher la liste des contacts, triés alphabétiquement
    'contactsProfil': function(){
      var currentUserId = Meteor.userId();
      return contactsList.find({}, {sort: {name: 1} });
    },
    // fonction pour afficher la liste des événements en cours, triés du plus ancien au plus récent, puis alphabétiquement
    'eventProfil': function(){
      var currentUserId = Meteor.userId();
      return evenementsEnCours.find({createdBy: currentUserId}, {sort: {date:1, name: 1}});
    },

    // fonction pour afficher la liste des événements archivés, triés du plus récent au plus ancien, puis alphabétiquement
    'archivesProfil': function(){
      var currentUserId = Meteor.userId();
      return archives.find({createdBy: currentUserId}, {sort: {date:1, name: 1}});
    },

    // fonction pour mettre en évidence le contact sélectionné pour la modification
    'selectedContactClass': function(){
      var contactId = this._id;
      var selectedContact = Session.get('selectedContact');
      if (contactId == selectedContact) {
        return "selectedContact"
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
      if (visibleProfile % 2 == 0) {
        return "hidePage"
      } else{
        Session.set('showingAccueil', 0);
        Session.set('showingFormulaire', 0);
        Session.set('showingEvenement', 0);
      }
    },

    // fonction pour changer la valeur du boutton "montrer/cacher le profil"
    'valueProfileButton': function(){
      var visibleProfile = Session.get('showingProfile');
      if (visibleProfile % 2 == 0) {
        return "Montrer le profil"
      } else {
        return "Cacher le profil"
      }
    },

    'visibleProfileUser': function(){
      var currentUserId = Meteor.userId();
      if (!currentUserId) {
        return "hidePage"
      }
    }
  })

  Template.formulaire.helpers({
    'visibleFormulairePage': function(){
      var visibleFormulaire = Session.get('showingFormulaire');
      if (visibleFormulaire % 2 == 0) {
        return "hidePage"
      } else{
        Session.set('showingAccueil', 0);
        Session.set('showingProfile', 0);
        Session.set('showingEvenement', 0);
      }
    },

    'valueFormulaireButton': function(){
      var visibleFormulaire = Session.get('showingFormulaire');
      if (visibleFormulaire % 2 == 0) {
        return "Montrer le formulaire"
      } else {
        return "Cacher le formulaire"
      }
    }
  })

  Template.formulaireChargeur.helpers({
    'archivesFormulaire' : function (){
      var currentUserId = Meteor.userId();
      return archives.find({createdBy: currentUserId}, { sort : {date : 1} });
    },
    'selectedArchiveClass': function(){
        var archiveId = this._id;
        var selectedArchive = Session.get('selectedArchive');
        if(archiveId == selectedArchive){
            return "selectedFormulaire";
        }
    }
  })

  Template.formulaireListe.helpers({
    'items' : function (){
      var currentUserId = Meteor.userId();
      return itemList.find({createdBy: currentUserId}, { sort : {name : 1} });
    },

    'selectedFormulaireClass': function(){
      var itemId = this._id;
        var selectedItem = Session.get('selectedItem');
        if(itemId == selectedItem){
            return "selectedFormulaire";
        }
    }
  })

  Template.formulaireInvite.helpers({
    'invites' : function (){
      var currentUserId = Meteor.userId();
      return inviteList.find({createdBy: currentUserId}, { sort : {name : 1} });
    },
    'selectedClass': function(){
      var inviteId = this._id;
        var selectedInvite = Session.get('selectedInvite');
        if(inviteId == selectedInvite){
            return "selectedFormulaire";
        }
    }
  })

  Template.evenement.helpers({
    'afficherNomEvenement': function(){
      var eventIdVar = Session.get('eventId');
      return evenementsEnCours.findOne(eventIdVar).name
    },

    'afficherDateEvenement': function(){
      var eventIdVar = Session.get('eventId');
      return evenementsEnCours.findOne(eventIdVar).date
    },

    'afficherObjets': function(){
      var eventIdVar = Session.get('eventId');
      Meteor.call('insertItemEvenement', eventIdVar);
      return itemList.find()
    },

    'afficherParticipants': function(){
      var eventIdVar = Session.get('eventId');
      return participantList.find({eventId:eventIdVar})
    },

    'compter' : function(){
      var eventIdVar = Session.get('eventId');
      var nombre = participantList.find({eventId:eventIdVar}).count();
      if (nombre>1){
        return nombre+" participants";
      } else {
        return nombre+" participant";
      }
    },



    'visibleEvenementPage': function(){
      var visibleEvenement = Session.get('showingEvenement');
      if (visibleEvenement % 2 == 0) {
        return "hidePage"
      } else{
        Session.set('showingAccueil', 0);
        Session.set('showingProfile', 0);
        Session.set('showingFormulaire', 0);
      }
    },

    'valueEvenementButton': function(){
      var visibleEvenement = Session.get('showingEvenement');
      if (visibleEvenement % 2 == 0) {
        return "Montrer l'événement"
      } else {
        return "Cacher l'événement"
      }
    }
  })

  Template.pageAccueil.events({
    'click .showAccueilPage':function(){
      Session.set('showingAccueil', Session.get('showingAccueil')+1);
    },

    'click .createEventFromAccueil': function(){
      Session.set('showingFormulaire', 1);
      Session.set('showingAccueil', 0);
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
    },

    // fonction lors du click sur "créer un événement"
    'click .createEventFromProfil': function(){
      Session.set('showingFormulaire', 1);
      Session.set('showingProfile', 0);
    },

    // fonction lors du click sur "aller sur la page de l'événement"
    'click .goEvent': function(){
      var eventIdFromProfile = this._id;
      Session.set('eventId', eventIdFromProfile);
      Session.set('showingEvenement', 1);
      Session.set('showingProfile', 0);
    },

    'click .goArchive': function(){
      Session.set('showingProfile',0);
      Session.set('showingFormulaire',1);
      var archiveVar = this._id;
      var dayVar = archives.findOne({_id: archiveVar}).date;     
      var currentUserId = Meteor.userId();
      var savedArchive = archives.findOne({_id : archiveVar})
 
      if(currentUserId){
        document.getElementById('blocTexte').value = savedArchive.message;  
        document.getElementById('eventNameId').value = savedArchive.name;
        Meteor.call('insertArchivedItem', archiveVar);
        Meteor.call('insertArchivedInvite', archiveVar);
        Session.set('selectedDay', dayVar);
      }
    }
  })

  Template.formulaire.events({
    'click .showFormulairePage':function(){
      Session.set('showingFormulaire', Session.get('showingFormulaire')+1);
    },

    'submit .nomFormulaireForm': function(){
      event.preventDefault();
      var eventNameVar = event.target.eventNameName.value;
      Session.set('eventNameSession', eventNameVar);
      alert(Session.get('eventNameSession'));
    }
  })

  Template.formulaireChargeur.events({
    'click .archive' : function (){
      var archiveId = this._id;
      Session.set('selectedArchive',archiveId);
    },

    'click .chargeur' :  function(){
      var archiveVar = Session.get('selectedArchive')
      var dayVar = archives.findOne({_id: archiveVar}).date;     
      var currentUserId = Meteor.userId();
      var savedArchive = archives.findOne({_id : archiveVar})
 
      if(currentUserId){
        document.getElementById('blocTexte').value = savedArchive.message;  
        document.getElementById('eventNameId').value = savedArchive.name;
        Meteor.call('insertArchivedItem', archiveVar);
        Meteor.call('insertArchivedInvite', archiveVar);
        Session.set('selectedDay', dayVar);
      }

    },
    
    'click .remove' : function(){
      var selectedArchive = Session.get('selectedArchive');
        Meteor.call("removeArchive", selectedArchive);
      },
  })

  Template.formulaireListe.events({
    'click .item' : function (){
      var itemId = this._id;
      Session.set('selectedItem',itemId);
    },
    'click .remove' : function(){
      var selectedItem = Session.get('selectedItem');
        Meteor.call("removeItem", selectedItem);
      },
    'submit .itemNameForm': function(){
      event.preventDefault();
      var currentUserId = Meteor.userId();
      var itemNameVar = event.target.itemName.value;
      Meteor.call('insertItemData', itemNameVar, 1, currentUserId);
      document.getElementById('champNom').value='';
    },

    'submit .itemNumberForm': function(){
      event.preventDefault();
      var selectedItem = Session.get('selectedItem');
      var itemNumberVar = event.target.itemNumber.value;
      Meteor.call('updateItemNumber', itemNumberVar, selectedItem);
    }

  })

  Template.formulaireInvite.events({
    'click .invite' : function (){
      var inviteId = this._id;
      Session.set('selectedInvite',inviteId);
    },
    'click .remove' : function(){
      var selectedInvite = Session.get('selectedInvite');
        Meteor.call("removeInvite", selectedInvite);
      },
    'submit .inviteNameForm': function(){
      event.preventDefault();
      var currentUserId = Meteor.userId();
      var inviteNameVar = event.target.inviteName.value;
      Meteor.call('insertInviteData', inviteNameVar, currentUserId);
      document.getElementById('champNomInvite').value='';
    }
  })

  Template.formulaireBlocTexte.events({
    'click .eventValid' : function(){
      var messageValue=document.getElementById("blocTexte").value;
      var date = Session.get('selectedDay');
      var name = Session.get('eventNameSession');
      if(confirm('Avez vous bien fini de concevoir votre événement?')){
        Meteor.call("createEventData", messageValue, date, name);
        Session.set('showingFormulaire',0);
        Session.set('showingEvenement', 1);
      }
    },

    'click .eventSave' : function(){
      var messageValue=document.getElementById("blocTexte").value;
      var date = Session.get('selectedDay');
      var name = Session.get('eventNameSession')
      Meteor.call("archiveEventData", messageValue, date, name);
    }

  })

  Template.evenement.events({
    'click .showEvenementPage':function(){
      Session.set('showingEvenement', Session.get('showingEvenement')+1);
    }
  })

  Template.evenementParticipant.events({
    'submit .participantsEvenementForm': function(){
      event.preventDefault();
      var nomParticipantVar = event.target.participantName.value;
      var eventIdVar = Session.get('eventId');
      Meteor.call('insertParticipantData', nomParticipantVar, eventIdVar);
      document.getElementById('participantNameField').value='';
    }
});
}

if (Meteor.isServer) {
  Meteor.publish('theCurrentEvents', function(){
    var currentUserId = this.userId;
    return evenementsEnCours.find({createdBy:currentUserId})
  });

  Meteor.publish('theArchives', function(){
    var currentUserId = this.userId;
    return archives.find({createdBy: currentUserId})
  });

  Meteor.publish('theContacts', function(){
    var currentUserId = this.userId;
    return contactsList.find({createdBy: currentUserId})
  });

  Meteor.publish('theItems', function(){
    var currentUserId = this.userId;
    return itemList.find({createdBy: currentUserId})
  });

  Meteor.publish('theInvites', function(){
    var currentUserId = this.userId;
    return inviteList.find({createdBy: currentUserId})
  });

  Meteor.publish('theParticipants', function(){
    return participantList.find()
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
      console.log(currentUserId);
      contactsList.update({
        _id: selectedContact,
        createdBy: currentUserId},
        {$set:{name: editNomContactVar,
        email: editEmailContactVar}
      })
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
    },

    'insertItemData': function(itemNameVar, quantityNo, userId){
        check(itemNameVar, String);
        var currentUserId = Meteor.userId();
        if(currentUserId){
          itemList.insert({
            name: itemNameVar,
            quantity: quantityNo,
            createdBy: userId
        })
      }
    },

    'insertInviteData': function(inviteNameVar, userId){
        check(inviteNameVar, String);
        var currentUserId = Meteor.userId();
        if(currentUserId){
          inviteList.insert({
            name: inviteNameVar,
            createdBy: userId
        })
      }
    },

    'removeItem': function(selectedItem){
      check(selectedItem, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        itemList.remove({
          _id: selectedItem,
          createdBy: currentUserId});
      }      
    },

    'removeInvite': function(selectedInvite){
      check(selectedInvite, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        inviteList.remove({
          _id: selectedInvite,
          createdBy: currentUserId});
      }    
    },

    'removeArchive': function(selectedArchive){
      check(selectedArchive, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        archives.remove({
          _id: selectedArchive,
          createdBy: currentUserId});
      }
    },

    'createEventData': function(messageValue, date, eventName){
      check(messageValue, String);
      var currentUserId = Meteor.userId();
        if(currentUserId && date){
          evenementsEnCours.insert({
            date: date,
            name: eventName,
            createdBy: currentUserId,
            objets: itemList.find({createdBy:currentUserId}).fetch(),
            invites: inviteList.find({createdBy:currentUserId}).fetch(),
            message: messageValue
          })
         // alert("Validé");
          Meteor.call('removeAllItems');
          Meteor.call('removeAllInvites');
        }else{
          //alert("!! Données incorrectes !! Verifiez que vous avez bien séléctionné une date!")
        }
      },

    'archiveEventData': function (messageValue, date, eventName){
      check(messageValue, String);
      var currentUserId = Meteor.userId();
        if(currentUserId && date && eventName){
         archives.insert({
            date: date,
            name: eventName,
            createdBy: currentUserId,
            objets: itemList.find({createdBy:currentUserId}).fetch(),
            invites: inviteList.find({createdBy:currentUserId}).fetch(),
            message: messageValue
          })
         // alert("Votre événement a bien été archivé.");
        }else{
         // alert("!! Données incorrectes !! Verifiez que vous avez bien séléectionné une date!")
        }
      },

      'updateItemNumber': function(itemNumberVar, selectedItem){
        var currentUserId = Meteor.userId();
        if(currentUserId && itemNumberVar){
          itemList.update({
            _id: selectedItem,
            createdBy: currentUserId},
            {$set: {quantity: itemNumberVar} })
       }
      },

      'removeAllItems': function(){
        var currentUserId = Meteor.userId();
        if(currentUserId){
          itemList.remove({});
        }
      },

      'removeAllInvites': function(){
        var currentUserId = Meteor.userId();
        if(currentUserId){
          inviteList.remove({});
        }
      },

      'insertArchivedItem': function(archiveId){
        var savedArchive = archives.findOne({_id : archiveId})
        var savedArchiveItems = savedArchive.objets
         for(var i = 0; i < savedArchiveItems.length; i++){
            Meteor.call('insertItemData', savedArchiveItems[i].name, savedArchiveItems[i].quantity, savedArchiveItems[i].createdBy)
          }
      },

      'insertArchivedInvite': function(archiveId){
        var savedArchive = archives.findOne({_id : archiveId});
        var savedArchiveInvite = savedArchive.invites;
         for(var i = 0; i < savedArchiveInvite.length; i++){
            Meteor.call('insertInviteData', savedArchiveInvite[i].name, savedArchiveInvite[i].createdBy)
          }
      },

      'sendMail':function(to, text){
        Email.send({
          to: to,
          from: userMail,
          subject: 'Invitation à un événement [ph]',
          text: text
        })
      },

      'insertParticipantData': function(nomParticipant, eventId){
        participantList.insert({
          name: nomParticipant,
          eventId: eventId
        })
      },

      'insertItemEvenement': function(eventId){
        var event = evenementsEnCours.findOne({_id : eventId})
        var eventItems = event.objets
        for(var i = 0; i < eventItems.length; i++){
          Meteor.call('insertItemEventData', eventItems[i].name, eventItems[i].quantity, eventItems[i].createdBy)
        }
      },

      'insertItemEventData': function(itemNameVar, quantityNo, userId){
        var currentUserId = Meteor.userId();
        if(currentUserId){
          itemList.insert({
            name: itemNameVar,
            quantity: quantityNo,
            createdBy: userId
        })
      }
    }
  });
}