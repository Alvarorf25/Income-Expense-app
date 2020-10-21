
// BUDGET CONTROLLER MODULE
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;                                                   //to store the percentage and as at the beginning it doesn't exist is equal to "-1"    
    };

    Expense.prototype.calcPercentage = function(totalIncome) {                  //to calculate the percentage of each expense we have and it is going to be inherit in all the expenses of the exp array so we always need the total income

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }        
    };

    Expense.prototype.getPercentage = function() {                              //A function that retrieve the percentages from the object and then returns it
        return this.percentage;                      
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {                                       //we make the function "calculateTotal" here to have it in private. If we make it in the public method "calculateBudget" then it will bepublic and we don't want that
        var sum = 0;
        data.allItems[type].forEach(function(cur) {                             //when we use forEach, it accepts a callback function that we did before (in clearField) and that function have access to a couple of parameters like we did before (current, index, array) as we know we can name them what we want. Here we are using just "current" that going to make reference to a current value (either for income or expenses)
           sum += cur.value;                                                    //sum = sum + cur.value;  here is .value becuase it was the name we give it in the function constructor for both income and expenses because of the "cur" parameter                                
        });

        data.totals[type] = sum;                                                //To store this information in the globa data structure
    };


    var data = {                                                                //a variable object that contains all the input (expenses and incomes) the user type instead of having variable arrays for exp, inc and total.inc, total.exp
        allItems: {
            exp: [], 
            inc: []
        },
        
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,                                                              //to store the result of calculateBudget in our global data structure
        percentage: -1                                                          //to store the percentage too but, using -1 because this is a value that it use to set something nonexistent
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //Have ID for a new item     (if at some poit we delete and item each one have to get an id(a number on the list either income or expenses) that is only exists once)
            // LOGIC: [1,2,3,4,5], next ID = 6
            //        [1,2,4,6,8], next ID = 9, so ID = last ID + 1

            
            // 1. Create a new ID
            if (data.allItems[type].length > 0) {
                //                            ID = last ID                  + 1  knowing that then:
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // 2. Create a new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // 3. Push the new item into our data structure
            data.allItems[type].push(newItem);                                    //after we added new item we can then add it to our data structure. Because the names in the "exp" and "inc" array are the same  input type now type represent either both "exp" or "inc"
            
            // 4. Return the new element
            return newItem;                                                       //now we have to return the new item as well because then the other module, or the other function that's going to call this one to have direct access to the item that the user just create 
        },

        deleteItem: function(type, id) {                                          //what parameter I need to pass into this function in order to know what is what I have to delete? Answ: type (if is "inc" or "exp") and the ID (the unic ID that each item either inc or exp going to have)
            var ids, index;

            //id = 6
            //data.allItems[type][id]; this works if the IDs would be in order but we have in this case an example like this:
            
            //index  0 1 2 3 4  exact position numbers the element in the array [1 2 4 6 8]   
            //ids = [1 2 4 6 8] (unic numbers that identify each element we have in the array)look at in this array it miss the numbers 0, 3, 5 and 7 so now in the position 0 of the array is the number 1. If I want to delete the number 6 it is not in the position number 6 so it is now in the position 3 so index = 3
            // For that reason we need to find a way to delete the item that we want based in the position of its ID it means the index 


            // 1. LOOP USING MAP method for looping into the array: the difference between ".map" and .forEach is that map returns a brand new array. It will return something and this will be stored in a new array. And "map" receives a callback function with actually has access to the current element, current index and the entire array but here we just use the current element 
            ids = data.allItems[type].map(function(current) {   
                return current.id;     //after this function return using the example before this going to return the exact array with the missing numbers ids = [1 2 4 6 8]
            });

            // 2. Find the index (exact position number of each element)
            index = ids.indexOf(id);                                             // The indexOf method returns the index number (the exact number position) of the element of our input (id) so the exact position of the element that we want to delete

            // 3. Delete the item from the array
            if (index !== -1) {                                                  //-1 doens't exist   in here we're going to use the method "splice" it removes something while the "slice" element is just to create a copy 
                data.allItems[type].splice(index, 1);                            //the second argument is the numbers of element that we want to delete
            }
        },

        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc'); 

            // Calcula the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {                                            //it is for solve the infinity problem when we don't have an income so 0 / an expense = gets a infinity
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); //Math.round to have an entiger part of the result

                //Expenses = 100 and income = 300, spent 33.333% = 100/300 = 0.3333% * 100
            } else {
                data.percentage = -1;
            }            
        },

        calculatePercentages: function() {                                       //A function that calls the "calcPercentage" for each element of the expenses array 

            /*
            How to calulate the precentages (a,b and c are expenses)
            a = 20             b = 10             c = 40             total income = 100
            a = 20/100 = 20%   b = 10/100 = 10%   c = 40/100 = 40% 
            */

            data.allItems.exp.forEach(function(cur) {                           //This gonna calculate the percentage for each and every expense that we have in our object
                cur.calcPercentage(data.totals.inc);                            //we call the method "calcPercentage" for each expenses we have in the exp array and passing the totals inc have at this point that is the value that we need to calculate the percenteges of all our expenses based in the total income exp/total.inc
            });
        },

        getPercentages: function() {                                            //calling the getPercentage method for each fo our objects
            var allPerc = data.allItems.exp.map(function(current) {             // here we want to loop over the array of all the expenses but in this case we use the "map" method becuase it return something and stores it in a variable while "forEach" method does not ("map" method return something an store it into a new array)
                return current.getPercentage();                                 //the callback function of the "map" method return somthing and what we return is what is stores in the "allPerc" variable, we just return the result of calling the current getPercetanges. So imaging we have 5 objects so this (return cur.getPercentages)  is going to call 5 times
            });
            return allPerc;                                                     //Then we return the allPerc variable that will containe the array with all of the percentages   
        },

        getBudget: function() {                                                 // A better way to return several variables is using objects
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };            
        },

        testing: function() {
            console.log(data);
        }
    };
})();





//UI CONTROLER MODULE
var UIController = (function() {

    //NOTE: In order to make our lifes easier in the case we want to change the names of the classes we don't want to change the strings in all our code just in one place. For that we store all of our classes in an object in this case "DOMstrings", son in case we want to change the names we change them in just one place
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    
    var formatNumber = function(num,type) {                                     //as income we are gonna have a "number" and the "type" to know if the number is an income or an expense. This is method to allow us to make some rules when we have at the UI numbers displaying: like 1). every number have to be 2 decimals even is the number is original an integer,  2). all the expenses have to be a minus sign (-) and the incomes a plus (+), and 3). if the number is in the thousands the we have a comma separator like (1,500.00)
        var numSplit, int, dec, type;             
            
        
        num = Math.abs(num);                                                    //"abs()" absolute simply removes the sign off a number

        // 1. exactly 2 decimal points (example: 2310.4567 ---> + 2,310.46)
        num = num.toFixed(2);                                                   // "toFixed" is not a method of the "Math" object such as "abs" method we use before but instead, this is a method of the number prototype. Here we gonna get a strin number with 2 decimals.

        // 2. comma separating the thousands
        numSplit = num.split('.');                                              //what we're doing here is to divide the number into two parts splitting from the point (integer part, decimal part) and it's going to be stored in an array

        int = numSplit[0];                                                      //first element of the array "integer"
        if (int.length > 3) {                                                   //a string the same as an array has access to the "lenght" property
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);  // "substring" method allows us to only take a part of a string. This method returns the part of the string that we want. the first argument is the start position of the string (index) and the second one is how many characters we want: at the number 2310 it returns the number 2 because is the number on the position 0 and we want just int.length - 3 that it would be 2  without 310 for example. 
            //if input is 2310 output will be 2,310
        }

        dec = numSplit[1];                                                      //second element of the array "decimal"

        // 3. + or - before number
        //  EXAMPLE:   (+   or   -)     (some space) 2,310 .  46    =  +/- 2,310.46
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; //return the sign + 'space' + integer part with the comma + decimal part
    };

   
    //THIS REUSABLE FUNCTION EXPRESION 
    var nodeListForEach = function(list, callback) {                             //is function is going to be a for loop that in each iteration is gonna call our callback function. forEach function not for array but for nodeList.
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);                                                //here we call our callback function with the parameters but below we have in the callback function the "current" and "index" and so we can simply pass them into our callback function(above) by writting them "current = list[i], and the "index = i"
        }
    };

    return {
        getInput: function() {    
            return {                                                              //Because the controller module call this method it wants to recieve back the value, so we have to return all these 3 values a to return them we have to become them in object. 
                type: document.querySelector(DOMstrings.inputType).value,         //Will be either inc or exp 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)    //parseFloat to conver a string into a number
            };            
        },

        addListItem: function(obj,type) {                                         //obj: point to the function constructor, type: if is income or expense
            var html, newHtml, element;
            // Create a HTML string with placeholder text 

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%">  <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);                               //what replace does is search for a string and replace that string with the data that we put into de method
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Insert the HTML into the DOM                       position, text
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {                                    //selectorID makes references to the entire ID = "itemID" Line 473 the one that we write from the DOM in the first place
            var el = document.getElementById(selectorID);                         //We use "getElementById" becuause selectorID that makes reference to the entire "itemID" that is in our app module is in fact an ID

            el.parentNode.removeChild(el);                                        //parentNode means point the parent of this child we want to remove (in case of an income is incomeContainer: '.income__list', and an expense expensesContainer: '.expenses__list') then we pass the ID we select again.
        },

        clearField: function() {    
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);    //querySelectorAll returns something weard (a list) it doesn't return an array to solve that we use "slice" what slice does is to return a copy of the array that is call on
            
            fieldsArr = Array.prototype.slice.call(fields);                       //"slice" method makes a copy of the array returning the selected elements in an array, as a new array object. SO because a prototype is a function we can call it with the "fields" variable as an argument. the Array.prototype is a function constructor for all arrays
        
            
            fieldsArr.forEach(function(current, index, array) {                   //The forEach() method calls a function once for each element in an array, in order. This anonimous function can receive up to 3 arguments so we have access to current: the current value of the array that actually is been in process, index: that is the index number that goes from 0 to the length of the array - 1, array: and also the entire array and we can name them what we want
                current.value = "";                                               //this means we set the input field (the current description and the current value) empty so that way when we enter an input then the text field will be empty 
            });
            
            fieldsArr[0].focus();                                                 //to set the focus go back to the description's field after we finish an input(typing the description and the value).
        },

        displayBudget: function(obj) {                                            //This "obj" point to the object "getBudget" because the variables that we have in it are the once we want to display
            var type;    

            obj.budget > 0 ? type = 'inc' : type = 'exp';  //TERNARY OPERATOR: is a resume of this: if obj.budget > 0 then type will be a 'inc' if not will be an 'exp'

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);       //in the displayBudget we add our "formatNumber" private method to get the settings of this method when we display our budget with our "obj.budget" and the "type" as input
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');    //here we know is an income because of that is 'inc'
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');  //here we know is an expense because of that is 'exp'
            

            if (obj.percentage > 0) {                                             //To don't get a -1 in the percentage in the expensesLabel when we first get an expenses
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {                               //This method is going to receive the percentage array that we stored in our app controller (allPerc) we just put "percentages" to define a word as an input in this method as we are doing with a couple of methods in this project 
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //Becuase  again we don't know how many expense items will be on the list, so we cannot use "querySelector", because that only selects the first one, so we need to use again "querySelectorAll" ("querySelectorAll" returns a nodeList a we have to convert it into an array using the slice method based on the array.prototype but we can do better creating our own forEach Function but for node lists instead of arrays)
                        
            //                list,        callback                               //this means that these 2 arguments have reference with the parameters of our "nodeListForEach"function above (list, callback)        
            nodeListForEach(fields, function(current, index) {                    //fields in this case is what we pass into the nodeListForEach function and the second argument is our callback. So the code that we write here will be executed as much as the amount of the lists elements we have

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';               //We want to change the content of our current element for the percentages for example at the first element we want the first percentage
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {                                               //Here we're going to use the dat object constructor in order to save the current date into new variable
            var now, months, month, year;

            now = new Date();                                                    //remember, with object constructors we have to use the "new" keyword and if we don't pass anything into the date constructor, then it will return the date of today. Other way is for example: var christmas = new Date(2016, 11(december is 11 because start in 0 based), 25)  
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();                                              //To get the actual month
            
            year = now.getFullYear();                                            //this object inherits a bunch of method from the Date prototype.  "getFullYear" method returns the actual year
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;      //month get the number of the actual month but on 0 based and associate this number with the name months of our months array

        },

        changedType: function() {                                                //This method is created to set the red color like the color's expense when we select to get an input expense in our 3 fields (select button + -, the description, and the value fields)

            var fieldsInput = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fieldsInput, function(cur) {
                cur.classList.toggle('red-focus');                               //remember what "toggle" does is basically add the focus class in this case when it's not there, and when it's there on some element, then it removes it. So eahc time when the type changes you want this class to change, and change in this case means that it's there or that it's not there
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red'); //to change the color of the check button when we input an expense
        },

        getDOMstrings: function() {                                             //The GLOBAL APP CONTROLLER module doesn't have access to the DOMstrings to add into it '.add__btn' that is another string so we create a function for that too to get public the DOMstrings to the GLOBAL CONTROLLER.
            return DOMstrings;
        }
    };

})();




//---------GLOBAL APP CONTROLLER--------- (This module will conect the others two module)
var controller = (function(budgetCtrl, UICtrl) {                                //This module has access to the other to so we pass the other to modules as arguments inside of this one

    var setupEventListeners = function() {                                      //To be organize the events we create a function to store all our event listeners
        var DOM = UICtrl.getDOMstrings();                                       //That means the variable DOM store what UICtrl has in the function getDOMstrings

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);    

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {                   //"which" is use for older browsers
                ctrlAddItem();
            }    
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); //set and eventListener to the "container" which is the first element that all income and expenses items have in common to make "Event Delegation"
    
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);   //set and change event video 99
    };  

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);                                          //pass the object "budget" that we have in step 2
    };

    var updatePercentages = function() {

        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);                               //here we pass the percentages stored in the variable above "percentages"

    };

    var ctrlAddItem = function() {                                            //Our custom function to don't repeat yourself ON HERE "document.querySelector('.add__btn').addEventListener('click', function()" AND HERE "if (event.keyCode === 13 || event.which === 13)"
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();                                            //Here we store the result of calling the function getInput contained into the UIController module.
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { //(this line of code is in the video 85) step 2 to 6 will happen if input.description is empty, if the value is not a Not(! = NOT operator) a Number(NaN) orinigally if it was NaN(Not a number) would be true but if we add a NOT OPERATOR(!) it will be NaN will be false soit means weara going to have a number on the field value(!isNaN(input.value)), and if input.value is greater than 0
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);    //because the variables we need are already stored in the var "input(var input = UICtrl.getInput();) we just use "input.type", "input.description" and "input.value"

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);                          //what I think is it is not gonna be store in a variable becuase the instructions to store the input data is already set. Here we just call the function with the newItem (what user types) and the type(to know if is an "inc" or an "exp").

            // 4. Clear the fields
            UICtrl.clearField();

            // 5. Calculate and update budget 
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
        }        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        //Event target that is where the event happen (where the event was fired)
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //in the HTML structure we move 4 times from the icon delete, then his parent the button delete and so on until the last one to allow us to delete the item from the list when we click the delete button and what is our interest is the ID
    
        if (itemID) { //I the ID is defined either to inc or exp then do this:

            //inc-1          What split does in this case is remove the - from the "inc-1" getting and array ("inc", "1")
            splitID = itemID.split('-');                                      //In Javascript all springs have access to some methods and "split" is one of them because we always said that string is a primitive and not an object. The thing is that as soon as we call one of these methods on a string the JS automatically puts a wrapper around the string a converts it from a primitive to an object and the this object has access to a lot of method, the same happen to numbers 
            type = splitID[0];                                                //to select the first element of the array "inc" or "exp"
            ID = parseInt(splitID[1]);                                        //to select the second element of the array. With these we can delete the item ID from both UI "inc" and "exp" and the data module, so the budget controller. "parseInt" to convert a string into a number integer

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);                                     //Remenber we have to pass the ID

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };
    
    return {                                                                  //This return is to run the function "setupEventListeners" and for that in this way  makes it public method becuase in our function above the function is private
        init: function() {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({                                            //Call our displayBudget in the init function with the object of the function "getBudget" set to 0         
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1                      
            });          
            setupEventListeners();
        }
    }

})(budgetController, UIController);                                            //here we uses the real names and inside of the function is a good practice to use different names to refer to the modules we want to conect through this. That's why the arguments are named different than when we call the function.

controller.init();                                                             //This will be the only line of code outside to execute the event listeners to show all of init function contains when the web page load