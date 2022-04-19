let expression= '';

String.prototype.toSqrt= function(){
    return toSqrt(this);
}

String.prototype.toPow= function(){
    return toPow(this)
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
    return param.replace(/P/, '&pi;').replace(/R/g, '&radic;')
}

/**
 * 
 * @param {String} param 
 * @returns {String} A valid JS expression that gonna be available to use in the JS function eval()
 */
function toJs(param){
    return param.toPow().toSqrt().replace('P', 'Math.PI');
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
    let masque= /[*\/%]/;
    expression+= ((param!='(') && (param!=')') && (param.search(masque)!=-1) && (isNaN(expression[expression.length-1])))?`0${param}`:param;
    showExpression();
}

/**
 * 
 * @param {String} param
 * @returns {String} Return a string where all "^" are replaced with the JS function Math.pow() 
 */
function toPow(param){
    if (param.search(/\^/)!=-1) {
        let jsPowExpression= '';
    
        const regexToGetnbr= /(\w?\.?\w+\(.+\))(?=\^)|(\(.+\))+(?=\^)|([^,\^*\/+\-\(\)]+)(?=\^)/;
        let nbr= regexToGetnbr.exec(param);
    
        const regexToGetExp= new RegExp(`(?<=${toRegExp(nbr[0])}\\^)\\(([^,]*)\\)+|(?<=${toRegExp(nbr[0])}\\^)([^,\\^\\*\\/\\+\\-\\(\\)]*)`)
        let exposant= regexToGetExp.exec(param);
        
        nbr[1]= (nbr[1]==undefined)? nbr[2] : nbr[1];
        exposant[1]= (exposant[1]==undefined)? exposant[2] : exposant[1];
        
        jsPowExpression= `(Math.pow(${nbr[1]}, ${exposant[1]}))`;
        
        param= param.replace(`${nbr[0]}^${exposant[0]}`, jsPowExpression);
        console.log(param);
        param= toPow(param);
    }
    return param;
}

function toSqrt(param){
    if(param.search(/R/)!=-1){
        const regexToGetContenu= /(?<=R\()(.*)(?=\))|(?<=R\()([A-Z]\({1}.*\){1})(?=\))/;
        const contenu= regexToGetContenu.exec(param)

        contenu[1]= (contenu[1]==undefined) ? contenu[2] : contenu[1];

        param= param.replace(`R(${contenu[0]})`, `Math.sqrt(${contenu[1]})`);
        console.log(param);
        param= toSqrt(param);
    }

    return param;
}