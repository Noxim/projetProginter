
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

  Template.formulaireCalendrier.helpers({

  });

  Template.formulaireListe.helpers({
    'Item' : function (){
      var currentUserId = Meteor.userId();
      return items.find({createdBy: currentUserId}, {sort: {name : 1}});
    },
    'selectedClass': function(){
      var itemId = this._id;
        var selectedItem = Session.get('selectedItem');
        if(itemId == selectedItem){
            return "selected";
        }
    },
    'showSelectedPlayer': function(){
      var selectedItem = Session.get('selectedItem');
      return items.findOne(selectedItem);
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
  Template.formulaireCalendrier.events({
      'click .renderer' : function(){
          alert(Session.get('selectedDay'));
        }
  });
  Template.formulaireListe.events({
    'click .item' : function (){
      var playerId = this._id;
      Session.set('selectedPlayer',playerId);
    },
    'click .remove' : function(){
      var selectedPlayer = Session.get('selectedItem');
        Meteor.call("removeItem", selectedItem);
      },
    'submit form': function(){
      event.preventDefault();
      var itemNameVar = event.target.itemName.value;
      Meteor.call('insertItemData', itemNameVar);
      document.getElementById('champNom').value='';
    }

  })
}


if (Meteor.isServer) {
 // Meteor.publish('theItems', function(){
 //    var currentUser = this.userId
 //    return items.find({createdBy: currentUser})
 //  }); 
}
//methodes
Meteor.methods({
'insertItemData': function(playerNameVar){
      check(playerNameVar, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        playersList.insert({
          name: playerNameVar,
                score: 0,
                createdBy: currentUserId
        })
      }
    },
    'removeItem': function(selectedPlayer){
      check(selectedPlayer, String);
      var currentUserId = Meteor.userId();
      if(currentUserId){
        playersList.remove({_id: selectedPlayer, createdBy: currentUserId});
      }
      
    }
});