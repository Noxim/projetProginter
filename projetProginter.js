
itemList = new Mongo.Collection('items');
archives = new Mongo.Collection('archives');
evenementsEnCours = new Mongo.Collection('event');

if (Meteor.isClient) {

 // Meteor.subscribe('theItems');
//helpers
  Template.pageAccueil.helpers({

  });
  Template.profil.helpers({
    
  });
  Template.formulaire.helpers({
    
  });
  Template.evenement.helpers({
    
  });

  Template.formulaireChargeur.helpers({
    'archives' : function (){
      var currentUserId = Meteor.userId();
      return archives.find({createdBy: currentUserId}, { sort : {date : 1} });
    },
    'selectedClass': function(){
        var archiveId = this._id;
        var selectedArchive = Session.get('selectedArchive');
        if(archiveId == selectedArchive){
            return "selected";
        }
    }
  })
  Template.formulaireCalendrier.helpers({

  });

  Template.formulaireListe.helpers({
    'items' : function (){
      var currentUserId = Meteor.userId();
      return itemList.find({createdBy: currentUserId}, { sort : {name : 1} });
    },
    'selectedClass': function(){
      var itemId = this._id;
        var selectedItem = Session.get('selectedItem');
        if(itemId == selectedItem){
            return "selected";
        }
    }
  })
 

//events
  Template.pageAccueil.events({

  });
  Template.profil.events({
    
  });
  Template.formulaire.events({
    
  });
  Template.evenement.events({
    
  });
  Template.formulaireChargeur.events({
    'click .archive' : function (){
      var archiveId = this._id;
      Session.set('selectedArchive',archiveId);
    },
    'click .chargeur' :  function(){
      var archiveVar = Session.get('selectedArchive')
      Meteor.call('loadArchiveData', archiveVar);
      Meteor.call('insertArchivedItem', archiveVar)
    },
    'click .remove' : function(){
      var selectedArchive = Session.get('selectedArchive');
        Meteor.call("removeArchive", selectedArchive);
      },
  });
  Template.formulaireCalendrier.events({
      'click .eventCreator' : function(){
        var currentUserId = Meteor.userId();
        if(currentUserId){
          Meteor.call('createEventData');
        }
      }      
  });
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

  });
  Template.formulaireBlocTexte.events({
    'click .eventValid' : function(){
      var messageValue=document.getElementById("blocTexte").value;
      var date = Session.get('selectedDay');
      Meteor.call("createEventData", messageValue, date);
    },
    'click .eventSave' : function(){
      var messageValue=document.getElementById("blocTexte").value;
      var date = Session.get('selectedDay');
      Meteor.call("archiveEventData", messageValue, date);
    }

  })
}


if (Meteor.isServer) {
 // Meteor.publish('theItems', function(){ cette fonction de publication doit être mise en place seulement après avoir ôté autopublish des packages, merci :)
 //    var currentUser = this.userId
 //    return items.find({createdBy: currentUser})
 //  }); 
}
//methodes
Meteor.methods({
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
    'removeItem': function(selectedItem){
      check(selectedItem, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        itemList.remove({_id: selectedItem, createdBy: currentUserId});
      }
      
    },
    'removeArchive': function(selectedArchive){
      check(selectedArchive, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        archives.remove({_id: selectedArchive, createdBy: currentUserId});
      }
      
    },
    'createEventData': function(messageValue, date){
      check(messageValue, String);
      var currentUserId = Meteor.userId();
        if(currentUserId && date){
          evenementsEnCours.insert({
            date: date,
            createdBy: currentUserId,
            objets: itemList.find({createdBy:currentUserId}).fetch(),
            message: messageValue
          })
         // alert("Validé");
          Meteor.call('removeAllItem')
        }else{
          //alert("!! Données incorrectes !! Verifiez que vous avez bien séléctionné une date!")
        }
      },
      'archiveEventData': function (messageValue, date){
      check(messageValue, String);
      var currentUserId = Meteor.userId();
        if(currentUserId && date){
         archives.insert({
            date: date,
            createdBy: currentUserId,
            objets: itemList.find({createdBy:currentUserId}).fetch(),
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
          itemList.update({ _id: selectedItem, createdBy: currentUserId},
                   {$set: {quantity: itemNumberVar} })
       }
      },
      'removeAllItem': function(){ //cette methode semble ne pas fonctionner correctement. J'ai pas trouvé de moyen (même barbare) pour effacer toute les données de la liste sans effacer la liste elle-même
        var currentUserId = Meteor.userId();
        if(currentUserId){
          itemList.remove({});
        }
      },
      'insertArchivedItem': function(archiveId){
        var savedArchive = archives.findOne({_id : archiveId})
        var savedArchiveItems = savedArchive.objets
         for(var i = 0; i < savedArchiveItems.length; i++){
            Meteor.call('insertItemData', savedArchiveItems[i].name, savedArchiveItems[i].quantity, savedArchiveItems[i].createdBy)
          }
      },

      'loadArchiveData': function(archiveId){//fonction qui extrait les données des archives et les charge dans la page courante
        var currentUserId = Meteor.userId();
        var savedArchive = archives.findOne({_id : archiveId})

        if(currentUserId){
          Session.set('selectedDay', savedArchive.date);
          alert(Session.get('selectedDay'))
          document.getElementById('blocTexte').value = savedArchive.message;  
        }
        //Meteor.call('insertArchivedItem', savedArchiveItems)
      }
    
});

