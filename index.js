"use strict"

if(process.argv.length < 3) {
	console.log('Использование команд');
	console.log('node index вставить Фамилия Имя Отчество телефон');
	console.log('node index изменить ключ(_id, firstname, middlename, lastname, phone) Значение_Ключа изменяемое_поле(firstname, middlename, lastname, phone) Значение_изменяемого_поля');
	console.log('node index удалить ключ(_id, firstname, middlename, lastname, phone) Значение_Ключа');
	console.log('node index найти ключ(_id, firstname, middlename, lastname, phone) Значение_Ключа');
	process.exit(0);
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/phonebookDB";

// Connect to the db
MongoClient.connect(url, function(err, db) {
	if(err) {
		console.log( "Невозможно подключиться к серверу mongoDB, ошибка " + err );
	}
	else {
		console.log( "Соединение установлено." );
	}
	
	// Get the collection of entries
	var collection = db.collection('entries');
	
	if(process.argv[2] == 'вставить')
	{
		var user1 = {firstname: process.argv[3], middlename: process.argv[4], lastname: process.argv[5], phone: process.argv[6]};
		collection.insert([user1], function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log('Вставлено %d документов в коллекцию "entries". Вставленные документы перечислены с идентификаторами "_id":', result.result.n, result);
			}
		});
	}
	else if(process.argv[2] == 'изменить')
	{
		collection.update(
			{[process.argv[3]]: process.argv[4]}, {$set: {[process.argv[5]]: process.argv[6]}}, function (err, numUpdated) {
				if (err) {
					console.log(err);
				} else if(numUpdated){
					console.log('Успешно обновлено %d документов.', numUpdated.result.n);
				}
				else {
					console.log( "Нет документов с данным условием поиска." );
				}
		});
	}
	else if(process.argv[2] == 'удалить')
	{
		collection.remove({[process.argv[3]]: process.argv[4]}, {safe: true}, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(result);
        });
	}
	else if(process.argv[2] == 'найти')
	{
		collection.find({[process.argv[3]]: process.argv[4]}).toArray(function(err, results) {
			if(err) {
				console.log( err );
			}
			else if(results.length){
				console.log( "Найденный:", results );
			}
			else {
				console.log( "Нет документов с данным условием поиска." );
			}
		});
	}

	//Close connection
	db.close();
});

