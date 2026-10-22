var editorHandler = undefined;
var templateSelectorOpen = false;
var currentTemplate = undefined;
var templates = [];
var variables = [];
// var CurrentModal = undefined;
var epreview = false;
var settingview = false;
var tableVariables = undefined;
window.modaleEsporta = new Bootstrap.Modal('#modaleExport', { keyboard: false });
window.modaleSalvaConNome = new Bootstrap.Modal('#modaleSalvaTem', { keyboard: false });
window.modaleImporta = new Bootstrap.Modal('#modaleImporta', { keyboard: false });
window.modaleVariabili = new Bootstrap.Modal('#modaleVariabili', { keyboard: false });
var currentColorScheme = undefined;
var htmlPreviewNoData = "<h1>Nessun contenuto da visualizzare</h1>";

$(async () => {
  document.getElementById('btn-template-selector').addEventListener('click', toggleTemplateSelector);
  document.getElementById('btn-new-template').addEventListener('click', NewTemplate);
  document.getElementById('btn-open-template').addEventListener('click', HeaderMenuOpen);
  document.getElementById('btn-save-template').addEventListener('click', HeaderMenuSave);
  document.getElementById('btn-delete-template').addEventListener('click', HeaderMenuDelete);
  document.getElementById('btn-export-template').addEventListener('click', OpenModalExport);
  document.getElementById('btn-external-preview').addEventListener('click', HeaderMenuExternalPreview);
  document.getElementById('btn-variables').addEventListener('click', OpenVariablesModal);
  document.getElementById('btn-settings').addEventListener('click', OpenSettingsView);
  document.getElementById('chkTemaScuroswitch').addEventListener('change', ThemeChangeListener);
  document.getElementById('btn-esporta-html').addEventListener('click', EsportaHtml);
  document.getElementById('btn-copy-export64').addEventListener('click', () => CopyToClipboard(document.getElementById('txtAreaExportTemplate64').value));
  document.getElementById('txtModaleNomeTemplate').addEventListener('keydown', (e) => tOnKeyDown(e.currentTarget, e));
  document.getElementById('BtnCreaTemplate').addEventListener('click', CreateNewTemplate);
  document.getElementById('btn-import-files').addEventListener('click', MultipleFileUpload);
  document.getElementById('btn-add-variable').addEventListener('click', () => AddVariable(VariableName(), ''));
  document.getElementById('btn-add-image-variable').addEventListener('click', AddImageVariable);

  window.App.ui.initUi();
  

  editorHandler = monaco.editor.create(document.getElementById('containerTemplate'), {
    value: [''].join('\n'),
    language: 'html',
    automaticLayout: true
  });

  editorHandler.onDidChangeModelContent((event) => {
    // console.log('Testo modificato');
    // console.log(editor.getValue());
    // console.log(event);
    // updateTemplateFrame()
    SetPreviewContent();
  });

  editorHandler.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
    await SaveTemplate();

  });

  toggleTemplateSelector(templateSelectorOpen);
  await FetchTemplates();
  FetchVariables();
  UpdateTemplateList();
  SetEditorValue(currentTemplate !== undefined ? window.App.domUtils.fromBase64(currentTemplate.HTML_BASE64_CONTENT) : '');

  SetPreviewContent();
  RefreshTheme();
  observer.observe(document.getElementById('applayer'));
  // await window.providerAPI.settingRead('DefaultHtmlTemplate');

});


let pendingPreviewLoadHandler = null;

function SetPreviewIframeHtml(html) {
  const iframe = document.getElementById('containerRenderer');
  let x = 0, y = 0;
  try { x = iframe.contentWindow.scrollX; y = iframe.contentWindow.scrollY; } catch (e) { }

  if (pendingPreviewLoadHandler) iframe.removeEventListener('load', pendingPreviewLoadHandler);
  pendingPreviewLoadHandler = () => {
    try { iframe.contentWindow.scrollTo(x, y); } catch (e) { }
    pendingPreviewLoadHandler = null;
  };
  iframe.addEventListener('load', pendingPreviewLoadHandler, { once: true });

  iframe.srcdoc = html;
}

function updateTemplateFrame() {
  let html = GetEditorValue();

  if (html.length == 0) html = htmlPreviewNoData;
  if (PreviewVariables() === true) {
    let vars = variables.map((x) => { return x.KEY; })
    console.log(vars);
    for (let i = 0; i < vars.length; i++) {
      if (html.includes(vars[i])) {
        let defaultValue = variables.map((x) => { if (x.KEY == vars[i]) return x.VALUE; })
        html = html.replace(vars[i], defaultValue[0]);
      }
    }
  }
  let htmlb64 = window.App.domUtils.toBase64(html);
  if (epreview) window.providerAPI.previewContent(htmlb64)
  else SetPreviewIframeHtml(html);
  window.App.domUtils.SetInputText('txtAreaExportTemplate64', htmlb64);
  // window.App.domUtils.SetInputText('txtAreaExportTemplatehtml', html);
  if (currentTemplate !== undefined) currentTemplate.HTML_BASE64_CONTENT = htmlb64;

}


const observer = new ResizeObserver(async () => UpdateEditorSize());

async function UpdateEditorSize() {
  const rect = document.getElementById('editorLayer').getBoundingClientRect();
  const iframe = document.getElementById('containerRenderer');

  if (iframe !== undefined) {
    iframe.innerHeight = rect.height;
    iframe.innerWidth = rect.width;
  }
}

window.providerAPI.onMenuCommand(MenuCommandParse);

function MenuCommandParse(data) {

  if (data === undefined) return;

  if (data.cmd === "fileopen") modaleImporta.show();

  if (data.cmd === "variables") { OpenVariablesModal(); }

  if (data.cmd === "viewtemplate") toggleTemplateSelector();

  if (data.cmd == "esporta") modaleEsporta.show();

  if (data.cmd == "savetemplate") SaveTemplate();

  if (data.cmd == "modello") {
    if (data.content !== undefined) {
      SetEditorValue(window.App.domUtils.fromBase64(data.content));
    }
  }
  if (data.cmd == "epreview") {
    if (data.closed == true) {
      epreview = false;
      MainPreviewVisibility(true);
      updateTemplateFrame();
    }
  }
  if (data.cmd == "settingsview") {
    if (data.closed == true) {
      settingview = false;
      //TODO: On Setting window closed
      // MainPreviewVisibility(true);
      // updateTemplateFrame();

    } else {

      OpenSettingsView();
      settingview = true;
    }
  }


  if (data.cmd == "newtemplate") {
    NewTemplate();
  }

  // if(data.cmd == "switchtheme"){

  // }

  if (data.cmd == "externalpreviewopen") {
    epreview = true;
    MainPreviewVisibility(true);
    OpenEpreview();
    updateTemplateFrame();
  }
}

const ListaTemplateEl = document.getElementById('collapseTemplate');
const BtnCreatemplateEl = document.getElementById('BtnCreaTemplate');



const NewTemplate = () => { currentTemplate = undefined; SetEditorValue(''); SaveTemplate(); };
const ShowSolutionBar = () => window.App.domUtils.FadeInElement(ListaTemplateEl, 200);
const HideSolutionBar = () => window.App.domUtils.FadeOutElement(ListaTemplateEl, 200);
const GetEditorValue = () => { return editorHandler.getValue(); };
const SetEditorValue = (html) => { if (html != undefined) editorHandler.getModel().setValue(html); };
const ApriFile = () => window.App.domUtils.ClickElement('docpicker');
const AddImageVariable = () => { window.App.domUtils.ClickElement('imgpicker'); };
const PreviewVariables = () => { return window.App.domUtils.GetCheckBoxChecked('chkPreviewVariable') };

const showTempleteSelector = (bool) => { if (bool == true || bool === undefined) window.App.domUtils.FadeInElement('collapseTemplate', 200); else window.App.domUtils.FadeOutElement('collapseTemplate', 200); };
const toggleTemplateSelector = () => { showTempleteSelector(!templateSelectorOpen); templateSelectorOpen = !templateSelectorOpen; }

const clearTemplates = () => { window.App.domUtils.clearHtmlElement(ListaTemplateEl); }
const MainPreviewVisibility = (b) => { if (b) { window.App.domUtils.FadeInElement('previewContainer', 200); } else { window.App.domUtils.FadeOutElement('previewContainer', 200); } }
const OpenEpreview = () => { window.providerAPI.ChangeView('ExternalPreview'); epreview = true; MainPreviewVisibility(false); UpdateEditorSize(); };
const OpenSettingsView = () => { window.providerAPI.ChangeView('Settings'); settingview = true; };
const OpenTemplateTitleModal = (t) => { window.App.domUtils.SetInputText('titleModaleNewTemplate', t); }
const HeaderMenuOpen = () => { modaleImporta.show(); };
const HeaderMenuSave = () => { SaveTemplate(); };
const HeaderMenuDelete = () => { if (currentTemplate === undefined) MessaggioErrore(StringProvider.K_NO_TEMPLATE_SELECTED); else DeleteTemplate(currentTemplate.ID); };
const HeaderMenuExternalPreview = () => { MenuCommandParse({ cmd: "externalpreviewopen" }); };
const AddVariable = (k, t) => {
  try {
    if (currentTemplate === undefined) throw Error(StringProvider.K_NO_TEMPLATE_SELECTED);
    window.providerAPI.insertVariable({ ID_TEMPLATE: currentTemplate.ID, KEY: k, VALUE: t, IS_HTML: 0 }).then((data) => {
      if (data !== undefined && data !== false) {
        MessaggioInfo(StringProvider.K_VAR_SUCCESS_CREATE);
        FetchVariables();
      } else {
        throw Error(StringProvider.K_VAR_ERROR_CREATE);
      }
    }).catch((err) => { throw Error(err); })
  } catch (err) {
    MessaggioErrore(err);
  }
};
const VariableName = () => { return '[{VAR_VARIABLE' + variables.length + '}]' }
const EsportaHtml = () => { if (currentTemplate === undefined) MessaggioErrore(StringProvider.K_NO_TEMPLATE_SELECTED); else window.providerAPI.SaveFile(window.App.domUtils.fromBase64(currentTemplate.HTML_BASE64_CONTENT)); };
const CopyToClipboard = (t) => {
  navigator.clipboard.writeText(t).then(
    () => {
      MessaggioInfo(StringProvider.K_COPIATO_APPUNTI);
    },
    () => {
      MessaggioErrore(StringProvider.K_ERR_COPIATO_APPUNTI);
    },
  );
};
const FetchVariables = () => {
  var vt = window.providerAPI.getVariables(currentTemplate.ID).then((data) => {
    // console.log(data);
    variables = data;
    if (tableVariables !== undefined) tableVariables.setData(variables);
  })
};
const OpenVariablesModal = async () => {
  await SetupTableVariable(); if (currentTemplate === undefined) MessaggioErrore(StringProvider.K_NO_TEMPLATE_SELECTED); else { FetchVariables(); modaleVariabili.show(); };
}

const OpenModalExport = () => { modaleEsporta.show(); };
const SetPreviewContent = (content) => {
  let html = GetEditorValue();
  if (html.length == 0) html = htmlPreviewNoData;
  // let htmlb64 = btoa(html);
  window.App.domUtils.SetInputText('txtAreaExportTemplate64', window.App.domUtils.toBase64(html));
  // window.App.domUtils.SetInputText('txtAreaExportTemplatehtml', html);
  if (currentTemplate !== undefined) currentTemplate.HTML_BASE64_CONTENT = window.App.domUtils.toBase64(html);



  if (PreviewVariables() === true) {
    let vars = variables.map((x) => { return x.KEY; })
    // console.log(vars);
    for (let i = 0; i < vars.length; i++) {
      if (html.includes(vars[i])) {
        let defaultValue = variables.map((x) => { if (x.KEY == vars[i]) return x.VALUE; })
        html = html.replace(vars[i], defaultValue[0]);
      }
    }
  }
  if (epreview) window.providerAPI.previewContent(window.App.domUtils.toBase64(html))
  else SetPreviewIframeHtml(html);

}
const RefreshTheme = () => {
  if (currentColorScheme === undefined) currentColorScheme = window.App.ui.EnvironmentColorschheme();
  if (currentColorScheme == 'dark') SetThemeDark();
  else SetThemeLight();
  window.App.ui.setTheme(currentColorScheme);
}

const ThemeChangeListener = () => {
  var c = window.App.domUtils.GetCheckBoxChecked('chkTemaScuroswitch');
  if (c == true) currentColorScheme = 'dark'; else currentColorScheme = 'light';
  RefreshTheme();
}

const SetThemeLight = async () => {
  await window.providerAPI.settingSet('theme', 'light');
  editorHandler._themeService.setTheme('vs')
  window.App.ui.setTheme('light');
  window.App.domUtils.SetCheckBoxChecked('chkTemaScuroswitch', false);
}

const SetThemeDark = async () => {
  await window.providerAPI.settingSet('theme', 'dark');
  editorHandler._themeService.setTheme('vs-dark');
  window.App.ui.setTheme('dark');
  window.App.domUtils.SetCheckBoxChecked('chkTemaScuroswitch', true);
}



const FetchTemplates = async () => {

  try {
    let res = await window.providerAPI.getTemplates();
    if (res != undefined) {
      templates = res;
      if (templates.length > 0 && currentTemplate == undefined) { currentTemplate = templates[0]; }
      if (currentTemplate !== undefined) await window.providerAPI.getTemplate(currentTemplate.ID).then((data) => { currentTemplate.HTML_BASE64_CONTENT = data[0].HTML_BASE64_CONTENT; }).catch((err) => { MessaggioErrore(err); });
    }
  } catch (err) { MessaggioErrore(StringProvider.K_ERR_FETCHING_T) }

  // console.log(res);
}

const UpdateTemplateList = () => {
  const items = [];
  clearTemplates();
  for (let i = 0; i < templates.length; i++) {
    let acti = (currentTemplate !== undefined && currentTemplate.ID == templates[i].ID);
    var dt = new Date(+templates[i].DATE);
    var data_formattata = undefined;
    if (dt != undefined) data_formattata = dt.toLocaleDateString('it-IT', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    var obj = { id: templates[i].ID, text: templates[i].NAME, active: acti, disabled: false, data: data_formattata }
    items.push(obj);

  }

  // else mostraEsploraSoluziooni();
  const listGroup = window.App.ui.createTList(items);
  ListaTemplateEl.append(listGroup);

}


const UpdateTemplateName = async (id, name) => {
  try {
    let res = await window.providerAPI.updateTemplateName(id, name);
    MessaggioInfo(StringProvider.K_TEMPLATENAME_SUCCESS_SAVE);
  } catch (err) {
    MessaggioErrore(err);
  }
}


const OpenTemplate = async (id) => {

  try {
    let res = await window.providerAPI.getTemplate(id);
    if (res != undefined && res.length == 1) {
      currentTemplate = res[0];
      //  console.log(currentTemplate);
      SetEditorValue(window.App.domUtils.fromBase64(res[0].HTML_BASE64_CONTENT));
    }
  } catch (err) { MessaggioErrore(err); }

  await FetchTemplates();
  UpdateTemplateList();
  await FetchVariables();
}

const GetDefaultTemplate = async () => {

  try {
    const defaultHtmlTemplate = await window.providerAPI.settingRead('DefaultHtmlTemplate');

    return defaultHtmlTemplate;

  } catch (err) { MessaggioErrore(err); return undefined; }

  await FetchTemplates();
  UpdateTemplateList();
}

const DeleteTemplate = async (id) => {
  try {
    if (!confirm(StringProvider.K_DELETE_TEMPLATE_CONFIRM_TXT)) return;
    let res = await window.providerAPI.removeTemplate(id);
    if (res != undefined && res === true) {
      MessaggioInfo(StringProvider.K_DELETE_SUCCESS);

    }
  } catch (error) {
    MessaggioErrore(error);
  }
  await FetchTemplates();
  UpdateTemplateList();

}

const SaveTemplate = async () => {

  try {
    const v = GetEditorValue();
    if (v === undefined) return;
    // if(v.length == 0) throw Error("Il testo è vuoto impossibile salvare.");
    if (currentTemplate === undefined) { OpenTemplateTitleModal("Crea nuovo template"); modaleSalvaConNome.show(); return; }
    else { OpenTemplateTitleModal("Salva template con nome"); }
    let res = await window.providerAPI.saveTemplate(currentTemplate.ID, window.App.domUtils.toBase64(v));
    if (res != undefined) {
      MessaggioInfo(StringProvider.K_MESSAGGIO_SALVA);
    }

  } catch (err) {
    MessaggioErrore(err);
  }

}

const CreateNewTemplate = async () => {

  try {

    const defaultHtmlTemplate = await window.providerAPI.settingRead('DefaultHtmlTemplate');

    let htmlContent = '';
    if (defaultHtmlTemplate !== undefined && defaultHtmlTemplate.length > 0) htmlContent = defaultHtmlTemplate;
    else htmlContent = GetEditorValue();

    var obj = {};
    obj.ID = undefined;
    obj.NAME = window.App.domUtils.GetInputText('txtModaleNomeTemplate');
    obj.HTML_BASE64_CONTENT = window.App.domUtils.toBase64(htmlContent);
    obj.DATE = Date.now();

    let res = await window.providerAPI.insertTemplate(obj);
    if (res !== undefined) {
      await OpenTemplate(res);
      await FetchTemplates();
      UpdateTemplateList();
      modaleSalvaConNome.hide();
      MessaggioInfo(StringProvider.K_SALVANUOVO_SUCCESSO);


    } else {
      throw Error(StringProvider.K_SALVANUONO_ERROE);
    }
  } catch (err) { MessaggioErrore(err); }

}



function RemoveVariable(id) {
  try {
    window.providerAPI.removeVariables(id).then((data) => {
      if (data === true) { FetchVariables(); MessaggioInfo(StringProvider.K_VAR_SUCCESS_DELETE); }
      else throw Error(StringProvider.K_VAR_ERR_DELETE);
    })
  }
  catch (err) { MessaggioErrore(err); }
}

async function MultipleFileUpload() {

  try {
    let success = 0;
    let error = 0;

    for (let i = 0; i < docpicker.files.length; i++) {
      // console.log("Importo file ");
      var f = await FileImport(docpicker.files[i]);
      if (f === undefined) { error++; continue }
      // console.log("Creo template");
      var t = await window.providerAPI.insertTemplate(f);
      if (t != undefined) success++;

    }

    await FetchTemplates();
    UpdateTemplateList();

    MessaggioInfo("Importati correttamente " + success + " template");
  } catch (err) {
    MessaggioErrore(err);
  }



}

async function FileImport(file) {

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        // console.log(reader.result)
        // if (reader.result) {
        var f = reader.result;
        var obj = {};
        obj.ID = undefined;
        obj.NAME = file.name;
        obj.HTML_BASE64_CONTENT = window.App.domUtils.toBase64(f);
        obj.DATE = Date.now();
        resolve(obj);
        // }
      };
      reader.onerror = () => {
        MessaggioErrore(StringProvider.K_FILE_IMPORT_READ_ERR); reject(undefined);
      };
      reader.readAsText(file);
    } catch (err) { MessaggioErrore(err); resolve(undefined); }
  });

}


const tOnKeyDown = async (el, e) => {

  if (e.key === 'Enter') {
    if (el.id == "txtModaleNomeTemplate") {
      $(BtnCreatemplateEl).trigger("click");
    } else {
      try {
        const templateName = window.App.domUtils.GetInputText(el);
        const templateId = $(el).attr("data-el-tid");
        if (window.App.domUtils.StringIsNullOrEmpty(templateName)) throw new Error(StringProvider.K_TEMPLATENAE_EMPTY);
        await UpdateTemplateName(templateId, templateName);
      } catch (err) { MessaggioErrore(err); }
    }
  }
}









//TABULATOR STUFF

async function SetupTableVariable() {
  var v = await DetectVariables();
  if (v.length > 0) {
    if (confirm("Sono state rilevate variabili nel template. Vuoi importarle?")) {
      for (let i = 0; i < v.length; i++) {
        AddVariable(v[i], 'Imported var N ' + (i+1));
      }
    }
  }

  if (tableVariables !== undefined) { tableVariables.destroy(); tableVariables = undefined; }
  tableVariables = window.App.tables.SetupTableVariables({
    onEdit: async (row) => {
      await window.providerAPI.UpdateVariables({
        KEY: row.KEY,
        VALUE: row.VALUE,
        IS_HTML: row.IS_HTML,
        ID: row.ID
      });
      MessaggioInfo('Variabile aggiornata');
    },
    onDelete: async (row) => {
      await window.providerAPI.removeVariables(row.ID);
      await FetchVariables();
    }
  });
}

async function DetectVariables() {
  let regex = /\[\{.*?\}\]/g;
  try {
    const pattern = await window.providerAPI.settingRead('regexVariable');
    if (pattern && window.App.domUtils.isValidRegex(pattern, 'g')) regex = new RegExp(pattern, 'g');
  } catch (err) { console.error(err); }

  const found = GetEditorValue().match(regex) || [];
  return [...new Set(found)].filter((k) => !variables.some((x) => x.KEY == k));
}



