const sleepwm = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
};


const waitForAddToCart = async (profile) => {
    console.log('here')
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        // const elem = document.getElementsByClassName('sqs-add-to-cart-button sqs-suppress-edit-mode');
        const elem = document.querySelector('button[type="submit"]');
        // alert('i am')
        if (!elem) {
            alert('he')
            // console.log('here')
            return;
        }

        self.disconnect();

        await sleepwm(500);
        elem.click();



    });

    shippingObserver.observe(document, { childList: true, subtree: true });
};

const route = async (path, profile) => {
    // alert('dadsa')
    waitForAddToCart(profile)
    // waitForCheckOutButton(profile);
    // waitforEmailconfirm(profile);
    // waitforPaymentDiscount(profile);
    // waitForReview(profile);


};




window.addEventListener('DOMContentLoaded', () => {
    alert('here')
    let profile = {
        'Enabled': true,

        'Email': "talhabutt123@gmail.com",

        'FirstName': "test", 'LastName': "testlastname", 'FullName': "testfullname",

        'Address': "zb-179 street 9 ", 'Address2': "apprt 2",
        'City': "rpw", 'State': "arkansas", 'Country': "US", 'PostalCode': "46000", 'PhoneNumber': "4600054",

        'CardName': "mastercard", 'CardType': "visa", 'CardNumber': "4242424242424242",
        'CardExpirationDate': "04/26", 'CardExpirationMonth': "04", 'CardExpirationYear2D': "26", 'CardExpirationYear4D': "2026",
        'CardCVC': "456",

        'Email': "ybuyy004@gmail.com", 'Twitter': "test4real", 'Discord': "car#4666", 'Instagram': "test4instagram",

        'userkey': "45682", 'Name': "testname", 'WebhookEnabled': true, 'Webhook': "this is my url",

        'ShoeSize': "M"
    }


    if (!profile.Enabled) {
        return false;
    }






    route(window.location.href, profile);


});