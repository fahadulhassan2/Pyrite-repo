const regexExpsBasic = {
    Discord: new RegExp("d-?[i1!]-?[s5$]-?c-?[o0]-?r-?d|#[0-9]{4}", "i"),
    Twitter: new RegExp("[t7]w[i1!]tt[e3]r", "i"),
    Instagram: new RegExp("[i1!]n[s5$][t7][a4]gr[a4]m", "i"),
    Group: new RegExp("(cook )?group", "i"),
    FullName: new RegExp("^name|full.*name|your.*name|customer.*name|bill.*name|ship.*name|name.*first.*last|firstandlastname|first.*last.*name", "i"),
    FirstName: new RegExp("first.*name|initials|fname|first$|given.*name", "i"),
    LastName: new RegExp("last.*name|lname|surname|last$|secondname|family.*name", "i"),
    Address: new RegExp("^address$|ship.*address|bill.*address(\s*1|$)|address[_-]?\\s*line(\\s*1|\\s*one)?|address\\s*1|addr\\s*1|street", "i"),
    Address2: new RegExp("address[_-]?line(2|two)|address.*2|addr2|street.*(?:#|no|num|nr)|suite|unit|apt|apartment", "i"),
    City: new RegExp("city|town", "i"),
    State: new RegExp("(?<!(united|hist|history).?)state|county|region|province", "i"),
    Country: new RegExp("country|countries", "i"),
    PostalCode: new RegExp("zip|postal|post.*code|pcode", "i"),
    Email: new RegExp("e.?mail|google\\s+account|g-?m-?[a4]-?[i1!]-?[l1!]", "i"),
    PhoneNumber: new RegExp("phone|mobile|contact.?number|^tel", "i"),
    CardType: new RegExp("(credit)?card.*type", "i"),
    CardName: new RegExp("card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card", "i"),
    CardNumber: new RegExp("(add)?(?:card|cc|acct).?(?:number|#|no|num|field)|carn|credit.*?card.*?cnb", "i"),
    CardCVC: new RegExp("verification|card.?identification|security.?code|card.?code"
    + "|security.?value"
    + "|security.?number|card.?pin|c-v-v"
    + "|(cvn|cvv|cvc|csc|cvd|cid|ccv)(field)?"
    + "|\\bcid\\b", "i"),
    CardExpirationMonth: new RegExp("exp.*mo|ccmonth|card.?month|addmonth", "i"),
    CardExpirationYear: new RegExp("(?:exp|payment|card).*(?:year|yr)", "i"),
    CardExpirationDate: new RegExp("expir|exp.*date|^expfield$", "i"),
    Food: new RegExp("\\beat\\b|food|lunch|dinner|breakfast", "i"),
    Animal: new RegExp("pet|animal", "i"),
    ShoeSize: new RegExp("(shoe|sneaker) size", "i")
};
const regexExpsBasicKeys = Object.keys(regexExpsBasic);
const regexExpsOther = {
    Equation: new RegExp("[\\d\\.\\[\\]\\(\\)\\{\\}\\-\\+\\*\\/x\\=]+", "i"),
    Bot: new RegExp("[b8][o0][t7]", "i"),
    Human: new RegExp("hum[a4]n", "i"),
    Inhuman: new RegExp("[i1!]nhum[a4]n", "i"),
    Not: new RegExp("n[o0][t7]", "i"),
    Yes: new RegExp("y[e3][s5$]|yep|yeah", "i"),
    No: new RegExp("n[o0]|nay|nope|negative|nada", "i"),
}
const regexExps = {...regexExpsBasic, ...regexExpsOther};

const wordNumberMapTens = {
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
};

const wordNumberMapDigits = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9
};

const wordNumberMapOther = {
    'zero': 0, 'nought': 0, 'ten': 10, 'eleven': 11, 'twelve': 12,
    'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
    'seventeen': 17, 'eighteen': 18, 'nineteen': 19
};

// generate tens and digits combos e.g twenty one
let wordNumberMapTensAndDigits = {};
Object.keys(wordNumberMapTens).forEach(tensWord => {
    Object.keys(wordNumberMapDigits).forEach(digitsWord => {
        const sum = wordNumberMapTens[tensWord] + wordNumberMapDigits[digitsWord];
        wordNumberMapTensAndDigits[`${tensWord} ${digitsWord}`] = sum;
        wordNumberMapTensAndDigits[`${tensWord}-${digitsWord}`] = sum;
    });
});

// merge into one object, digits must be last to avoid partial matches
const wordNumberMap = {...wordNumberMapTensAndDigits, ...wordNumberMapTens, ...wordNumberMapOther, ...wordNumberMapDigits};

let wordNumberMapRegExps = {};
Object.keys(wordNumberMap).forEach(word => {
    wordNumberMapRegExps[word] = new RegExp(`\\b${word}\\b`, 'g');
});

const interpretHumanityQuestion = (question) => {
    // determine what the question is asking, are they asking if we are human or bot
    // make sure not to fall for "not human" or "inhuman" or "not bot"
    const askingIfHumanDirect = regexExps.Human.test(question) && !regexExps.Inhuman.test(question) && !regexExps.Not.test(question);
    const askingIfHumanNegated = regexExps.Bot.test(question) && regexExps.Not.test(question);

    const askingIf = askingIfHumanDirect || askingIfHumanNegated ? 'Human' : 'Bot';
    console.log(question, askingIfHumanDirect, askingIfHumanNegated, askingIf);
    return askingIf;
};

const parseMath = (labelRaw, requireOperator = false) => {
    let label = labelRaw.toLowerCase();

    // replace words with numbers
    Object.keys(wordNumberMapRegExps).forEach(word => {
        label = label.replace(wordNumberMapRegExps[word], wordNumberMap[word]);
    });

    label = label
        .replace(/&#39;/g, '')
        .replace(/x|times|multiplied by|×/g, '*')
        .replace(/added to|plus|add/g, '+')
        .replace(/minus|less|subtracted from|−/g, '-')
        .replace(/divided by|over|÷/g, '/')
        .replace(/half (?:of )?([0-9]+)/g, '$1/2')
        .replace(/third (?:of )?([0-9]+)/g, '$1/3')
        .replace(/quarter (?:of )?([0-9]+)/g, '$1/4')
        .replace(/([0-9]+) doubled/g, '$1*2')
        .replace(/([0-9]+)\/([0-9]+) of ([0-9]+)/g, '$3/$2*$1') // fractions
        .replace(/(?:square )?root of ([0-9]+)/g, '√$1') // map to sqrt symbol for easier matching
        .replace(/([0-9]+)(?: percent|%) of ([0-9]+)/g, '($2/100)*$1')
        .replace(/square of ([0-9]+)/g, '$1*$1')
        .replace(/([0-9]+) squared/g, '$1*$1')
        .replace(/([{[])/g, '(') // replace alt parentheses
        .replace(/([}\]])/g, ')') // replace alt parentheses
        .replace(/\s/g, ''); // strip whitespace

    let containsOperator = /[+*√\-\^\/]/.test(label);
    if ( requireOperator && !containsOperator ) {
        return false;
    }

    // extract the equation - needs at least 2 chars for it to be valid pretty sure
    let eq = label.match(/[0-9.+*√()\-\^\/]{2,}/);
    if ( eq ) {
        eq = eq[0]
            .replace(/√([0-9]+)/g, 'Math.sqrt($1)') // map sqrt to function main
            .replace(/([0-9]+)\^([0-9]+)/g, 'Math.pow($1,$2)'); // map pow to function (^ is XOR)

        try {
            // eq eval stuff
            const result = eval(eq);
            console.log(`${labelRaw} -> ${eq} = ${result}`);
            return result;
        } catch(Exception) {
            console.log(`could not eval eq "${eq}" from label "${label}"`);
        }
    } else {
        console.log(`could not parse label "${label}"`);
    }

    return null;
};