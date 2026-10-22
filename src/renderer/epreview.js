window.providerAPI.onPreviewData(MenuCommandParse);

var contentContainer = undefined;
$(async function() {
  contentContainer = document.getElementById("containerRenderer");
  const w = await window.providerAPI.previewContent();
  MenuCommandParse(w);
});

function MenuCommandParse(data){
  try{
      if (data !== undefined) {
        contentContainer.srcdoc = window.App.domUtils.fromBase64(data);
      }
  }catch(err){
    console.error(err);
  }
}