window.App = window.App || {};

window.App.domUtils = {
    GetInputText: (el) => { if (typeof el == 'string') { return $('#' + el).val(); } else { return $(el).val(); } },
    SetInputText: (el, t) => { if (typeof el == 'string') { return $('#' + el).val(t); } else { return $(el).val(t); } },
    ClearAndDefaultSelect: (id, text) => { $('#' + id).find('option').remove().end().append('<option selected>' + text + '</option>'); },
    GetSelectValue: (id) => { return $('#' + id).find(":selected").val(); },
    GetCheckBoxChecked: (id) => { return $('#' + id).is(":checked") },
    SetCheckBoxChecked: (id, val) => { $("#" + id).prop("checked", val); },
    StringIsNullOrEmpty: (s) => {
        if (typeof s === "string" && s.length === 0) { return true; }
        else if (s === null) { return true; }
        else if (s === undefined) { return true; }
        else { return false; }
    },
    ClickElement: (id) => { $('#' + id).click(); },
    FadeInElement: (id, time) => { if (typeof time === 'number') $('#' + id).fadeIn(time); else $('#' + id).fadeIn(200); },
    FadeOutElement: (id, time) => { if (typeof time === 'number') $('#' + id).fadeOut(time); else $('#' + id).fadeOut(200); },
    clearHtmlElement: (el) => { if (typeof el == 'string') { $('#' + el).html(''); } else { $(el).html(''); } },
    getViewportSize: () => { return { width: window.innerWidth, height: window.innerHeight }; },
    KeyVariableIsOk: (s) => {
        const regexVar = window.providerAPI.settingRead('regexVariable').then((regexVar) => {
            const regex = new RegExp(regexVar);
            return regex.test(s);
        }).catch((err) => {
            MessaggioErrore('Error reading regexVariable setting:', err);
            return false;
        })
    },
    isValidRegex: (pattern, flags = '') => {
        try {
            new RegExp(pattern, flags);
            return true;
        } catch (e) {
            return false;
        }
    },
    HandleImageFiles: (files) => {
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function () {
                        
                         AddVariable(`[{VAR_IMAGE${variables.length}}]`, img.src);
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    },
    toBase64:(str) => { const binary = unescape(encodeURIComponent(str)); return btoa(binary); },
    fromBase64: (b64) => { return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0))); },
    trovaJSONArray: (s) =>  {  const regex = /\[\{.*?\}\]/g;   return s.match(regex) || []; }

};