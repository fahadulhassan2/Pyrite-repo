
const uuid = (a) => { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid); };
const formatPhone = (num) => { return ['(', num.slice(0, 3), ') ', num.slice(3, 6), '-', num.slice(6)].join(''); };
const formatCC = (num) => { return num.match(/.{1,4}/g).join(' '); };

const profileAttributes = {
    'id': { 'field': 'id', 'default': '', 'type': 'text', 'regex': /^.*$/ },

    'Name': { 'field': 'pname', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'FirstName': { 'field': 'firstname', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'LastName': { 'field': 'lastname', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'Email': { 'field': 'email', 'default': '', 'type': 'text', 'regex': /^.+@.+$/ },
    'Address': { 'field': 'address', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'Address2': { 'field': 'address2', 'default': '', 'type': 'text', 'regex': /^.*$/ },
    'City': { 'field': 'city', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'PostalCode': { 'field': 'postal', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'Country': { 'field': 'country', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'State': { 'field': 'state', 'default': '', 'type': 'text', 'regex': /^.+$/ },
    'PhoneNumber': { 'field': 'phonenumber', 'default': '', 'type': 'text', 'regex': /^.+$/ },



    'CardNumber': { 'field': 'cardnumber', 'default': '', 'type': 'text', 'regex': /^[0-9]{13,16}$/ },
    'CardExpirationDate': { 'field': 'cardexpiry', 'default': '', 'type': 'text', 'regex': /^[0-9]{2}[\/][0-9]{2}$/ },
    'CardCVC': { 'field': 'cvc', 'default': '', 'type': 'text', 'regex': /^[0-9]{3,4}$/ },




};



let defaultProfile = {};
let storedProfiles = [];
let storedProxies = [];
let storedSession = {};


const findProfileIndex = (id) => {
    if (!storedProfiles.profiles) {
        return null;
    }

    for (let i = 0; i < storedProfiles.profiles.length; ++i) {
        if (storedProfiles.profiles[i].id == id) {
            return i;
        }
    }

    return null;
};

const saveProfileData = (callback) => {
    chrome.storage.local.set(storedProfiles, () => {
        const err = chrome.runtime.lastError;
        const success = !err;

        const errMessage = !success ? err.message : '';
        if (errMessage == 'QUOTA_BYTES_PER_ITEM quota exceeded') {
            alert('Commit failed. You have exceeded the maximum storage space');
        }

        if (callback) {
            callback(success, errMessage);
        }
    });
};



const buildProfile = (profile = null) => {
    //console.log($('#country').val());
    //console.log(countries.find(l => l.name == $('#country').val()));

    profile = profile ? profile : {};
    for (let profileKey in profileAttributes) {
        let value = null;


        value = $(`#${profileAttributes[profileKey].field}`).val();



        if (value != null) {
            profile[profileKey] = value;
        }
    }


    // profile = addUtilityFieldsToProfile(profile);

    console.log('built');
    console.log(profile);

    return profile;
};




const saveProfile = (e) => {
    // stop programatic events from triggering
    if (!e.originalEvent) {
        return;
    }

    e.preventDefault();

    const id = 01;

    let profile = null;

    // if (id.length > 0) {
    //     const profileIndex = findProfileIndex(id);
    //     if (profileIndex == null) {
    //         return;
    //     }

    //     profile = Object.assign({}, storedProfiles.profiles[profileIndex]); // clone
    // }
    // const prevProfile = Object.assign({}, profile);
    profile = buildProfile(profile);









    console.log('will continue');


    console.log('new');
    profile.id = uuid();
    // storedProfiles.profiles.push(profile);
    console.log('shhh', profile)
    chrome.storage.local.get(['allProfile'], function (data) {
        // check if data exists.
        console.log('sss', data)

    });
    storedProfiles.push(profile)
    console.log('array', storedProfiles)
    chrome.storage.local.set({ allProfile: storedProfiles }, function () {
        console.log('Value is set to ' + storedProfiles);
    });


    $("#firstcont").load(reload);

    // saveProfileData((success, errMessage) => {
    //     if (!success) {
    //         feedback(`Profile "${profile.Name}" could not be updated at this time. Something went wrong. Please try again`, 'bad');

    //         if (!$('body').hasClass('popup')) {
    //             alert('Saved failed. Lightning will need to close');
    //             window.close();
    //         } else {
    //             $(e.currentTarget).prop('checked', false);
    //         }
    //     } else {
    //         $('#id').val(profile.id);
    //         populateProfileSelect(storedProfiles.profiles);
    //         toggleLogo();

    //         let message = `Profile "${profile.Name}" was ${id.length == 0 ? 'added' : 'updated'}`;
    //         if ($('body').hasClass('popup')) {
    //             const el = $(e.currentTarget);
    //             const value = el.is(':checkbox') ? (el.is(':checked') ? 'on' : 'off') : (el.val().length == 0 ? '<i>none</i>' : el.val());
    //             message += ` (${e.currentTarget.id} = ${value})`
    //             message += '. Some changes require a page reload to take effect';
    //         }

    //         feedback(message, 'good');

    //         /*
    //         if ( $('body').hasClass('popup') ) {
    //             window.close();
    //         }
    //         */
    //     }
    // });
};


const reload = chrome.storage.local.get(
    ['allProfile'],
    async (data) => {
        console.log('dataready', data.allProfile.map((i) => i.Name))
        var dynamic = document.querySelector('.cardsdom')

        for (var i = 0; i < data.allProfile.length; i++) {
            var fetch = document.querySelector('.cardsdom').innerHTML;
            dynamic.innerHTML = `    <div id=cards${i} class="prcard col-10">
              
            <div style="background: url('./Assets/profil_select.svg') no-repeat;
            width: 100%;
            height: 20vh;

            ">
            <div class="ps-3 pt-5" style="font-weight: 400;">
              <p class="text-white fs-5 m-0 mt-2">${data.allProfile[i].CardNumber}</p>
              <p class="text-white fs-5 pt-2 p-0 m-0">${data.allProfile[i].Name}</p>
            </div>
          </div>
          </div>` + fetch;
        }

        var dynamic2 = document.querySelector('.cardsdom2')
        for (var i = 0; i < data.allProfile.length; i++) {
            var fetch = document.querySelector('.cardsdom2').innerHTML;
            dynamic2.innerHTML = `    <div class="col-8">
            <!-- <img class="img-fluid" src="./Assets/profil_select.svg" alt="" /> -->
            <div style="background: url('./Assets/profil_select.svg') no-repeat;
            height: 10em;
            width: 150%;

            ">
            <div class="ps-3 pt-5" style="font-weight: 400;">
              <p class="text-white fs-5 m-0 mt-2">${data.allProfile[i].CardNumber}</p>
              <p class="text-white fs-5 pt-2 p-0 m-0">${data.allProfile[i].Name}</p>
            </div>
          </div>
          </div>` + fetch;
        }



    }
);










const toggleEnabled = (e) => {
    e.preventDefault();
    let Enabled;
    if ($('#enabled').is(':checked')) {
        Enabled = true;
        //feedback(`Profile ${idd} and ${loadId}`,'good');
    } else {
        Enabled = false;
    }
    chrome.storage.local.set({ "Enabled": Enabled }, function () {
        console.log('Enabled Set to ', Enabled);
    });
}

const getStoredStatus = () => {
    return new Promise(resolve => {
        chrome.storage.local.get("Enabled", (Enabled) => {
            resolve(Enabled);
        });
    });
};
const getStoredPrice = () => {
    return new Promise(resolve => {
        chrome.storage.local.get("maxPrice", (totalQuestions) => {
            resolve(totalQuestions);
        });
    });
};


const init = () => {
    console.log('Extension Initialized');

    // getStoredStatus().then(async (Enabled) => {
    //     getStoredPrice().then(async (maxprice) => {

    //         $(`#enabled`).prop('checked', Enabled.Enabled).trigger('change');
    //         $(`#price`).val(maxprice.maxPrice).trigger('change');
    //     })

    // })




    chrome.storage.local.get(
        ['allProfile'],
        async (data) => {
            console.log('dataready', data.allProfile.map((i) => i.Name))

            var dynamic = document.querySelector('.cardsdom')

            for (var i = 0; i < data.allProfile.length; i++) {
                var fetch = document.querySelector('.cardsdom').innerHTML;
                dynamic.innerHTML = `    <div id=cards${i} class="prcard col-10">
                  
                <div style="background: url('./Assets/profil_select.svg') no-repeat;
               
                width: 100%;
                height: 20vh;

                ">
                <div class="ps-3 pt-5" style="font-weight: 400;">
                  <p class="text-white fs-5 m-0 mt-2">${data.allProfile[i].CardNumber}</p>
                  <p class="text-white fs-5 pt-2 p-0 m-0">${data.allProfile[i].Name}</p>
                </div>
              </div>
              </div>` + fetch;
            }

            var dynamic2 = document.querySelector('.cardsdom2')
            for (var i = 0; i < data.allProfile.length; i++) {
                var fetch = document.querySelector('.cardsdom2').innerHTML;
                dynamic2.innerHTML = `    <div class="col-8">
                <!-- <img class="img-fluid" src="./Assets/profil_select.svg" alt="" /> -->
                <div style="background: url('./Assets/profil_select.svg') no-repeat;
                height: 10em;
                width: 150%;
  
                ">
                <div class="ps-3 pt-5" style="font-weight: 400;">
                  <p class="text-white fs-5 m-0 mt-2">${data.allProfile[i].CardNumber}</p>
                  <p class="text-white fs-5 pt-2 p-0 m-0">${data.allProfile[i].Name}</p>
                </div>
              </div>
              </div>` + fetch;
            }



        }
    );




    if (document.getElementById('form-proxy') != null) {
        chrome.storage.local.get(
            ['allProxies'],
            async (data) => {
                console.log('dataready', data.allProxies.map((i) => i))
                // var dynamic = document.querySelector('.cardsdom')
                if (data.allProxies.length > 0) {
                    document.getElementById('labelproxy').style.display = "none";
                }
                if (document.getElementById('prxoy_table') != null) {
                    var dynamic = document.getElementById('dynamic_proxy')
                    for (var i = 0; i < data.allProxies.length; i++) {
                        var fetch = document.getElementById('dynamic_proxy').innerHTML;
                        dynamic.innerHTML = `   <tr>
                        <td>${data.allProxies[i].ip}</td>
                        <td>${data.allProxies[i].port}</td>
                        <td>${data.allProxies[i].username}</td>
                        <td>${data.allProxies[i].password}</td>
                        <td>${data.allProxies[i].store}</td>
                        <td>${data.allProxies[i].status}</td>
                        <td>${data.allProxies[i].action}</td>
                      </tr>` + fetch;
                    }
                }


                // for (var i = 0; i < data.allProfile.length; i++) {
                //     var fetch = document.querySelector('.cardsdom2').innerHTML;
                //     dynamic2.innerHTML = `    <div class="col-8">
                //     <!-- <img class="img-fluid" src="./Assets/profil_select.svg" alt="" /> -->
                //     <div style="background: url('./Assets/profil_select.svg') no-repeat;
                //     height: 10em;
                //     width: 100%;

                //     ">
                //     <div class="ps-3 pt-5" style="font-weight: 400;">
                //       <p class="text-white fs-5 m-0 mt-2">${data.allProfile[i].CardNumber}</p>
                //       <p class="text-white fs-5 pt-2 p-0 m-0">${data.allProfile[i].Name}</p>
                //     </div>
                //   </div>
                //   </div>` + fetch;
                // }



            }
        );
    }

}

const setPrice = () => {
    let maxPrice = $('#price').val();


    if (maxPrice) {
        chrome.storage.local.set({ "maxPrice": maxPrice }, function () {
            console.log('Data stored in storage ', maxPrice);
        });
    } else {
        alert(`Please enter correct amount`);
    }
    alert(`123`);



}




const addProxy = async () => {

    var proxyvalue;
    if (document.getElementById('goalmoadl') != null) {
        // console.log(document.getElementById('proxyte').innerHTML)
        proxyvalue = document.getElementById('proxyte').value;

        // proxyvalue = $('#proxytext').val();
    }


    let prxoyobject = {
        id: uuid(),
        ip: '192.128.3.2',
        port: '4444',
        username: proxyvalue,
        password: '***********',
        store: 'N/A',
        status: 'N/A',
        action: 'N/A'



    };

    // prxoyobject.id = uuid()
    chrome.storage.local.get(['allProxies'], function (data) {
        // check if data exists.
        console.log('dddd', data)

    });


    console.log("currentProxy", prxoyobject)
    storedProxies.push(prxoyobject)
    console.log('proxies', storedProxies)
    chrome.storage.local.set({ allProxies: storedProxies }, function () {
        console.log('Value is set to ' + storedProxies);
    });


}







const fullView = () => {
    const views = chrome.extension.getViews({ type: 'tab' });
    if (views.length > 0) {
        const view = views[0];
        view.chrome.tabs.getCurrent(tab => {
            chrome.tabs.update(tab.id, { active: true });
            closePopup();
        });
        return;
    }

    chrome.tabs.create({ url: 'index.html' });
    closePopup();



}


const manageNavigation = (e) => {

    const section = e.currentTarget.id.replace('nav-', '');
    // alert(section)
    $('[id^="form"]').hide();
    $('a.navigation-link[id^="nav-"]').addClass('nav-inactive');
    $(`#form-${section}`).show();
    $(`#nav-${section}`).removeClass('nav-inactive').addClass('nav-active');


}



// const manageNavigation = (e) => {

//     const section = e.currentTarget.id.replace('nav-', '');
//     alert(section)
//     // $('[id^="form"]').hide();
//     const x = document.querySelector('div[id^="form"]').innerHTML;
//     // alert(x)
//     x.style.display = "none";
//     const y = document.querySelector('a[id^="nav-"]');
//     y.classList.add('nav-inactive');
//     const z = document.getElementById(`form-${section}`);
//     alert(z)
//     z.style.display = "block";

//     document.getElementById(`nav-${section}`).classList.remove('nav-inactive');
//     document.getElementById(`nav-${section}`).classList.add('nav-active');


// }
const closePopup = () => {
    window.close();
}

const togglemodal = () => {
    document.getElementById('goalmoadl').classList.toggle('showmodal');
}


if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        if ($('body').hasClass('index')) {
            $('[id^="form"]').hide();
            $(`#form-task`).show();
            init();
            $('a.navigation-link[id^="nav-"]').on('click', manageNavigation);
            $('a#save').on('click', saveProfile);

            $('a#modlpop').on('click', togglemodal);
            $('a#closemodal').on('click', togglemodal);
            $('#add_proxy').on('click', addProxy);

        }

        if ($('body').hasClass('popup')) {
            init();

            $('#setP').on('click', setPrice);
            $('#enabled').on('change', toggleEnabled);
            $('button#full').on('click', fullView);
        }
    });
}







window.addEventListener("DOMContentLoaded", () => {

    // 'profiles', 'activeProfileID', 'blackList', 'delays'
    chrome.storage.local.get(
        ['allProfile'],
        async (data) => {
            console.log('dataready', data.allProfile[0])
            // var dynamic = document.querySelector('.cardsdom')
            // al

        }
    );
});