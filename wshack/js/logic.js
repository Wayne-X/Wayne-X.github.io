var dimension = 4;
var minlength = 2;

var board = [];
var words = [];


// autotab
$(document).ready(function(){
  $('.alpha').autotab('filter', { format: 'alpha', uppercase: true });
  $('#letter1').autotab({ format: 'letter', target: '#letter2' });
  $('#letter2').autotab({ format: 'letter', target: '#letter3', previous: '#letter1' });
  $('#letter3').autotab({ format: 'letter', target: '#letter4', previous: '#letter2' });
  $('#letter4').autotab({ format: 'letter', target: '#letter5', previous: '#letter3' });
  $('#letter5').autotab({ format: 'letter', target: '#letter6', previous: '#letter4' });
  $('#letter6').autotab({ format: 'letter', target: '#letter7', previous: '#letter5' });
  $('#letter7').autotab({ format: 'letter', target: '#letter8', previous: '#letter6' });
  $('#letter8').autotab({ format: 'letter', target: '#letter9', previous: '#letter7' });
  $('#letter9').autotab({ format: 'letter', target: '#letter10', previous: '#letter8' });
  $('#letter10').autotab({ format: 'letter', target: '#letter11', previous: '#letter9' });
  $('#letter11').autotab({ format: 'letter', target: '#letter12', previous: '#letter10' });
  $('#letter12').autotab({ format: 'letter', target: '#letter13', previous: '#letter11' });
  $('#letter13').autotab({ format: 'letter', target: '#letter14', previous: '#letter12' });
  $('#letter14').autotab({ format: 'letter', target: '#letter15', previous: '#letter13' });
  $('#letter15').autotab({ format: 'letter', target: '#letter16', previous: '#letter14' });
  $('#letter16').autotab({ format: 'letter', previous: '#letter15' });

  createDictionary();
});

function createDictionary(){
  // create dictionary
  jQuery.get('js/dictionary.txt', function(data) {
    words = data.split("\n");

    for (var i = 0; i < words.length; i++){
      words[i] = words[i].substring(0, words[i].length - 1);
    }
  });


}

// called from jquery.autotab.js when alpha input is clicked
function processAlphaClick(){
  var alpha = document.activeElement;
  alpha.value = '';
}

// called from jquery.autotab.js when character is entered into alpha input
function processKeyEntry(alphaInput){
  var input = alphaInput.value;
  if (!isAlphaInput(input)){
    alphaInput.value = '';
    return
  }

  if (input == 'Q'){
    alphaInput.value = 'Qu';
  }
}

function isAlphaInput(input){
  input = input.toUpperCase();
  for (var i = 0; i < input.length; i++){
    if (!isAlphaCharacter(input[i])){
      return false;
    }
  }
  return true;
}

function isAlphaCharacter(char){
  var alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < alphas.length; i++){
    if (char == alphas[i]){
      return true;
    }
  }
  return false;
}

function textEnter(){
  if (event.keyCode == 13){
    main();
  }
  return;
}

function main(){
  board = getTextInput();
  solve();
  sortSolutions();
  displaySolutions();
  document.getElementById('solutions_div').scrollIntoView();
}

function getTextInput(){
  var inputArray = [];
  for (var i = 1; i <= 16; i++){
    var rawInput = document.getElementById('letter' + String(i)).value.toLowerCase();
    inputArray.push(rawInput);
  }

  return inputArray;
};

function solve()
{
 solutions = new Array();
 for(var i=0; i<words.length; i++)
 {
  if(words[i].length>=minlength)
  {
   if(findword(words[i]))
   {
    solutions.push(words[i]);
   }
  }
 }
}

function findword(word)
{
 if(word.length==0) return 0;
 var i, j;
 for(i=0; i<dimension; i++)
 {
  for(j=0; j<dimension; j++)
  {
   if(board[i+j*dimension][0]==word[0])
   {
    if(findsequence(word, i, j)) return 1;
   }
  }
 }
 return 0;
}

function safeboard(i, j)
{
 if((i<0) || (j<0) || (i>=dimension) || (j>=dimension)) return '*';
 return board[i+j*dimension];
}

function findsequence(seq, i, j)
{
  if(seq.length<=1) return 1;
  var s;
  s = board[i+j*dimension];
  board[i+j*dimension] = ' ';

  if(s[1]){
    if(s[1] == seq[1]){
      if(findsequence(seq.substr(1), i, j))
      {
        board[i+j*dimension] = s;
        return 1;
      }
    }
  }
  else {
    for(var u=-1; u<=1; u=u+1){
      for(var v=-1; v<=1; v=v+1){
        if (safeboard(i+u, j+v)==seq.charAt(1)){
          if(findsequence(seq.substr(1), i+u, j+v)){
            board[i+j*dimension] = s;
            return 1;
          }
        }
      }
    }
    board[i+j*dimension] = s;
  }

  board[i+j*dimension] = s;
  return 0;
}

function displaySolutions(){
  var DOM_solutionsDiv = document.getElementById("solutions_div");
  clearDOMChildren(DOM_solutionsDiv);
  var listNode;
  var textNode;

  // create title 
  var titleNode = document.createElement('h1');
  titleNode.innerHTML = "All Words: ";
  DOM_solutionsDiv.appendChild(titleNode);

  // append legal words
  for (var i = 0; i < solutions.length; i++){
    listNode = document.createElement('LI');
    textNode = document.createTextNode(solutions[i]);
    listNode.appendChild(textNode);
    DOM_solutionsDiv.appendChild(listNode);
  }
}

function clearDOMChildren(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

function sortSolutions(){
  solutions.sort(function(a, b){
    if (a.length > b.length){
      return -1;
    }
    else if (a.length < b.length){
      return 1;
    }

    if (a > b){
      return 1;
    }
    else if (a < b){
      return -1;
    }
  });
}

function resetBoard(){
  document.getElementById('wordGrid').reset();

  /*
  for (var i = 1; i <= 16; i++){
    var inputDOM = document.getElementById('letter' + String(i)).value.toLowerCase();
    inputDOM = '';
  }
  */
}