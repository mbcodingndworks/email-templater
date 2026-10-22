$(async () => {
    document.getElementById('btn-reset-db').addEventListener('click', ResetDatabase);
    document.getElementById('btn-export-db').addEventListener('click', exportDatabase);
    document.getElementById('btn-import-db').addEventListener('click', ImportDatabase);
    document.getElementById('btn-save-settings').addEventListener('click', SaveSetting);

    const c =await window.providerAPI.settingRead('theme');
    const debugMode = await window.providerAPI.settingRead('debugMode');
    const wWidth = await window.providerAPI.settingRead('ApplicationWindowWidth');
    const wHeight = await window.providerAPI.settingRead('ApplicationWindowHeight');
    const regexVar = await window.providerAPI.settingRead('regexVariable');
    const defaultHtmlTemplate = await window.providerAPI.settingRead('DefaultHtmlTemplate');
    if (defaultHtmlTemplate) document.getElementById("txtDefaultHtmlTemplate").value = defaultHtmlTemplate;
    if (regexVar) document.getElementById("txtRegex").value = regexVar;
    window.App.domUtils.SetCheckBoxChecked("chkDebugMode", debugMode);
    const dbPath = await window.providerAPI.GetDatabasePath();
    document.getElementById("dbpath").innerText = dbPath;
    // console.log("Settings loaded: ", { debugMode, wWidth, wHeight, regexVar, defaultHtmlTemplate, dbPath });
    var currentTheme = await window.providerAPI.GetCurrentTheme();
    // console.log("Current theme: ", currentTheme);
    if (currentTheme === 'dark') {
      window.App.ui.setTheme('dark');
    } else {
      window.App.ui.setTheme('light');
    }

  });

  function SaveSetting() {
    const debugMode = document.getElementById("chkDebugMode").checked;
    const regexVar = document.getElementById("txtRegex").value;
    window.providerAPI.settingSet('debugMode', debugMode ? 'true' : 'false');
    if(window.App.domUtils.isValidRegex(regexVar)) {
      window.providerAPI.settingSet('regexVariable', regexVar);
    }
    const defaultHtmlTemplate = document.getElementById("txtDefaultHtmlTemplate").value
    window.providerAPI.settingSet('DefaultHtmlTemplate', defaultHtmlTemplate);
    MessaggioInfo(window.StringProvider.K_SETTINGS_SAVED);
  }

  const ResetDatabase = async () => {
    const confirmed = confirm(window.StringProvider.K_DB_CONFIRM_RESET);
    if (!confirmed) return;
    const result = await window.providerAPI.ResetDatabase();
    if (result === true) {
      MessaggioInfo(window.StringProvider.K_DB_RESET_SUCCESS);
    } else {
      MessaggioErrore("Errore nel resettare il database: " + result.error);
    }
  }

  const ImportDatabase = async () => {
    const confirmed = confirm(window.StringProvider.K_DB_CONFIRM_IMPORT);
    if (!confirmed) return;
    const result = await window.providerAPI.ImportDatabase();
    if (result !== undefined) {
      MessaggioInfo(window.StringProvider.K_DB_IMPORT_SUCCESS);
    } else {
      MessaggioErrore(window.StringProvider.K_DB_IMPORT_ERROR);
    }
  }

  const exportDatabase = async () => {
    const result = await window.providerAPI.ExportDatabase();
    if (result !== undefined) {
      MessaggioInfo(window.StringProvider.K_DB_EXPORT_SUCCESS);
    } else {
      MessaggioErrore(window.StringProvider.K_DB_EXPORT_ERROR);
    }
  }