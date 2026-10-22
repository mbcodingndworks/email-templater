window.App = window.App || {};

window.App.ui = {

    initUi: () => {
        $('[data-hud-text]').each(function () {
            var hudText = $(this).attr('data-hud-text');                

            $(this).on("mouseenter", function () {
                $('#headerinfotext').text(hudText);
            });
            $(this).on("mouseleave", function () {
                $('#headerinfotext').text("");
            });
        });

        var dc = document.getElementById('imgpicker');
        dc.addEventListener('change', function (event) {
            var files = event.target.files;
            window.App.domUtils.HandleImageFiles(files);
        });

        var swpreview = document.getElementById('chkPreviewVariable');
        window.providerAPI.settingRead('epreview').then((value) => {
            swpreview.checked = value === 'true';
        });
        swpreview.addEventListener('change', function (event) {
            var checked = event.target.checked;
            SetPreviewContent();
            window.providerAPI.settingSet('epreview', checked);
        });
        
        
    },    
    EnvironmentColorschheme: () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),    
    setTheme: (theme) => {
        // console.log("Setting theme: " + theme);
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    },

    showActiveTheme: (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme')

        if (!themeSwitcher) {
            return
        }

        const themeSwitcherText = document.querySelector('#bd-theme-text')
        const activeThemeIcon = document.querySelector('.theme-icon-active use')
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
            element.setAttribute('aria-pressed', 'false')
        })

        btnToActive.classList.add('active')
        btnToActive.setAttribute('aria-pressed', 'true')
        activeThemeIcon.setAttribute('href', svgOfActiveBtn)
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

        if (focus) {
            themeSwitcher.focus()
        }
    },




    createTItem: ({
        id,
        text,
        active = false,
        disabled = false,
        data = undefined
    }) => {



        const li = document.createElement("li");
        li.classList = "list-group-item d-flex flex-column ";
        if (active) li.classList = "list-group-item d-flex flex-column template-list-item";
        li.setAttribute("data-em-template", id);


        const hint = document.createElement('small');
        hint.classList = "text-body-secondary fst-italic t-hint";
        hint.innerText = data;

        const div = document.createElement("div");
        div.classList = "d-flex justify-content-between align-items-start";


        const tname = document.createElement("input");
        tname.classList = "it-name input-visualizable";
        tname.type = "text";
        tname.value = text;
        tname.setAttribute("data-el-tid", id);
        tname.addEventListener("keydown", (e) => tOnKeyDown(tname, e));

        const btnOpen = document.createElement("a");
        btnOpen.classList = "btn btn-default";
        btnOpen.addEventListener("click", () => OpenTemplate(id));
        btnOpen.innerHTML = '<i class="bi bi-arrow-right-circle-fill"></i>';

        const btnRemove = document.createElement("a");
        btnRemove.classList = "btn btn-default";
        btnRemove.addEventListener("click", () => DeleteTemplate(id));
        btnRemove.innerHTML = '<i class="bi bi-x-circle-fill"></i>';

        div.appendChild(tname);
        div.appendChild(btnOpen);
        div.appendChild(btnRemove);
        li.appendChild(div);
        if (data != undefined) li.appendChild(hint);
        return li;

    },



    createBlankTItem: () => {



        const li = document.createElement("li");
        li.classList = "list-group-item d-flex flex-column ";
        // if(active)  li.classList = "list-group-item d-flex flex-column template-list-item";
        // li.setAttribute("data-em-template",id);



        const div = document.createElement("div");
        div.classList = "d-flex justify-content-between align-items-start";


        const btnOpen = document.createElement("a");
        btnOpen.classList = "btn btn-primary";
        btnOpen.addEventListener("click", () => MenuCommandParse({cmd: 'newtemplate'}));
        btnOpen.innerHTML = '<i class="bi bi-arrow-right-circle-fill"></i>&nbsp;Crea nuovo template';



        div.appendChild(btnOpen);
        li.appendChild(div);
        return li;

    },

    createTList: (items = []) => {
        const ol = document.createElement("ol");
        ol.classList.add("list-group");

        items.forEach(item => {
            ol.appendChild(window.App.ui.createTItem(item));
        });

        if (items.length == 0) {
            ol.appendChild(window.App.ui.createBlankTItem());
        }

        return ol;
    },


    createListGroupItem: ({
        id,
        text,
        onclick = (el) => OpenTemplate(el),
        active = false,
        disabled = false
    }) => {
        const a = document.createElement("a");
        a.addEventListener("click", () => onclick(a));
        a.textContent = text;
        a.setAttribute("data-et-id", id);
        a.classList.add("list-group-item", "list-group-item-action");

        if (active) {
            a.classList.add("active");
            a.setAttribute("aria-current", "true");
        }

        if (disabled) {
            a.classList.add("disabled");
            a.setAttribute("aria-disabled", "true");
            a.tabIndex = -1;
        }

        return a;
    },

    createListGroup: (items = []) => {
        const div = document.createElement("div");
        div.classList.add("list-group");

        items.forEach(item => {
            div.appendChild(createListGroupItem(item));
        });

        return div;
    },



    showToast: ({
        title = 'Notifica',
        message = '',
        time = 'adesso',
        bgClass = 'bg-primary',
        textClass = 'text-white',
        headerClass = '',
        bodyClass = '',
        imgSrc = '',
        delay = 5000,
        autohide = true
    } = {}) => {
        let container = document.getElementsByClassName('toast-container');
        if(container.length > 0) {
            container = container[0];
        }
        
        
        if (container !== undefined && container !== null) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container  p-3 ';
            // container.style.zIndex = '1080';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast ${bgClass} ${textClass}`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        const closeBtnClass = textClass.includes('text-white') ? 'btn-close btn-close-white' : 'btn-close';

        toastEl.innerHTML = `
    <div class="toast-header ${headerClass}">
      ${imgSrc ? `<img src="${imgSrc}" class="rounded me-2" alt="icon" style="width:20px;height:20px;object-fit:cover;">` : ''}
      <strong class="me-auto">${title}</strong>
      <small>${time}</small>
      <button type="button" class="${closeBtnClass}" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body ${bodyClass}">
      ${message}
    </div>
  `;

        
        container.appendChild(toastEl);

        const toast = new Bootstrap.Toast(toastEl, {
            delay,
            autohide
        });

        toast.show();

        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });

        return toast;
    }


};



const MessaggioInfo = (msg) => window.App.ui.showToast({title: "Info",message: msg})
const MessaggioErrore = (msg) => window.App.ui.showToast({title: "Error",message: msg, bgClass: "bg-danger"})



