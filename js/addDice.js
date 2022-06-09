


function diceRoll(){
    let output = Math.floor((Math.random() * 6) + 1);
    return output;
}



function addDiceValue(value, diceElement){
    diceElement.textContent = value;
}

//roll has [D1, D2] or [SUM]
//IF D1 OR D2 selected
//Remove SUM
//ALSO REMOVE ANY OTHER D1 OR D2 (selection)
//highlightchips again

//highlight chips happens after roll and after selection based on what's in possible moves


class Turn {
    constructor(diceRolls) {
        this.diceOne = diceRolls[0];
        this.diceTwo = diceRolls[1];
        this.total = this.diceOne + this.diceTwo;
        this.used = [];
        this.possible = [this.diceOne, this.diceTwo, this.total];
    }
    removePossible(value){
        //let newUsed = this.possible.pop(value);
        let indexValue = this.possible.indexOf(parseInt(value));
        if (value == this.total){
            this.used = this.possible;
            this.possible = [];
        } else {
            this.possible.splice(indexValue, 1);
            this.possible.pop();
            //this.used.push(newUsed);
            //console.log("end possibilities: " + this.possible);
        }
        

    }
}



//need to limit this to numberSections
//

//DO NOT HIGHLIGHT ONE/TWO IF ONLY MAX IS AVAILABLE
//IN ORDER TO HIGHLIGHT ONE OF THE DICE, BOTH HAVE TO BE AVAILABLE (UNLESS ONLY TWO LEFT)
//Something is going wrong when only a lower number remains, but so does total on turnside - 
//diceOne Found - diceTwo NOT - max Found

function highlightChips(turnObject, turn){
    let possibleMoves = turnObject.possible;
    let opponent = oppositeTurn(turn);
    let opponentSection = opponent + "numberSection";
    let section = turn + "numberSection";
    //let ownSection = document.getElementById(section);
    //let opponentPieces = document.getElementById(opponentSection);
    let opponentButtons = document.getElementById(opponentSection).querySelectorAll('.numberIcon');
    let oppButts = Array.from(opponentButtons);
    let ownButtons = document.getElementById(section).querySelectorAll('.numberIcon');
    let ownButts = Array.from(ownButtons);
    let allButtons = [oppButts,ownButts].flat();
    let lengthOwn = ownButts.length;
    let tempArray = []
    let numArray = []
    allButtons.forEach((numberIcon) => {
        if(numberIcon.classList.contains("selected")){
            numberIcon.classList.remove("selected");
            }
        if (numberIcon.textContent == possibleMoves[0] || numberIcon.textContent == possibleMoves[1] || numberIcon.textContent == possibleMoves[2]) {
            if (numberIcon.id.slice(0,2) != turn && numberIcon.classList.contains("flipped")) {
                //console.log("didn't include " + numberIcon.id)
            } else if (turnObject.lastSelected == numberIcon.id){
                //not using last one used during this turn...
            } 
            
            else {
                tempArray.push(numberIcon);
                numArray.push(numberIcon.textContent)
                //numberIcon.classList.add("selected")
            }
        }
    });
    let diceOneFound = false;
    let diceTwoFound = false;
    let maxFound = false;

    for (i=0;i<tempArray.length;i++){
        if (parseInt(tempArray[i].textContent) == turnObject.diceOne){
            diceOneFound = true;
        }
        if (parseInt(tempArray[i].textContent) == turnObject.diceTwo){
            diceTwoFound = true;
        } 
        if (parseInt(tempArray[i].textContent) == turnObject.total) {
            maxFound = true;
        }
    }
    if (lengthOwn > 2) {
        console.log("diceOneFound: " + diceOneFound);
        console.log("diceTwoFound: " + diceTwoFound);
        console.log("maxFound: " + maxFound);
        console.log("possible moves length: " + possibleMoves.length);
        console.log("diceOne:" + turnObject.diceOne);
        console.log("diceTwo: " + turnObject.diceTwo);
        console.log("temparray: " + tempArray);
        console.log("numberArray: " + numArray);
        console.log("temparray filter dice one: " + numArray.filter(item => item == turnObject.diceOne).length);
        console.log("temparray filter dice two: " + numArray.filter(item => item == turnObject.diceTwo).length);


        if ((diceOneFound == false || diceTwoFound == false) && maxFound == false && possibleMoves.length > 1 && turnObject.diceOne != turnObject.diceTwo) {
            console.log("Not possible")
        } else if (turnObject.diceOne == turnObject.diceTwo && numArray.filter(item => item == turnObject.diceOne).length <= 1 && numArray.filter(item => item == turnObject.diceTwo).length <=1 && possibleMoves.length > 1 && maxFound == false) {
            console.log("NO POSSIBLE SELECTIONS");
        } else if (((diceOneFound && numArray.filter(item=> item == turnObject.diceOne).length <=1) || (diceTwoFound && numArray.filter(item=> item == turnObject.diceTwo).length <=1)) && maxFound && turnObject.diceOne == turnObject.diceTwo && possibleMoves.length > 1){
            console.log("case 2");
            for (i=0;i<tempArray.length;i++){
                console.log(parseInt(tempArray[i].textContent))
                if (parseInt(tempArray[i].textContent) == turnObject.total){
                    tempArray[i].classList.add("selected");
                }
            }
        } else if ((diceOneFound == false && maxFound && diceTwoFound) || (diceOneFound && maxFound && diceTwoFound == false) ){
            console.log("case 3");
            for (i=0;i<tempArray.length;i++){
                console.log(parseInt(tempArray[i].textContent))
                if (parseInt(tempArray[i].textContent) == turnObject.total){
                    tempArray[i].classList.add("selected");
                }
            }
        } else {
            console.log("case catch")
            for (i=0;i<tempArray.length;i++){
                tempArray[i].classList.add("selected");
            }
        }
    } else {
        console.log("fewer than 2 turns")
        if (diceOneFound == true || diceTwoFound == true || maxFound == true) {
            for (i=0;i<tempArray.length;i++){
                tempArray[i].classList.add("selected");
            }
        }
    }

}

function rollBothDice(){
    let diceOne = document.getElementById("dice1");
    let diceTwo = document.getElementById("dice2");
    let diceRollOne = diceRoll();
    let diceRollTwo = diceRoll();
    let diceArea = document.getElementById("dice-area");
    while(diceArea.firstChild){
        diceArea.removeChild(diceArea.firstChild);
    }
    addDiceValue(diceRollOne, diceOne);
    addDiceValue(diceRollTwo, diceTwo);
    diceArea.appendChild(diceOne);
    diceArea.appendChild(diceTwo);
    let diceRolled = [diceRollOne, diceRollTwo];
    return diceRolled;
}

function getTurn(){
    let turnIndicator = document.getElementById("turnIndicator");
    if (turnIndicator.textContent == "It's Player 1's Turn"){
        return ("p1")
    } else {
        return ("p2")
    }
}

function changeTurn(){
    let turn = getTurn();
    let pOneBackground = document.getElementById("p1numberSection");
    let pTwoBackground = document.getElementById("p2numberSection");
    let turnIndicator = document.getElementById("turnIndicator");
    if (turn == "p1"){
        turnIndicator.textContent = "It's Player 2's Turn";
        pOneBackground.classList.remove("currentTurnp1");
        pTwoBackground.classList.add("currentTurnp2")
    } else {
        turnIndicator.textContent = "It's Player 1's Turn";
        pTwoBackground.classList.remove("currentTurnp2");
        pOneBackground.classList.add("currentTurnp1")
    }
    let numbers = document.querySelectorAll(".numberIcon");
    numbers.forEach((numberIcon) => {
        numberIcon.classList.remove("selected");
    });
}

//validation happens here?
function flipOrMove(playerChoice,turnObject){
    turn = getTurn();
    let curChip = document.getElementById(playerChoice);
    if (playerChoice.includes(turn)){
        if (curChip.classList.value.includes("flipped")) {
            if(flipBack(playerChoice)){
                turnObject.removePossible(curChip.textContent);
                turnObject.lastSelected = playerChoice;
            };
        } else {
            if(moveToCenter(playerChoice)){
                turnObject.removePossible(curChip.textContent);
            };
        }
    } else if (!playerChoice.includes(turn) && !curChip.classList.value.includes("flipped")){
        if (flipChip(playerChoice)){
            turnObject.removePossible(curChip.textContent);
        }
    }
    highlightChips(turnObject, getTurn());
    
}   


//keeping validation out of this.. just move
function moveToCenter(playerChoice){
    let turn = getTurn();
    let curChip = document.getElementById(playerChoice);
    let bettingSection = document.getElementById("bet-chips-area");
    let section = turn + "numberSection";
    let newSection = document.getElementById(section);
    if (curChip.classList.value.includes("selected")){
        curChip.classList.remove("selected");
        newSection.removeChild(curChip);
        bettingSection.appendChild(curChip);
        return true;
    }
    return false;

}


function flipBack(playerChoice){
    let turn = getTurn();
    let rightside = "rightSideUp" + turn;
    let flipped = "flipped" + turn;
    let curChip = document.getElementById(playerChoice);
    if (curChip.classList.value.includes("flipped") && curChip.id.slice(0,2) == turn && curChip.classList.value.includes("selected")) {
        curChip.classList.remove("flipped");
        curChip.classList.remove(flipped);
        curChip.classList.add("rightSideUp");
        curChip.classList.add(rightside);
        curChip.classList.remove("selected");
        return true;
    }
    return false;
}

function oppositeTurn(turn){
    turn = turn.slice(1);
    if (turn == "1") {
        return "p2"
    } else {
        return "p1"
    }
}

//updating this to flip only opponents chips
function flipChip(playerChoice){
    let turn = getTurn();
    let opponent = oppositeTurn(turn);
    let curChip = document.getElementById(playerChoice);
    let rightside = "rightSideUp" + opponent;
    let flipped = "flipped" + opponent;
    if (curChip.classList.value.includes("rightSideUp") && !curChip.id.includes(turn) && curChip.classList.value.includes("selected")) {
        curChip.classList.remove("rightSideUp");
        curChip.classList.remove(rightside);
        curChip.classList.add("flipped");
        curChip.classList.add(flipped);
        curChip.classList.remove("selected");
        return true;
    }
    return false;
}

function bankchips() {
    let bettingSection = document.getElementById("bet-chips-area");
    while (bettingSection.firstChild) {
        bettingSection.removeChild(bettingSection.firstChild);
    }
    changeTurn();
}

function sortNumberIcons(arrayOfNumberIcons){
    let tempArray = Array.from(arrayOfNumberIcons);
    let numbersOnly = [];
    let newArray = [];
    for (i=0;i<tempArray.length;i++){
        numbersOnly.push(tempArray[i].textContent);
    }
    numbersOnly.sort();
    return numbersOnly;
}

function sortSection(section, sortedArray, numberArray){
    let playerArea = document.getElementById(section);
    while (playerArea.firstChild){
        playerArea.removeChild(playerArea.firstChild);
    };
    let newNumberArray = Array.from(numberArray);
    console.log(newNumberArray);
    for (i=0; i<sortedArray.length; i++) {
        console.log("sortedArray i : " + parseInt(sortedArray[i]));
        for(n=0;n<newNumberArray.length;n++){
            console.log("numberArray: " + newNumberArray[n]);
            if(sortedArray[i] == newNumberArray[n].textContent){
                playerArea.appendChild(newNumberArray[n]);
            }
        }
    }
}

//ADD A SORT OR RESTRICT CHIPS TO CERTAIN ZONES
function busted() {
    console.log("BUStED");
    let turn = getTurn();
    let bettingSection = document.getElementById("bet-chips-area");
    let section = turn + "numberSection"
    let playerArea = document.getElementById(section);
    while (bettingSection.firstChild) {
        test = bettingSection.firstChild;
        bettingSection.removeChild(test);
        playerArea.appendChild(test);
    };
    let allNumbers = playerArea.querySelectorAll('.numberIcon');
    let sortedNumbers = sortNumberIcons(allNumbers);
    sortSection(section, sortedNumbers, allNumbers);
    changeTurn();
}

function roll(){
    let results = rollBothDice();
    return results;

    //track combined, or both
    //if neither, end turn
}



//roll button cannot be found.  
//Trying to move away from onClick since I can't store already used guesses
function turn(){

    //changeTurn();
    
    //both dice, or combine
    //bank or roll
    //if no possible move back
}
//turn();


//Need to define a turn
//need to determine when turn ends
//need to limit selectable tiles (turn and flipped classes)
    //selectable array?
//add to middle vs flip chips - turn based and ONLY SELECTABLE CHIPS
//unflip own
//two left on turn == only one dice has to be used
//diceroll has parameters, diceone, dicetwo, total. either both diceone AND dicetwo have to be used OR total





