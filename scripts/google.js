const cardTypeMap = {
    'visa': ['Visa'],
    'master': ['Mastercard'],
    'american_express': ['American Express', 'AMEX'],
    'solo': ['Solo'],
    'discover': ['Discover']
};

let fieldsFilled = 0;
let startTime;

const getLabel = (field) => {
    let label = null;
    if (field.getAttribute('aria-labelledby')) {
        label = document.getElementById(field.getAttribute('aria-labelledby')).firstChild.nodeValue.toLowerCase();
    } else if (field.getAttribute('aria-label')) {
        label = field.getAttribute('aria-label').toLowerCase();
    }

    return label;
};

const fillGoogle = (el, value) => {
    if (!el) {
        return;
    }

    el.dispatchEvent(new Event('focus', { bubbles: true }));

    el.value = value;
    el.setAttribute('value', value);

    el.dispatchEvent(new Event('input', { bubbles: true }));

    el.dispatchEvent(new Event('keydown', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('keyup', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));

    ++fieldsFilled;
};

let selectOptionQueued = [];

const selectOptionQueue = (selectOption, value) => {
    selectOptionQueued.push({ selectOption, value });
};

const selectOptionQueueExecute = async () => {
    for (let i = 0; i < selectOptionQueued.length; ++i) {
        await selectOption(selectOptionQueued[i].selectOption, selectOptionQueued[i].value);
    }

    console.log('selectOptionQueueExecute end');
};

const waitForElClass = async (el, className, negate = false) => {
    return await new Promise((resolve, reject) => {
        let matches = el.matches(`.${className}`);
        matches = negate ? !matches : matches;
        if (matches) {
            resolve();
            return;
        }

        const observer = new MutationObserver((mutations, self) => {
            let matches = el.matches(`.${className}`);
            matches = negate ? !matches : matches;
            if (!matches) {
                return;
            }

            self.disconnect();
            resolve();
        });
        observer.observe(el, { attributes: true });
    });
};

const waitForSelectEnabled = async (selectElement) => {
    return waitForElClass(selectElement, 'isDisabled', true);
};

const waitForOptionsPopupOpen = async (selectElement, value) => {
    return await new Promise((resolve, reject) => {
        const selectPopup = selectElement.querySelector('.exportSelectPopup');

        const observer = new MutationObserver(async (mutations, self) => {
            const selectOption = selectPopup.querySelector(`.quantumWizMenuPaperselectOption[data-value="${value}"]`);
            // wait for option to become visible
            const selectOpen = selectOption && selectOption.offsetParent;
            if (!selectOpen) {
                return;
            }
            self.disconnect();
            console.log('popup loaded');

            resolve(selectOption);
        });
        observer.observe(selectPopup, { childList: true, subtree: true });
    });
};

const waitForOptionSelected = async (selectOption) => {
    console.log('waitForOptionSelected');
    return waitForElClass(selectOption, 'isSelected');
};

const waitForOptionsPopupClose = async (selectElement) => {
    return await new Promise((resolve, reject) => {
        const selectPopup = selectElement.querySelector('.exportSelectPopup');

        const observer = new MutationObserver(async (mutations, self) => {
            if (selectPopup.style.display != 'none') {
                return;
            }
            self.disconnect();
            console.log('popup closed');

            resolve();
        });
        observer.observe(selectPopup, { attributes: true });
    });
};

const selectOption = async (selectOption, value) => {
    console.log('selectOption');

    return await new Promise(async (resolve, reject) => {
        const selectElement = selectOption.closest('.quantumWizMenuPaperselectEl');

        await waitForSelectEnabled(selectElement);
        selectOption.click();
        const popupOption = await waitForOptionsPopupOpen(selectElement, value);
        popupOption.click();
        console.log(`selecting option "${value}"`);
        await waitForOptionSelected(selectOption);
        await waitForOptionsPopupClose(selectElement);

        ++fieldsFilled;

        resolve();
    });
}

const processGroup = (fields, profile) => {
    for (let i = 0; i < fields.length; ++i) {
        processField(fields[i], profile);
    }
}

const processInputField = (field, profile) => {
    const label = getLabel(field);

    if (!label) {
        return;
    }

    for (let i = 0; i < regexExpsBasicKeys.length; ++i) {
        if (regexExpsBasic[regexExpsBasicKeys[i]].test(label)) {
            const value = Array.isArray(profile[regexExpsBasicKeys[i]]) ? profile[regexExpsBasicKeys[i]][0] : profile[regexExpsBasicKeys[i]];
            fillGoogle(field, value);
            return;
        }
    }

    if (regexExps.Human.test(label) || regexExps.Bot.test(label)) {
        const askingIf = interpretHumanityQuestion(label);
        fillGoogle(field, profile[askingIf]);
        return;
    }

    if (regexExps.Equation.test(label)) {
        fillGoogle(field, parseMath(label));
        return;
    }
};

const clickEl = (el) => {
    if (!el.matches('[aria-disabled]')) {
        el.click();
        ++fieldsFilled;
        return;
    }

    const observer = new MutationObserver((mutations, self) => {
        if (el.matches('[aria-disabled]')) {
            return;
        }
        self.disconnect();
        el.click();
        ++fieldsFilled;
    });
    observer.observe(el, { attributes: true });
};

const processOptionField = async (field, role, profile) => {
    // find the fields in this particular group
    let fields = [];
    if (role == 'listbox') {
        fields = field.querySelectorAll('.quantumWizMenuPaperselectOption:not(:first-child)');
    } else if (role == 'radiogroup') {
        fields = field.getElementsByClassName('appsMaterialWizToggleRadiogroupEl');
    } else if (role == 'checkbox') {
        /*
         * it's difficult to select a checkbox group because of poor HTML structure
         * so instead we just find the checkbox and then use that to work backwards
         * and get the group. would like to improve this in the future
         */
        role = 'checkboxgroup';
        // get the container element
        field = field.closest('div[role="list"]');
        // get checkboxes within the group
        fields = field.getElementsByClassName('quantumWizTogglePapercheckboxEl');

        // only process a checkbox group once
        if (field.dataset.lightningProcessed) {
            return;
        }
    }

    //const question = document.getElementById(field.getAttribute('aria-labelledby')).innerHTML.toLowerCase();
    const question = getLabel(field);
    if (!question) {
        console.log('no question');
        return;
    }

    // check if this is a basic field (non humanity related)
    let matchingBasicField = null;
    for (let i = 0; i < regexExpsBasicKeys.length; i++) {
        if (regexExpsBasic[regexExpsBasicKeys[i]].test(question)) {
            matchingBasicField = regexExpsBasicKeys[i];
            break;
        }
    }

    const isEquation = regexExps.Equation.test(question);
    let equationAnswer;
    if (isEquation) {
        equationAnswer = parseMath(question);
    }

    for (let i = 0; i < fields.length; ++i) {
        const value = fields[i].dataset.value ? fields[i].dataset.value : fields[i].getAttribute('aria-label');
        const valueLower = value.toLowerCase();

        if (matchingBasicField) {
            let profileValues = profile[matchingBasicField];
            if (!Array.isArray(profileValues)) {
                profileValues = [profileValues];
            }
            profileValues = profileValues.map(value => value.toLowerCase());

            if (profileValues.includes(valueLower)) {
                if (role == 'listbox') {
                    selectOptionQueue(fields[i], value);
                } else {
                    clickEl(fields[i]);
                }
                break;
            }

            continue;
        }

        // handle potentially humanity related questions
        // determine if it is a yes or no question
        const yesOrNoHumanityQuestion =
            (regexExps.Human.test(question) || regexExps.Bot.test(question)) &&
            (regexExps.Yes.test(valueLower) || regexExps.No.test(valueLower));

        //console.log('yesOrNoHumanityQuestion', question, yesOrNoHumanityQuestion, regexExps.Human.test(question), regexExps.Bot.test(question), regexExps.Yes.test(valueLower), regexExps.No.test(valueLower));
        // check if the current option is the one we want to choose
        let valueMatches;

        if (yesOrNoHumanityQuestion) {
            const askingIf = interpretHumanityQuestion(question);
            valueMatches = regexExps[profile[askingIf]].test(valueLower);
        }
        if (!valueMatches && isEquation) {
            valueMatches = equationAnswer == valueLower;
        }
        if (!valueMatches) {
            // otherwise we are just looking for a "human" option
            valueMatches = regexExps.Human.test(valueLower);
        }

        if (valueMatches) {
            if (role == 'listbox') {
                selectOptionQueue(fields[i], value);
            } else {
                clickEl(fields[i]);
            }
            break;
        }
    }

    field.dataset.lightningProcessed = true;
};

const processField = (field, profile) => {
    let role = field.getAttribute('role');

    if (!['listbox', 'radiogroup', 'checkbox'].includes(role)) {
        processInputField(field, profile);
    } else {
        processOptionField(field, role, profile);
    }
}

const patchProfile = (profile) => {
    profile.CardType = cardTypeMap[profile.CardType];
    profile.CardExpirationYear = [profile.CardExpirationYear2D, profile.CardExpirationYear4D];
    profile.Group = 'Lightning';
    profile.Food = 'Eggs';
    profile.Animal = 'Dog';
    profile.Bot = 'No';
    profile.Human = 'Yes';

    return profile;
};

const sendWebhook = (profile, took) => {
    if (fieldsFilled == 0) {
        return;
    }

    const productName = document.title;

    const productImage = 'https://www.gstatic.com/images/branding/product/2x/forms_48dp.png';

    let extraFields = [];
    if (!window.location.href.includes('/formResponse')) {
        const speed = took >= 1000 ? (took / 1000).toFixed(2) : took;

        extraFields = [
            { name: 'Inputs Filled', value: fieldsFilled, inline: true },
            { name: 'Fill Time', value: `${speed}${took >= 1000 ? 's' : 'ms'}`, inline: true }
        ];
    }

    if (profile.WebhookEnabled) {
        sendPrivate(productName, productImage, profile.Name, 'N/A', 'N/A', 'docs.google.com', profile.Webhook, 'Google Form', 'LightningATC Assisted! :handshake:', extraFields);
    }
    sendPublic(profile.userkey, productName, productImage, 'N/A', 'docs.google.com', 'Google Form', 'LightningATC Assisted! :handshake:', extraFields);
};

window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.href.includes('/edit')) {
        return;
    }

    chrome.storage.local.get(
        ['allProfile'],
        async (data) => {
            startTime = Date.now();
            let profile = data.allProfile[0]
            profile = patchProfile(profile);

            //process inputs
            processGroup(document.querySelectorAll('input:not([type="hidden"])'), profile);
            processGroup(document.querySelectorAll('textarea'), profile);
            processGroup(document.querySelectorAll('.appsMaterialWizToggleRadiogroupGroupContainer'), profile);
            processGroup(document.querySelectorAll('.quantumWizTogglePapercheckboxEl'), profile);
            processGroup(document.querySelectorAll('.quantumWizMenuPaperselectEl'), profile);

            await selectOptionQueueExecute();

            //window.scrollTo({top: 0});

            const button = document.querySelector('div.freebirdFormviewerViewNavigationNavControls div[role="button"].freebirdFormviewerViewNavigationSubmitButton');
            if (!button) {
                return;
            }

            const took = Date.now() - startTime;
            button.addEventListener('click', () => {
                // sendWebhook(profile, took);
            });

        }
    );







});