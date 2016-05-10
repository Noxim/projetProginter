
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
      /*var currentUserId = Meteor.userId();*/
      return items.find(/*{createdBy: currentUserId}, sort : {name : 1} }*/);
    },
    'selectedClass': function(){
      var itemId = this._id;
        var selectedItem = Session.get('selectedItem');
        if(itemId == selectedItem){
            return "selected";
        }
    },
    'showSelectedItem': function(){
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
      var itemId = this._id;
      Session.set('selectedItem',itemId);
    },
    'click .remove' : function(){
      var selectedItem = Session.get('selectedItem');
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
 // Meteor.publish('theItems', function(){ cette fonction de publication doit être mise en place seulement après avoir ôté autopublish des packages, merci :)
 //    var currentUser = this.userId
 //    return items.find({createdBy: currentUser})
 //  }); 
}
//methodes
Meteor.methods({
'insertItemData': function(itemNameVar){
      check(itemNameVar, String);
      //var currentUserId = Meteor.userId();
      /*if(currentUserId){*/
        itemList.insert({
          name: itemNameVar/*,
          createdBy: currentUserId*/
        })
      /*}*/
    },
    'removeItem': function(selectedItem){
      check(selectedItem, String);
      //var currentUserId = Meteor.userId();
      /*if(currentUserId){*/
        itemList.remove({_id: selectedItem/*, createdBy: currentUserId*/});
      /*}*/
      
    }
});