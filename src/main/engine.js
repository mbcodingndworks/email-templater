const sqlite = require( 'node:sqlite' );
const path = require('path');
const { app } = require('electron');

const pathToDatabase = path.join(app.getPath('userData'), 'database.db');
let database = undefined;
const initDatabase = `
CREATE TABLE IF NOT EXISTS "TEMPLATE" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"NAME"	TEXT NOT NULL,
	"HTML_BASE64_CONTENT"	TEXT,
	"DATE"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "VARIABLES" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"ID_TEMPLATE"	INTEGER NOT NULL,
	"KEY"	TEXT NOT NULL,
	"VALUE"	TEXT NOT NULL,
	"IS_HTML" INTEGER NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "SETTINGS" (
	
	"KEY"	TEXT NOT NULL UNIQUE,
	"VALUE"	TEXT NOT NULL,
	PRIMARY KEY("KEY")
);

INSERT OR IGNORE INTO "SETTINGS" ("KEY", "VALUE") VALUES
	('debugMode', 'false'),
	('ApplicationWindowHeight', '800'),
	('ApplicationWindowWidth', '1200'),
	('regexVariable', '\\[\\{.*?\\}\\]'),
	('DefaultHtmlTemplate', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Default Template</title>
</head>
<body>
    <h1>Welcome to the Default Template</h1>
    <p>This is a sample template. You can customize it as needed.</p>
</body>
</html>');
`;


try{
	database = new sqlite.DatabaseSync(pathToDatabase);
    database.exec(initDatabase);
}catch(e){
	console.error("Error initializing database:", e);
}

const CloseDatabase = () => {
	if (database) {
		database.close();
		database = undefined;
	}}

module.exports = {  database,pathToDatabase,initDatabase,CloseDatabase };