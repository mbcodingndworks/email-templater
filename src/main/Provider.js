const { database,pathToDatabase,initDatabase, CloseDatabase } = require('./engine.js');
const fs = require('fs');
const sqlite = require( 'node:sqlite' );


async function GetDatabasePath() {
    return new Promise((resolve, reject) => {
        try { resolve(pathToDatabase); } catch (err) { reject(err); }
    });
}

async function ResetDatabase() {
    return new Promise((resolve, reject) => {
        try { database.exec('DROP TABLE IF EXISTS "TEMPLATE";'); database.exec('DROP TABLE IF EXISTS "VARIABLES";'); database.exec('DROP TABLE IF EXISTS "SETTINGS";'); database.exec(initDatabase); resolve(true); } catch (err) { reject(err); }
    });
}

async function exportDatabase(filePath) {
    return new Promise((resolve, reject) => {

        try {
            fs.copyFileSync(pathToDatabase, filePath);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

async function ImportDatabase(filePath) {

    return new Promise((resolve, reject) => {

        try {
            CloseDatabase();
            fs.copyFileSync(filePath, pathToDatabase);
            resolve(true);            
        } catch (err) {
            reject(err);
        }
    });
}

async function insertTemplate(obj) {

    return new Promise((resolve, reject) => {
        try {
            let values = [obj.NAME, obj.HTML_BASE64_CONTENT, obj.DATE];
            // let values = { name: obj.name, HTML_BASE64_CONTENT: obj.base64content, HTML_CONTENT:obj.content,DATE: obj.date };


            const sql = database.prepare('INSERT INTO TEMPLATE (NAME, HTML_BASE64_CONTENT,  DATE)  VALUES (?,?,?);');
            // const sql = database.prepare('INSERT INTO TEMPLATE VALUES (NULL,?,?,?,?);');
            let result = sql.run(values[0], values[1], values[2]);
            if (result && result.changes > 0) resolve(result.lastInsertRowid);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    })
}

async function UpdateTemplates(obj) {

    return new Promise((resolve, reject) => {
        try {
            let values = [obj.name, obj.date, obj.base64content, obj.id];
            // console.log(values);
            const sql = database.prepare(`UPDATE TEMPLATE SET NAME = ?, DATE = ?, HTML_BASE64_CONTENT = ? WHERE ID = ?`);
            let result = sql.run(values[0], values[1], values[2], values[3]);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

async function UpdateTemplateName(id, name) {
    return new Promise((resolve, reject) => {
        try {
            const sql = database.prepare(`UPDATE TEMPLATE SET NAME = ?, DATE = ? WHERE ID = ?`);
            let result = sql.run(name, Date.now(), id);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

async function UpdateTemplateContent(id, html) {
    return new Promise((resolve, reject) => {
        try {
            const sql = database.prepare(`UPDATE TEMPLATE SET HTML_BASE64_CONTENT = ?,  DATE = ? WHERE ID = ?`);
            let result = sql.run(html, Date.now(), id);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

async function DeleteTemplatesByID(id) {

    return new Promise((resolve, reject) => {
        try {
            let values = [id];
            // console.log(values);
            const sql = database.prepare(`DELETE FROM TEMPLATE WHERE ID = ?`);
            let result = sql.run(values[0]);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}


async function GetAllTemplatesNoContent() {

    return new Promise((resolve, reject) => {
        try {
            const sql = database.prepare(`SELECT ID,NAME,DATE FROM TEMPLATE ORDER BY ID`);
            let result = sql.all();
            if(result){
                let res = [];

                result.forEach((row) => {

                    let roww = [];
                    roww.push(row.ID);
                    roww.push(row.NAME);
                    roww.push(row.DATE);

                    res.push(roww);

                });

                var data_arr = [];
                for (var i = 0; i < res.length; i++) {

                    var obj = {};
                    obj.ID = res[i][0];
                    obj.NAME = res[i][1];
                    obj.DATE = res[i][2];
                    // obj.HTML_BASE64_CONTENT = result[i][3];
                    data_arr.push(obj);
                }
                resolve(data_arr);
            }
            resolve(undefined);
        } catch (err) {
            reject(err);
        }
    });
}


async function GetAllTemplates(id) {

        return new Promise((resolve, reject) => {
                try {
                    const sql = database.prepare(`SELECT ID,NAME,DATE,HTML_BASE64_CONTENT FROM TEMPLATE where ID = ?`);
                    let result = sql.get(id);
                    if(result){
                        var obj = {};
                        obj.ID = result.ID;
                        obj.NAME = result.NAME;
                        obj.HTML_BASE64_CONTENT = result.HTML_BASE64_CONTENT;
                        obj.DATE = result.DATE;
                        resolve([obj]);
                    }
                    resolve(undefined);
                } catch (err) {
                    reject(err);
                }
            });
}

async function GetTemplateByID(id) {

    return new Promise((resolve, reject) => {
                try {
                    const sql = database.prepare(`SELECT ID,NAME,DATE,HTML_BASE64_CONTENT FROM TEMPLATE where ID = ?`);
                    let result = sql.get(id);
                    if(result){
                        var obj = {};
                        obj.ID = result.ID;
                        obj.NAME = result.NAME;
                        obj.HTML_BASE64_CONTENT = result.HTML_BASE64_CONTENT;
                        obj.HTML_CONTENT = Buffer.from(result.HTML_BASE64_CONTENT, 'base64');
                        obj.DATE = result.DATE;
                        resolve([obj]);
                    }
                    resolve(undefined);
                } catch (err) {
                    reject(err);
                }
            });
}


async function insertVariables(obj) {

    return new Promise((resolve, reject) => {
        try {
            let values = [obj.ID_TEMPLATE, obj.KEY, obj.VALUE, obj.IS_HTML];
            // let values = { name: obj.name, HTML_BASE64_CONTENT: obj.base64content, HTML_CONTENT:obj.content,DATE: obj.date };


            const sql = database.prepare('INSERT INTO "VARIABLES" ("ID_TEMPLATE", "KEY", "VALUE", "IS_HTML")VALUES (?, ?, ?, ?)');
            // const sql = database.prepare('INSERT INTO TEMPLATE VALUES (NULL,?,?,?,?);');
            let result = sql.run(values[0], values[1], values[2],values[3]);
            if (result && result.changes > 0) resolve(result.lastInsertRowid);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    })
}

async function UpdateVariables(obj) {

    return new Promise((resolve, reject) => {
        try {
            let values = [ obj.KEY, obj.VALUE, obj.IS_HTML, obj.ID];
            // console.log(values);
            const sql = database.prepare(`UPDATE "VARIABLES" SET "KEY" = ?, "VALUE" = ?, "IS_HTML" = ? WHERE "ID" = ?`);
            let result = sql.run(values[0], values[1], values[2], values[3]);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}


async function DeleteVariablesByID(id) {

    return new Promise((resolve, reject) => {
        try {
            let values = [id];
            // console.log(values);
            const sql = database.prepare(`DELETE FROM "VARIABLES" WHERE "ID" = ?`);
            let result = sql.run(values[0]);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

async function GetVariablesByIDTemplate(id_template) {

    return new Promise((resolve, reject) => {
                try {
                    const sql = database.prepare(`SELECT "ID", "ID_TEMPLATE", "KEY", "VALUE", "IS_HTML" FROM "VARIABLES" WHERE "ID_TEMPLATE" = ? ORDER BY "ID" ASC`);
                    let result = sql.all(id_template);
                    if(result){
                        var data_arr = [];
                       for (var i = 0; i < result.length; i++) {

                            var obj = {};
                            obj.ID = result[i].ID;
                            obj.ID_TEMPLATE = result[i].ID_TEMPLATE;
                            obj.KEY = result[i].KEY;
                            obj.VALUE = result[i].VALUE;
                            obj.IS_HTML = result[i].IS_HTML;
                            data_arr.push(obj);
                       }
                        resolve(data_arr);
                    }
                    resolve(undefined);
                } catch (err) {
                    reject(err);
                }
            });
}


async function GetSettingByKey(key) {

    return new Promise((resolve, reject) => {
                try {
                    const sql = database.prepare(`SELECT  "KEY", "VALUE" FROM "SETTINGS" WHERE "KEY" = ?`);
                    let result = sql.get(key);
                    if(result){
                        // var obj = {};
                        // obj.ID = result.ID;
                        // obj.KEY = result.KEY;
                        // obj.VALUE = result.VALUE;
                        resolve(result.VALUE);
                    }
                    resolve(undefined);
                } catch (err) {
                    reject(err);
                }
            });
}

async function UpdateSettingByKey(key, value) {

    return new Promise((resolve, reject) => {
        try {
            const sql = database.prepare(`UPDATE "SETTINGS" SET "VALUE" = ? WHERE "KEY" = ?`);
            let result = sql.run(value, key);
            if (result && result.changes > 0) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
}

async function InsertSetting(key, value) {

    return new Promise((resolve, reject) => {
        try {
            // console.log(`Inserting setting: ${key} = ${value}`);
            const boundValue = typeof value === 'boolean' ? (value.toString()) : value;
            let values = [key, boundValue];
            const sql = database.prepare('INSERT OR REPLACE INTO "SETTINGS" ("KEY", "VALUE") VALUES (?, ?)');
            let result = sql.run(values[0], values[1] );
            if (result && result.changes > 0) resolve(result.lastInsertRowid);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    })
}

async function GetSetting(key) {

    return new Promise((resolve, reject) => {
        try {
            const sql = database.prepare(`SELECT "VALUE" FROM "SETTINGS" WHERE "KEY" = ?`);
            const result = sql.get(key);
            if (result != undefined) resolve(result);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    })
}


class AppSettings {
    // I valori di default sono inseriti dallo script SQL in engine.js (initDatabase)
    constructor() {
        this.Load();
    }

    Load() {
        for (const key of Object.keys(this)) delete this[key];
        const rows = database.prepare('SELECT "KEY", "VALUE" FROM "SETTINGS"').all();
        for (const row of rows) this.Set(row.KEY, row.VALUE);
    }


    Get(key) {
        return this[key];
    }

    Set(key, value) {
        this[key] = value;
    }

    Save() {
        for(var i = 0; i < Object.keys(this).length; i++) {
            try{ InsertSetting(Object.keys(this)[i], this[Object.keys(this)[i]]); } catch(err) { console.error(`Error saving setting "${Object.keys(this)[i]}":`, err); }
        }
    }
}

module.exports = {
    GetDatabasePath,
    exportDatabase,
    ImportDatabase,
    ResetDatabase,
    insertTemplate,
    UpdateTemplates,
    DeleteTemplatesByID,
    GetAllTemplates,
    GetAllTemplatesNoContent,
    GetTemplateByID,
    UpdateTemplateName,
    UpdateTemplateContent,
    GetVariablesByIDTemplate,
    DeleteVariablesByID,
    UpdateVariables,
    insertVariables,
    GetSettingByKey,
    UpdateSettingByKey,
    InsertSetting,
    AppSettings
}