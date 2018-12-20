$(document).ready(function(){
  console.log('jQuery loaded');
  //
  // // write to local storage from input when button save clicked
  // $('.btn-submit').on('click', function(){
  //   localStorage.setItem('inputFieldValue', $('.text-entry').val());
  //   var myItemInStorage = localStorage.getItem('inputFieldValue');
  //   console.log('myItemInStorage', myItemInStorage);
  //
  //   // display the value here
  //   $('.list-display-field').text(myItemInStorage); // ??
  //
  // });
  //
  // // delete from local storage when delete button clicked
  // $('.btn-delete').on('click', function(){
  //   localStorage.removeItem('inputFieldValue');
  // });

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

    console.log('clicked');

    var orderItems = [];
    var textInput = $('textarea').val();

    $('#order-form input:checked').each(function () {
      var inputVal = $(this).val(); // input value
      var inputName = $(this).attr('item-name'); //custom attribute of item name
      orderItems.push([inputVal,inputName]); //push input value and name of item as array
      // console.log(inputVal);

      // this is for user to see there order before final submit
      $('#order-list').append('<p>' + inputName +'</p>');
    });

    // add key with object to local storage after final confirmation button clicked
    console.log(orderItems, textInput);

    $('#confirm-order').on('click',function (el) {
      var orderName = $('#order-name').val();
      addOrderLocalStorage(orderName, orderItems, textInput);

      // after added order to local storage reset form
      $("#order-form")[0].reset();
      $("#order-form-name")[0].reset();
    });


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
    var orderObj = { name : name, order: orderItems, notes:notesComments, inWorks:false }; //key will hold order details
    localStorage.setItem(orderNumber, JSON.stringify(orderObj)); // set oder with key and obj that is stringify-ed
  };


});