/**
 * todo: tkn crééna ngamba le fonction S(), C(), sns fa tsy remplacéna le anatinle var "expression"
 * todo: implementéna le ANS
 */

let expression = '';
let posCursor = 0;

function toHuman(param) {
    return param.replace(/P(?![a-b])/g, '&pi;').replace(/R(?![a-b])/g, '&radic;').replace(/S(?![a-b])/g, 'sin').replace(/C(?![a-b])/g, 'cos').replace(/T(?![a-b])/g, 'tan')
}

/**
 * 
 * @param {String} param 
 * @returns {String} A valid JS expression that gonna be available to use in the JS function eval()
 */
function toJs(param) {
    return param.toPow().toSqrt().toFact().toSin().toCos().toTan().replace('P', 'Math.PI');
}

function cursorToLeft(pas=1){
    posCursor= (posCursor<=0)? 0 : posCursor-pas;
    showExpression();
}

function cursorToRight(pas=1){
    posCursor= (posCursor>=expression.length)? posCursor : posCursor+pas;
    showExpression();
}

function showExpression() {
    const beforeCursor = expression.slice(0, posCursor);
    const afterCursor = expression.slice(posCursor);
    document.getElementById('expression').innerHTML = toHuman(beforeCursor) + '<span id="pos">|</span>' + toHuman(afterCursor);
}

function getResult() {
    let resultat = (expression == '') ? 0 : eval(toJs(expression));
    document.getElementById('resultat').innerText = resultat;
}

function clrScr() {
    expression = '';
    posCursor= 0;
    showExpression() & getResult();
}

function del() {
    let beforeCursor = expression.slice(0, posCursor);
    const afterCursor = expression.slice(posCursor);
    const deleteElLength= (beforeCursor.search(/[A-Z]\($/) != -1) ? 2 : 1;
    beforeCursor= beforeCursor.slice(0, beforeCursor.length - deleteElLength);
    expression = beforeCursor + afterCursor;
    cursorToLeft(deleteElLength);
    console.log(posCursor);
}

function insert(param) {
    const beforeCursor = expression.slice(0, posCursor);
    const afterCursor = expression.slice(posCursor);
    expression= beforeCursor + param + afterCursor;
    cursorToRight(param.length);
}

function fact(nbr) {
    let res = 1;

    while (nbr > 0)
        res *= nbr--;

    return res;
}




//-------------LOGIQUE-------------//


/**
 * 
 * @param {String} param 
 * @returns {String} The returned value isn't a regexp but a String that could be used without any problem inside the RegExp() constructor
 */
function toRegExp(param) {
    param = param.split(/([\^\.\(\)\+\*])/)
    for (let i = 0; i < param.length - 1; i++)
        param[i] += (param[i + 1].search(/[\^\.\(\)\+\*]/) != -1) ? '\\' : '';
    return param.join('');
}

String.prototype.toPow = function () {
    let res = this;
    if (res.search(/\^/) != -1) {
        let jsPowExpression = '';

        const regexToGetNbr = /([^,\^*\/+\-\(\)]+|\w*\.?\w+\(.+\)|(?<=[%*\/+\-\(]|)\(.+\))(?=\^)/;
        let nbr = regexToGetNbr.exec(res);

        const regexToGetExp = new RegExp(`(?<=${toRegExp(nbr[0])}\\^)\\(([^,]*)\\)+|(?<=${toRegExp(nbr[0])}\\^)([^,\\^\\*\\/\\+\\-\\(\\)]*)`)
        let exposant = regexToGetExp.exec(res);

        nbr[1] = (nbr[1] == undefined) ? nbr[2] : nbr[1];
        exposant[1] = (exposant[1] == undefined) ? exposant[2] : exposant[1];

        jsPowExpression = `Math.pow(${nbr[1]}, ${exposant[1]})`;

        // console.log(nbr);
        // console.log(exposant);

        res = res.replace(`${nbr[1]}^${exposant[0]}`, jsPowExpression);

        res = res.toPow();
    }
    return res;
}


String.prototype.toFact = function () {
    let res = this;
    if (res.search(/!/) != -1) {
        const regexFact = /(\w*\.?\w+\(.+\)|[^,\^*\/+\-\(\)]+|\(.+\))(?=\!)/;
        const nbr = regexFact.exec(res);

        res = res.replace(`${nbr[0]}!`, `fact(${nbr[0]})`)
        res = res.toFact();
    }

    return res;
}

String.prototype.toSqrt = function () {
    return this.replace(/R(?![a-b])\(/g, 'Math.sqrt(');
}

String.prototype.toSin = function () {
    return this.replace(/S(?![a-b])\(/g, 'Math.sin(')
}

String.prototype.toCos = function () {
    return this.replace(/C(?![a-b])\(/g, 'Math.cos(')
}

String.prototype.toTan = function () {
    return this.replace(/T(?![a-b])\(/g, 'Math.tan(')
}