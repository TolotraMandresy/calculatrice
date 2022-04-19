let expression= '';

String.prototype.toSqrt= function(){
    let res= this;
    if(this.search(/R/)!=-1){
        const regexToGetContenu= /(?<=R\()(.*)(?=\))|(?<=R\()([A-Z]\({1}.*\){1})(?=\))/;
        const contenu= regexToGetContenu.exec(this)

        contenu[1]= (contenu[1]==undefined) ? contenu[2] : contenu[1];

        res= res.replace(`R(${contenu[0]})`, `Math.sqrt(${contenu[1]})`);
        console.log(res);
        res= res.toSqrt();
    }

    return res;
}

String.prototype.toPow= function(){
    let res= this;
    if (res.search(/\^/)!=-1) {
        let jsPowExpression= '';
    
        const regexToGetnbr= /(\w*\.?\w+\(.+\)|[^,\^*\/+\-\(\)]+|\(.+\))(?=\^)/;
        let nbr= regexToGetnbr.exec(res);
        
        // console.log(nbr);
        
        const regexToGetExp= new RegExp(`(?<=${toRegExp(nbr[0])}\\^)\\(([^,]*)\\)+|(?<=${toRegExp(nbr[0])}\\^)([^,\\^\\*\\/\\+\\-\\(\\)]*)`)
        let exposant= regexToGetExp.exec(res);
        
        nbr[1]= (nbr[1]==undefined)? nbr[2] : nbr[1];
        exposant[1]= (exposant[1]==undefined)? exposant[2] : exposant[1];
        
        jsPowExpression= `(Math.pow(${nbr[1]}, ${exposant[1]}))`;
        
        // console.log(exposant);
        
        res= res.replace(`${nbr[0]}^${exposant[0]}`, jsPowExpression);
        
        // console.log(res);
        
        res= res.toPow();
    }
    return res;
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
    return param.replace(/P/g, '&pi;')
                .replace(/R/g, '&radic;')
                .replace(/S/g, 'sin')
                .replace(/C/g, 'cos')
                .replace(/T/g, 'tan')
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
    expression= expression.slice(0, expression.length-1);
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