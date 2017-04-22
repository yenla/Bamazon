var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "skye8170803",
  database: "Bamazon_DB"
});


function quantityDisplay(cb){
	connection.query("SELECT * FROM products", function(err, res){
			console.log('ID  |  Item ID  |  Product Name  |  Dept Name  |  Price  |  Stock Quantity' )
			console.log('\r');
		for (var i = 0; i < res.length; i++){
			console.log(res[i].id + "   " + res[i].item_id + "   " + res[i].product_name + "   " + res[i].department_name + "   " + res[i].price + "   " + res[i].stock_quantity);
			console.log('\r');
		}
		if (cb){
			cb();		
		}
	});	
}

// var runSearch = function() {
// 	inquirer.prompt({
// 		name: "action",
// 		type: "list",
// 		message: "Please choose one of the following options",
// 		choices: ["Purchase A Product"]
// 	}).then(function(answer){

// 		switch(answer.action) {
// 			case "Purchase A Product":
// 			buyProduct();
// 			break;
// 		}
// 	});
// };

var buyProduct = function() {
	inquirer.prompt([{
		name: "itemID",
		type: "input",
		message: "Enter An Item Number you would like to purchase."
	}, {
			name: "quantity",
			type: "input",
			message:"Enter the quantity you would like to purchase."
		}]).then(function(answer){
		// console.log(answer.itemID);
			connection.query("SELECT * FROM products WHERE item_id=?", [answer.itemID],function(err, res) {
			// console.log(res);
			console.log("Item ID: " + res[0].item_id);
			console.log("");
			console.log("Product Name: " + res[0].product_name);
			console.log("");
			console.log("Department Name: " + res[0].department_name);
			console.log("");
			console.log("Price: " + res[0].price);
			console.log("");



			var item = res[0].item_id;
			var quantity = res[0].stock_quantity;
			var chosenQuantity = answer.quantity;
			// console.log("Item ID: " + res[0].item_id + " || Product Name: " + res[0].product_name + " || Department Name: " + res[0].department_name + " || Price: " + res[0].price);
			// quantitySearch();
			// runSearch();
			// confirm();

			if(chosenQuantity < quantity) {
				console.log("Your total for " + "(" + "Quantity of: " + chosenQuantity + ")" + " is " + res[0].price.toFixed(2) * chosenQuantity);
				console.log("");
				// UPDATE products SET stock_quantity TO (quantity - parseInt(chosenQuantity) WHERE ID = item

				connection.query("UPDATE products SET ? WHERE ?", [{
					stock_quantity: quantity - parseInt(chosenQuantity)
				}, {
					item_id: item
				}], function(err, results, fields){
					connection.query('SELECT * FROM products WHERE item_id=' + answer.itemID, function(errUpdated, resUpdated){
						console.log('You now have ' + resUpdated[0].stock_quantity + ' ' + resUpdated[0].product_name + '.');
						console.log("");
						quitBuy();
					});
					// buyProduct();
				});
			} else {
				console.log("I'm sorry, insufficient quantity. Our current stock quanity is " + quantity);
				buyProduct();
			}
		});
	});
};


function quitBuy(file){
	inquirer.prompt([{
		// type: 'confirm',
		type:'list',
		name: 'quitBuy',
		message: 'Would you like to make another purchase? (yes/no)',
		choices: ['yes', 'no']
	}]).then(function(answers){
		if (answers.quitBuy === 'yes') {
			buyProduct();
		} else {
			console.log('Thank you for your purchase!!!');
		}
	});
}

quantityDisplay(buyProduct);


