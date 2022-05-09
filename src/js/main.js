/**
 * todo: tkn crééna ngamba le fonction S(), C(), sns fa tsy remplacéna le anatinle var "expression"
 */

let expression= '';

String.prototype.toPow= function(){
    let res= this;
    if (res.search(/\^/)!=-1) {
        let jsPowExpression= '';
    
        const regexToGetNbr= /([^,\^*\/+\-\(\)]+|\w*\.?\w+\(.+\)|(?<=[%*\/+\-\(]|)\(.+\))(?=\^)/;
        let nbr= regexToGetNbr.exec(res);
        
        const regexToGetExp= new RegExp(`(?<=${toRegExp(nbr[0])}\\^)\\(([^,]*)\\)+|(?<=${toRegExp(nbr[0])}\\^)([^,\\^\\*\\/\\+\\-\\(\\)]*)`)
        let exposant= regexToGetExp.exec(res);

        nbr[1]= (nbr[1]==undefined)? nbr[2] : nbr[1];        
        exposant[1]= (exposant[1]==undefined)? exposant[2] : exposant[1];
        
        jsPowExpression= `Math.pow(${nbr[1]}, ${exposant[1]})`;
        
        // console.log(nbr);
        // console.log(exposant);
        
        res= res.replace(`${nbr[1]}^${exposant[0]}`, jsPowExpression);
        
        // console.log(res);
        
        res= res.toPow();
    }
    return res;
}

String.prototype.toSqrt= function(){
    return this.replace(/R\(/g, 'Math.sqrt(');
}

String.prototype.toFact= function(){
    let res= this;
    if(res.search(/!/)!=-1){
        const regexFact= /(\w*\.?\w+\(.+\)|[^,\^*\/+\-\(\)]+|\(.+\))(?=\!)/;
        const nbr= regexFact.exec(res);

        res= res.replace(`${nbr[0]}!`, `fact(${nbr[0]})`)
        res= res.toFact();
    }

    return res;
}

String.prototype.toSin= function(){
    return this.replace(/S\(/g, 'Math.sin(')
}

String.prototype.toCos= function(){
    return this.replace(/C\(/g, 'Math.cos(')
}

String.prototype.toTan= function(){
    return this.replace(/T\(/g, 'Math.tan(')
}

/**
 * 
 * @param {String} param 
 * @returns {String} The returned value isn't a regexp but a String that could be used without any problem inside the RegExp() constructor
 */
function toRegExp(param){
    param= param.split(/([\^\.\(\)\+\*])/)
    for(let i=0; i<param.length-1; i++)
        param[i]+= (param[i+1].search(/[\^\.\(\)\+\*]/)!=-1) ? '\\' :'';
    return param.join('');
}

function toHuman(param){
    return param.replace(/P/g, '&pi;').replace(/R/g, '&radic;').replace(/S/g, 'sin').replace(/C/g, 'cos').replace(/T/g, 'tan')
}

/**
 * 
 * @param {String} param 
 * @returns {String} A valid JS expression that gonna be available to use in the JS function eval()
 */
function toJs(param){
    return param.toPow().toSqrt().toFact().toSin().toCos().toTan().replace('P', 'Math.PI');
}

function showExpression(){
    document.getElementById('expression').innerHTML= (expression) ? toHuman(expression) : '&nbsp;';
}

function getResult(reinitialize= false){
    let resultat= ((expression=='')||reinitialize) ? 0 : eval(toJs(expression));
    document.getElementById('resultat').innerHTML= resultat;
}

function clrScr(){
    expression='';
    showExpression();
    getResult(true);
}

function del(){
    expression= (expression.search(/[A-Z]\($/)!=-1) ? expression.slice(0, expression.length-2) : expression.slice(0, expression.length-1);
    showExpression();
}

function insert(param){
    expression+= param;
    showExpression();
}

function fact(nbr){
    let res= 1;

    while(nbr>0)
        res*= nbr--;

    return res;
}