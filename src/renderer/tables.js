window.App = window.App || {};

window.App.tables = {
    SetupTableVariables: function (options) {
        const { onEdit, onDelete } = options;

        const table = new Tabulator("#table-variabili", {
            layout: "fitColumns",
            placeholder: "Nessuna variabile nel template corrente.",
            addRowPos: "bottom",
            columns: [
                { title: "ID", field: "ID", sorter: "number", visible: false },
                { title: "Variabile", field: "KEY", editor: window.App.tables.keyEditor },
                { title: "Valore", field: "VALUE", editor: window.App.tables.inputEditor },
                { title: "Html", field: "IS_HTML", hozAlign: "center", formatter: "tickCross", headerSort: false, editor: window.App.tables.checkboxEditor },
                { title: "Azione", field: "Azione", hozAlign: "center", formatter: window.App.tables.btnElimina }
            ]
        });

        table.on("cellEdited", async function (cell) {
            const row = cell.getRow().getData();
            try {
                await onEdit(row);
            } catch (err) {
                MessaggioErrore(err);
            }
        });

        table.on("rowDeleted", async function (row) {
            try {
                await onDelete(row.getData());
            } catch (err) {
                MessaggioErrore(err);
            }
        });

        return table;
    },

    keyEditor: function (cell, onRendered, success, cancel) {
        //cell - the cell component for the editable cell
        //onRendered - function to call when the editor has been rendered
        //success - function to call to pass thesuccessfully updated value to Tabulator
        //cancel - function to call to abort the edit and return to a normal cell

        //create and style input

        var input = document.createElement("input");

        input.setAttribute("type", "text");

        input.style.padding = "4px";
        input.style.width = "100%";
        input.style.boxSizing = "border-box";


        input.value = cell.getValue()

        onRendered(function () {
            input.focus();
            input.style.height = "100%";
        });



        function onChange() {
            if (input.value != cell.getValue() && !window.App.domUtils.StringIsNullOrEmpty(input.value) && window.App.domUtils.KeyVariableIsOk(input.value)) {
                success(input.value);
            } else {
                cancel();
            }
        }

        //submit new value on blur or change
        input.addEventListener("blur", onChange);

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                onChange();
            }

            if (e.keyCode == 27) {
                cancel();
            }
        });

        return input;
    },

    inputEditor: function (cell, onRendered, success, cancel) {
        //cell - the cell component for the editable cell
        //onRendered - function to call when the editor has been rendered
        //success - function to call to pass thesuccessfully updated value to Tabulator
        //cancel - function to call to abort the edit and return to a normal cell

        //create and style input

        var input = document.createElement("input");

        input.setAttribute("type", "text");

        input.style.padding = "4px";
        input.style.width = "100%";
        input.style.boxSizing = "border-box";


        input.value = cell.getValue()

        onRendered(function () {
            input.focus();
            input.style.height = "100%";
        });

        function onChange() {
            if (input.value != cell.getValue() && !window.App.domUtils.StringIsNullOrEmpty(input.value)) {
                success(input.value);
            } else {
                cancel();
            }
        }

        //submit new value on blur or change
        input.addEventListener("blur", onChange);

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                onChange();
            }

            if (e.keyCode == 27) {
                cancel();
            }
        });

        return input;
    },
    checkboxEditor: function (cell, onRendered, success, cancel) {
        //cell - the cell component for the editable cell
        //onRendered - function to call when the editor has been rendered
        //success - function to call to pass thesuccessfully updated value to Tabulator
        //cancel - function to call to abort the edit and return to a normal cell

        //create and style input


        var input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.classList = "form-check";
        input.id = "chkisHtmlTablVar" + cell.getData().ID;
        input.style.height = "max-content";
        input.style.width = "max-content";
        // var l = document.createElement('label');
        // l.classList = 'btn';
        // l.setAttribute('for',input.id);
        // l.innerText = "HTML";


        var d = document.createElement('div');
        d.classList = "d-flex justify-content-center";
        d.appendChild(input);
        //  d.appendChild(l);


        var vl = cell.getValue();
        if (vl == 0) input.checked = false;
        else input.checked = true;
        var old_value = input.checked;

        onRendered(function () {
            input.focus();
            // input.style.height = "100%";
        });

        function onChange() {
            if (input.checked != old_value) {
                success(input.checked ? 1 : 0);
            } else {
                cancel();
            }
        }

        //submit new value on blur or change
        input.addEventListener("blur", onChange);

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                onChange();
            }

            if (e.keyCode == 27) {
                cancel();
            }
        });

        // console.log(d);

        return d;
    },
    btnElimina: function (cell, formatterParams, onRendered) {
        var values = cell.getValue();
        var id_var = cell.getData().ID;
        var content = document.createElement("a");
        content.innerHTML = '<i class="bi bi-x-circle"></i>';
        content.classList = "btn btn-danger";
        content.addEventListener('click', () => RemoveVariable(id_var));


        return content;
    }
}