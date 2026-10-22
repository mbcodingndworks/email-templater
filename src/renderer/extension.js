
const KeyVariableIsOk = (s) =>  { window.App.domUtils.KeyVariableIsOk(s); }


var keyEditor = function(cell, onRendered, success, cancel){
    
    var input = document.createElement("input");

    input.setAttribute("type", "text");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    
    input.value = cell.getValue()

    onRendered(function(){
        input.focus();
        input.style.height = "100%";
    });

    

    function onChange(){
        if(input.value != cell.getValue() && !StringIsNullOrEmpty(input.value) && KeyVariableIsOk(input.value) ){
            success(input.value);
        }else{
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            onChange();
        }

        if(e.keyCode == 27){
            cancel();
        }
    });

    return input;
};

var inputEditor = function(cell, onRendered, success, cancel){
    
    var input = document.createElement("input");

    input.setAttribute("type", "text");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    
    input.value = cell.getValue()

    onRendered(function(){
        input.focus();
        input.style.height = "100%";
    });

    function onChange(){
        if(input.value != cell.getValue() && !StringIsNullOrEmpty(input.value)){
            success(input.value);
        }else{
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            onChange();
        }

        if(e.keyCode == 27){
            cancel();
        }
    });

    return input;
};


var checkboxEditor = function(cell, onRendered, success, cancel){
    
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.classList = "form-check";
    input.id = "chkisHtmlTablVar" + cell.getData().ID;
    input.style.height = "max-content";
    input.style.width = "max-content";

   var d = document.createElement('div');
   d.classList = "d-flex justify-content-center";
   d.appendChild(input);

    
    var vl = cell.getValue();
    if(vl == 0) input.checked = false;
    else input.checked = true;
    var old_value = input.checked;

    onRendered(function(){
        input.focus();
        // input.style.height = "100%";
    });

    function onChange(){
        if(input.checked != old_value ){
            success(input.checked?1:0);
        }else{
            cancel();
        }
    }

    
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            onChange();
        }

        if(e.keyCode == 27){
            cancel();
        }
    });

    
    
    return d;
};

 var btnElimina = function(cell, formatterParams, onRendered){
    var values = cell.getValue();
    var id_var = cell.getData().ID;
    var content = document.createElement("a");
    content.innerHTML = '<i class="bi bi-x-circle"></i>';
    content.classList = "btn btn-danger";
    content.addEventListener('click', () => RemoveVariable(id_var));


    return content;
};

module.exports = {
    keyEditor,
    inputEditor,
    checkboxEditor,
    btnElimina,
    KeyVariableIsOk
}