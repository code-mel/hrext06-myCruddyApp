$(document).ready(function(){
  console.log('jQuery loaded');

/*
* Notes:
* 1. Database :
*   - Order number will be key values
*   - value will be an object of order info like : {name:---,order:[],inworks:false}
* 2. click function for:
*   - editing status of order
*
* */

  //click function that will gather all input values and add it
  $('#order-submit').on('click',function () {

   //console.log('clicked');

    var orderItems = [];
    var textInput = $('textarea').val();
    var orderPreview = $('#order-list').html('');
    $('#order-form input:checked').each(function () {
      var inputVal = $(this).val(); // input value
      var inputName = $(this).attr('item-name'); //custom attribute of item name
      orderItems.push([inputVal,inputName]); //push input value and name of item as array
      // console.log(inputVal);

      // this is for user to see there order before final submit
      $(orderPreview).append('<p>-*' + inputName +'</p>');
    });
    $(orderPreview).append('<div class=\"note\"><h3>'+ textInput +'</h3></div>');


  // This is for displaying and hiding popup of order
    $( ".confirmation-container" ).show();
  });

  //clicker function for exiting popup
  $('#exit-edit').on('click',function () {
    $(".confirmation-container").hide();
  });

  // add key with object to local storage after final confirmation button clicked
  $('#confirm-order').on('click',function () {

    var orderItems = [];
    var textInput = $('textarea').val();
    $('#order-form input:checked').each(function () {
      var inputVal = $(this).val(); // input value
      var inputName = $(this).attr('item-name'); //custom attribute of item name
      orderItems.push([inputVal,inputName]); //push input value and name of item as array
      // console.log(inputVal);
    });

    console.log('this fucken ran')
    var orderName = $('#order-name').val();
    addOrderLocalStorage(orderName, orderItems, textInput);

    // after added order to local storage reset form
    $("#order-form")[0].reset();
    $("#order-form-name")[0].reset();
  });

  // Helper function to create an order number/unique key
  var generatedOrderNum = function () {

    if(localStorage.length === 0){
      return 'order-1';
    }else{
      //get the last key item
      var keysOfLocalObj = Object.keys(localStorage); //array of all keys
      var lastOrderKey = keysOfLocalObj[keysOfLocalObj.length -1]; // last key
      var splitKey = lastOrderKey.split('-'); //split string to get to number
      var newKey = Number(splitKey[1]) + 1; // add +1

      return ('order-').concat(newKey.toString()); //return new orderNum
    }

  };
  //function that adds new order to local storage
  var addOrderLocalStorage = function (name,orderItems,notesComments) {

    var orderNumber = generatedOrderNum(); // this will generate unique key for each order
    var orderObj = {
      name : name,
      order: orderItems,
      notes:notesComments,
      inWorks:false,
      finished:false
    }; //key will hold order details
    localStorage.setItem(orderNumber, JSON.stringify(orderObj)); // set oder with key and obj that is stringify-ed
  };


//////--------Functions to display order on order.html----------////////////
  /*
  * Notes :
  * - In order.html cards of each order and its formation will be displayed.
  *   - card has a start and delete button for it to change status of the order or delete it
  * */

/*
*Card for each order :
  <div class="card" order-key="Order#">
      <!--info regarding hole order-->
    <p>-item one</p>
    <p>-item two</p>
    <p>-item three</p>
    <button class="btn" id="start-order">Start Order</button>
    <button class="btn" id="delete-order">Cancel Order</button>
  </div>
*/
var displayOrders = function () {
  //iterate through local storage and append each item to to proper container
  var storageKey = Object.keys(localStorage); // array of keys

  //All new orders to append to and update properly
  var newOrderContainer = $('#orders .order-list').html('');
  var inWorksContainer = $('#in-works .order-list').html('');
  var finishedContainer = $('#finished .order-list').html('');

  storageKey.forEach(function (key) {
    const currentObj = JSON.parse(localStorage.getItem(key));
    var itemName = currentObj.name; // name
    var itemNotes = currentObj.notes; // order notes
    var itemOrderArr = currentObj.order; // order array
    var itemStats = currentObj.inWorks; // status boolean value
    var finishStats = currentObj.finished;

    //console.log(key,itemOrderArr, itemStats);

    // set array of items to one big string with p tags wrap for each item so can be added to order card(line:146/153)
    var orderList = function (orderArr,noteComment) {
      var orderString = '';
      //console.log(orderArr);
      orderArr.forEach(function (item) {
        // wrap each item with p tag
        orderString+= '<p>'+ item[1] +'<p> \n';
      });
      //console.log(orderString);
      return orderString.concat('<div class="note">'+ noteComment +'</div>');
    };

    // if order inWorks is false
    if(!itemStats && !finishStats){
      $(newOrderContainer).append('<div class="card">\n' +
        '<h2>'+ key +' : '+ itemName +'</h2>\n'+
        orderList(itemOrderArr,itemNotes) + //add items from orderList function
        '<button class="btn start-order"  order-key="'+ key +'">Start Order</button>\n' +
        '<button class="btn delete-order"  order-key=\"' + key +'\">Cancel Order</button>\n' +
        '</div>');
    }else if(itemStats && !finishStats){ // for true append will have different buttons
      $(inWorksContainer).append('<div class="card">\n' +
        '<h2>'+ key +' For '+ itemName +'</h2>\n'+
        orderList(itemOrderArr,itemNotes) + //add items from orderList function
        '<button class="btn finished-order" order-key=\"' + key +'\">Ready</button>\n' +
        '<button class="btn delete-order" order-key=\"'+ key +'\">Cancel Order</button>\n' +
        '</div>');
    }else{ //first check if finished is set to true
      $(finishedContainer).append('<div class="card finished-card">\n' +
        '<h2>'+ key +' : '+ itemName +'</h2>\n'+
        orderList(itemOrderArr,itemNotes) + //add items from orderList function
        '</div>')
    };

  });
  // click function for order to change inWorks value
  $('.start-order').on('click',function () {
    //console.log('I was clicked');
    var keyOfCard = $(this).attr('order-key'); // gets key from attrabute
    var orderObj = JSON.parse(localStorage.getItem(keyOfCard)); // get item and change value back to object
    // change the inWorks to true and run displayOrders function for display update
    orderObj.inWorks = true; // change value of inWorks
    localStorage.setItem(keyOfCard,JSON.stringify(orderObj)); // upDate localStorage
    displayOrders(); // run whole function for display update
  });
  //click function for canceling/deleting order
  $('.delete-order').on('click', function () {
    console.log('delete button clicked');
    var keyOfCard = $(this).attr('order-key');
    localStorage.removeItem(keyOfCard); //remove item from local storage
    displayOrders(); //update the DOM
  });
  //click function for order to change finished value
  $('.finished-order').on('click', function () {
    var keyOfCard = $(this).attr('order-key'); // gets key from attrabute
    var orderObj = JSON.parse(localStorage.getItem(keyOfCard)); // get item and change value back to object
    // change the finished to true and run displayOrders function for display update
    orderObj.inWorks = false;
    orderObj.finished = true; // change value of inWorks
    localStorage.setItem(keyOfCard,JSON.stringify(orderObj)); // upDate localStorage
    displayOrders(); // run whole function for display update
  });
};

  displayOrders(); // Run on ready
//  This click function is for end of day clearing of orders
  $('#clear-all').on('click', function () {
    localStorage.clear(); // clear local storage
    displayOrders(); //update DOM
  });
});