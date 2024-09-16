var ukeV = 931494.10372;
var eMasskeV = 510.99895069;
var NUBASE = new Array();
var t0withErr = {val: 125, err: 0};
var bwithErr = {val: 0, err: 0};
NUBASE = loadNUBASE();

var logoIMG = document.getElementById("logo");
logoIMG.addEventListener("click", function(){alert("Nice aim!")}, false);
logoIMG.style.position = 'absolute';
logoIMG.style.height = '25px';
logoIMG.style.top = '23px';
logoIMG.style.left="200px";
var position = 200;
var direction = 1;
setInterval(function(){
  position = position + direction;
  logoIMG.style.left=String(position).concat("","px");
  if(position==425 || position == 25) direction *= -1;
}, 10, false);

btn_bCalc = document.getElementById("btn_bCalc");
  btn_bCalc.addEventListener("click", makebCalc, false);

btn_t0Calc = document.getElementById("btn_t0Calc");
  btn_t0Calc.addEventListener("click", maket0Calc, false);

btn_CalcToF = document.getElementById("btn_ToFCalc");
btn_CalcToF.addEventListener("click", calcToF, false);

btn_CalcMass = document.getElementById("btn_MECalc");
btn_CalcMass.addEventListener("click", calcMass, false);

window.electronAPI.onMenuClearT0((value) => {
    t0withErr = {val: 125, err: 0};
    document.getElementById("lblCalct0").innerHTML = "...";
    document.getElementById("t0").value = 125;
  })
//----------------------------------------------------    

function makebCalc() {

var theNuclide1 = document.getElementById("NameRef1");
var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
var theMass1 = getMass(theNuclide1.value, theCharge1);
document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

var theNuclide2 = document.getElementById("NameRef2");
var theCharge2 = parseFloat(document.getElementById("selCharge2").value);
var theMass2 = getMass(theNuclide2.value, theCharge2);
document.getElementById("Mass2").innerHTML = String(theMass2).concat("", " u");

var mOverQ1 = theMass1/theCharge1;
var mOverQ2 = theMass2/theCharge2;

const t0 = parseFloat(document.getElementById("t0").value);;
var ref1Laps = parseFloat(document.getElementById("ref1Laps").value);
var ref2Laps = parseFloat(document.getElementById("ref2Laps").value);

var ok = true;

if(document.getElementById("ToF_Ref1").value == "") ok = false;
if(document.getElementById("ToF_Ref2").value == "") ok = false;
if(!ok) alert("Missing at least on ToF value!");

if(document.getElementById("ref1Laps").value == ""){
  alert("We need to know the lap number of reference 1, sorry.");
  ok = false;
}
if(ok){
  if(document.getElementById("ref2Laps").value == ""){
    console.log("Looking for laps of reference 2");
    if(document.getElementById("bEstimate").value == ""){
      alert("Give us even a rough estimate of the b-value for reference 1");
      ok = false;
    }
    else{
      var bEstimate = parseFloat(document.getElementById("bEstimate").value);
      var nRef1 = parseFloat(document.getElementById("ref1Laps").value);
      if(document.getElementById("Ref2EjTime").value == ""){
        var ref1tAtN0 = parseFloat(document.getElementById("ToF_Ref1").value) - nRef1*bEstimate;
        var ref2tAtN0 = ref1tAtN0*Math.sqrt(mOverQ2/mOverQ1);
        ref2Laps = (parseFloat(document.getElementById("ToF_Ref2").value) - ref2tAtN0)/(bEstimate*Math.sqrt(mOverQ2/mOverQ1));
        document.getElementById("ref2Laps").value = parseInt(ref2Laps);
      }
      else{
        var tej2 = parseFloat(document.getElementById("Ref2EjTime").value);
        var ref1tAtN0 = parseFloat(document.getElementById("ToF_Ref1").value) - nRef1*bEstimate;
        var ref2tAtN0 = ref1tAtN0*Math.sqrt(mOverQ2/mOverQ1);
        ref2Laps = (tej2 - ref2tAtN0)/(bEstimate*Math.sqrt(mOverQ2/mOverQ1));
        document.getElementById("ref2Laps").value = parseInt(ref2Laps);
      } 
    }
  }
}

ref2Laps = parseFloat(document.getElementById("ref2Laps").value);
var DeltaN = parseInt(ref1Laps) - parseInt(ref2Laps);
if(DeltaN == 0){ 
  alert("Requires Δn≠0!");
  ok = false;
}

if(ok){
  var ToFRef1 = parseFloat(document.getElementById("ToF_Ref1").value) - t0;
  var ToFRef1Err = parseFloat(document.getElementById("ToF_Ref1err").value);
  var ToFRef2 = parseFloat(document.getElementById("ToF_Ref2").value) - t0;
  var ToFRef2Err = parseFloat(document.getElementById("ToF_Ref2err").value);

  console.log("The tof for Ref1 is ", ToFRef1);
  console.log("The tof for Ref2 is ", ToFRef2*Math.sqrt(mOverQ1/mOverQ2));
  console.log("The tof difference is ", ToFRef2*Math.sqrt(mOverQ1/mOverQ2) - ToFRef1);

  var bvalue = (ToFRef2*Math.sqrt(mOverQ1/mOverQ2) - ToFRef1)/(ref2Laps - ref1Laps);
  var theLabel = document.getElementById("lblb");
  var DeltaToFErr = Math.sqrt(ToFRef2Err*ToFRef2Err*(mOverQ1/mOverQ2) + ToFRef1Err*ToFRef1Err)/DeltaN;

  bwithErr = {val: bvalue.toFixed(4), err: DeltaToFErr.toFixed(4)}
  document.getElementById("bEstimate").value = String(bvalue.toFixed(2));
  theLabel.innerHTML = String(bvalue.toFixed(2)).concat(" ± ", DeltaToFErr.toFixed(2));
} 
}
//----------------------------------------------------    

function maket0Calc() {

    var theNuclide1 = document.getElementById("NameRef1");
    var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
    var theMass1 = getMass(theNuclide1.value, theCharge1);
    document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

    var theNuclide2 = document.getElementById("NameRef2");
    var theCharge2 = parseFloat(document.getElementById("selCharge2").value);
    var theMass2 = getMass(theNuclide2.value, theCharge2);
    document.getElementById("Mass2").innerHTML = String(theMass2).concat("", " u");

    var mOverQ1 = theMass1/theCharge1;
    var mOverQ2 = theMass2/theCharge2;

    const t0 = parseFloat(document.getElementById("t0").value);;

    var ref1Laps = parseFloat(document.getElementById("ref1Laps").value);
    var ref2Laps = parseFloat(document.getElementById("ref2Laps").value);
    var DeltaN = parseInt(ref1Laps) - parseInt(ref2Laps);

    if(DeltaN != 0) alert("Requires Δn=0!");
    else{

        var ToFRef1 = parseFloat(document.getElementById("ToF_Ref1").value);
        var ToFRef1Err = parseFloat(document.getElementById("ToF_Ref1err").value);
        var ToFRef2 = parseFloat(document.getElementById("ToF_Ref2").value);
        var ToFRef2Err = parseFloat(document.getElementById("ToF_Ref2err").value);
        var massRatio = Math.sqrt(mOverQ1/mOverQ2);

        var t0value = (massRatio*ToFRef2-ToFRef1)/(massRatio-1);
        console.log("The tof for Ref1 is ", ToFRef1);
        console.log("The tof for 41 is ", ToFRef2);
        console.log("The mass ratio is ", massRatio);

        var theLabel = document.getElementById("lblCalct0");
        var T0Err = Math.sqrt(ToFRef2Err*ToFRef2Err*(mOverQ1/mOverQ2) + ToFRef1Err*ToFRef1Err)/Math.abs(massRatio-1);

        t0withErr = {val: t0value.toFixed(2), err: T0Err.toFixed(2)};
        theLabel.innerHTML = String(t0value.toFixed(2)).concat(" ± ", T0Err.toFixed(2));
    } 
}

function calcToF() {

var theNuclide1 = document.getElementById("NameRef1");
var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
var theMass1 = getMass(theNuclide1.value, theCharge1);
document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

var theNuclide2 = document.getElementById("NameAnalyte");
var theCharge2 = parseFloat(document.getElementById("selChargeAna").value);
var theMass2 = getMass(theNuclide2.value, theCharge2);
document.getElementById("MassAna").innerHTML = String(theMass2).concat("", " u");

var mOverQ1 = theMass1/theCharge1;
var mOverQ2 = theMass2/theCharge2;

if(t0withErr.err == 0){
  if(document.getElementById("t0").value == ""){
    alert("We will need a t_0 value to calculate things...");
    ok = false;
  }
  else t0withErr.val = parseFloat(document.getElementById("t0").value);
}

var ref1Laps = parseFloat(document.getElementById("ref1Laps").value);
var analyteLaps = parseFloat(document.getElementById("AnalyteLaps").value);
var DeltaN = parseInt(ref1Laps) - parseInt(analyteLaps);
var tof1 = parseFloat(document.getElementById("ToF_Ref1").value);
var ToFRef1Err = parseFloat(document.getElementById("ToF_Ref1err").value);
var ref1ToF = {val: tof1,
              err: ToFRef1Err};
if(isNaN(ref1ToF.err)) ref1ToF.err = 0;           

var ok = true;
if(isNaN(ref1Laps) || document.getElementById("ref1Laps").value == ""){
  alert("We need to know how many laps Reference 1 made!");
  ok = false;
}
if(isNaN(ref1ToF.val) || document.getElementById("ToF_Ref1").value == ""){
  console.log(document.getElementById("ToF_Ref1"));
  alert("We need a ToF for reference 1!");
  ok = false;
}
if(theNuclide2 == ""){
  alert("We need a name for the analyte ion!");
  ok = false;
}
if(ok){
  if(document.getElementById("AnalyteLaps").value != ""){
    if(ref1Laps == analyteLaps){
      var analyteToF = (ref1ToF.val - t0withErr.val)*Math.sqrt(mOverQ2/mOverQ1) + t0withErr.val;
      var analyteToFErr = (ref1ToF.err/ref1ToF.val)*analyteToF;
      document.getElementById("ToF_Analyte").value = String(analyteToF.toFixed(2));
      document.getElementById("ToF_AnalyteErr").value = analyteToFErr.toFixed(2);
    }
    else{
      if(bwithErr.err == 0){
        if(document.getElementById("bEstimate").value == ""){
          alert("We need a b-value for reference 1!");
          ok = false;
        }
        else bwithErr.val = parseFloat(document.getElementById("bEstimate").value);
      }
      var analyteToF = (ref1ToF.val - t0withErr.val)*Math.sqrt(mOverQ2/mOverQ1) + t0withErr.val;
      var analyteB = {val: bwithErr.val*Math.sqrt(mOverQ2/mOverQ1), err: bwithErr.err*Math.sqrt(mOverQ2/mOverQ1)};
      var DeltaN = parseInt(analyteLaps) - parseInt(ref1Laps);
      analyteToF += DeltaN*analyteB.val;
      var analyteToFErr = Math.sqrt( (ref1ToF.err/ref1ToF.val)*analyteToF*(ref1ToF.err/ref1ToF.val)*analyteToF + DeltaN*analyteB.err*DeltaN*analyteB.err);
      document.getElementById("ToF_Analyte").value = String(analyteToF.toFixed(2));
      document.getElementById("ToF_AnalyteErr").value = analyteToFErr.toFixed(2);
    }
  }
  else if(document.getElementById("AnalyteEjTime").value == ""){//Assume same laps as ref1
    var analyteToF = (ref1ToF.val - t0withErr.val)*Math.sqrt(mOverQ2/mOverQ1) + t0withErr.val;
    var analyteToFErr = (ref1ToF.err/ref1ToF.val)*analyteToF;
    document.getElementById("ToF_Analyte").value = String(analyteToF.toFixed(2));
    document.getElementById("ToF_AnalyteErr").value = analyteToFErr.toFixed(2);
    document.getElementById("AnalyteLaps").value = document.getElementById("ref1Laps").value;
  }
  else{ //We have the ejection time, so we can calculate the lap number with a b-value
    if(bwithErr.err == 0){
      if(document.getElementById("bEstimate").value == ""){
        alert("We need a b-value for reference 1!");
        ok = false;
      }
      else bwithErr.val = parseFloat(document.getElementById("bEstimate").value);
    }
    if(ok){
      var tejAnalyte = parseFloat(document.getElementById("AnalyteEjTime").value);
      var ref1tAtN0 = parseFloat(document.getElementById("ToF_Ref1").value) - ref1Laps*bwithErr.val;
      var AnalytetAtN0 = ref1tAtN0*Math.sqrt(mOverQ2/mOverQ1) - t0withErr.val;
      analyteLaps = Math.ceil((tejAnalyte - AnalytetAtN0)/(bwithErr.val*Math.sqrt(mOverQ2/mOverQ1)));
      document.getElementById("AnalyteLaps").value = analyteLaps;

      var analyteToF = (ref1ToF.val - t0withErr.val)*Math.sqrt(mOverQ2/mOverQ1) + t0withErr.val;
      var analyteB = {val: bwithErr.val*Math.sqrt(mOverQ2/mOverQ1), err: bwithErr.err*Math.sqrt(mOverQ2/mOverQ1)};
      var DeltaN = parseInt(analyteLaps) - parseInt(ref1Laps);
      analyteToF += DeltaN*analyteB.val;
      var analyteToFErr = Math.sqrt( (ref1ToF.err/ref1ToF.val)*analyteToF*(ref1ToF.err/ref1ToF.val)*analyteToF + DeltaN*analyteB.err*DeltaN*analyteB.err);
      document.getElementById("ToF_Analyte").value = String(analyteToF.toFixed(2));
      document.getElementById("ToF_AnalyteErr").value = analyteToFErr.toFixed(2);
    }
  }
}
}

//----------------------------------------------------  
function calcMass(){
var ok = true;
var ref1Laps = parseFloat(document.getElementById("ref1Laps").value);
var AnalyteLaps = parseFloat(document.getElementById("AnalyteLaps").value);
var ref1ToF = {val: parseFloat(document.getElementById("ToF_Ref1").value), err: parseFloat(document.getElementById("ToF_Ref1err").value)};
var analyteToF = {val: parseFloat(document.getElementById("ToF_Analyte").value), err: parseFloat(document.getElementById("ToF_AnalyteErr").value)};
var theNuclide1 = document.getElementById("NameRef1");
var theNuclide2 = document.getElementById("NameAnalyte");

if(isNaN(ref1Laps) || document.getElementById("ref1Laps").value == ""){
  alert("We need to know how many laps Reference 1 made!");
  ok = false;
}
if(ok) if(isNaN(ref1ToF.val) || document.getElementById("ToF_Ref1").value == ""){
  console.log(document.getElementById("ToF_Ref1"));
  alert("We need a ToF for reference 1!");
  ok = false;
}
if(ok) if(isNaN(analyteToF.val) || document.getElementById("ToF_Analyte").value == ""){
  console.log(document.getElementById("ToF_Analyte"));
  alert("We need a ToF for the analyte!");
  ok = false;
}
if(ok) if(isNaN(AnalyteLaps) || document.getElementById("AnalyteLaps").value == ""){
  if(document.getElementById("AnalyteEjTime").value == ""){
    alert("We need to know how many laps the analyte made. Tell us that or the analyte's ejection time!");
    ok = false;
  }
  else{//calculate AnalyteLaps
    var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
    var theMass1 = getMass(theNuclide1.value, theCharge1);
    document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

    var theCharge2 = parseFloat(document.getElementById("selChargeAna").value);
    var theMass2 = getMass(theNuclide2.value, theCharge2);
    document.getElementById("MassAna").innerHTML = String(theMass2).concat("", " u");

    var mOverQ1 = theMass1/theCharge1;
    var mOverQ2 = theMass2/theCharge2;
    var tejAnalyte = parseFloat(document.getElementById("AnalyteEjTime").value);
    var ref1tAtN0 = parseFloat(document.getElementById("ToF_Ref1").value) - ref1Laps*bwithErr.val;
    var AnalytetAtN0 = ref1tAtN0*Math.sqrt(mOverQ2/mOverQ1) - t0withErr.val;
    AnalyteLaps = Math.ceil((tejAnalyte - AnalytetAtN0)/(bwithErr.val*Math.sqrt(mOverQ2/mOverQ1)));
    document.getElementById("AnalyteLaps").value = AnalyteLaps;
  }
}
if(ok) if(theNuclide1 == ""){
  alert("We need a name for the reference ion!");
  ok = false;
}
if(ok) if(theNuclide2 == ""){
  alert("We need a name for the analyte ion!");
  ok = false;
}
if(ok) if(ref1Laps !== AnalyteLaps){
  if(bwithErr.err == 0){
    if(document.getElementById("bEstimate").value == ""){
      alert("We need a b-value for reference 1!");
      ok = false;
    }
    else bwithErr.val = parseFloat(document.getElementById("bEstimate").value);
  }
}
if(ok) if(t0withErr.err == 0){
  if(document.getElementById("t0").value == ""){
    alert("We will need a t_0 value to calculate things...");
    ok = false;
  }
  else t0withErr.val = parseFloat(document.getElementById("t0").value);
}

if(ok){
  var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
  var theMass1 = getMass(theNuclide1.value, theCharge1);
  document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

  var theCharge2 = parseFloat(document.getElementById("selChargeAna").value);
  var theMass2 = getMass(theNuclide2.value, theCharge2);
  document.getElementById("MassAna").innerHTML = String(theMass2).concat("", " u");

  var mOverQ1 = theMass1/theCharge1;
  var mOverQ2 = theMass2/theCharge2;

  if(ref1Laps == AnalyteLaps){
    var rho = (analyteToF.val - t0withErr.val)/(ref1ToF.val - t0withErr.val);
    var m = theCharge2*mOverQ1*rho*rho;
    var MassExcess = (m - Math.round(theMass2))*ukeV + theCharge2*eMasskeV;
    var dMassExcess = 2*m*Math.sqrt((analyteToF.err/analyteToF.val)*(analyteToF.err/analyteToF.val) + (ref1ToF.err/ref1ToF.val)*(ref1ToF.err/ref1ToF.val))*ukeV;
//add term for dt_0
    var DMassExcess = (m - theMass2)*ukeV;
    document.getElementById("lblMassExcess").innerHTML = String("ME=").concat(MassExcess.toFixed(2)," keV");
    document.getElementById("lbldM").innerHTML = String("δME=").concat(dMassExcess.toFixed(2)," keV");
    document.getElementById("lblDM").innerHTML = String("Δm=").concat(DMassExcess.toFixed(2)," keV");
  }
  else{
    var DeltaN = AnalyteLaps - ref1Laps;
    ref1ToF.val += DeltaN*bwithErr.val;
    ref1ToF.err += Math.abs(DeltaN)*bwithErr.err;
    console.log("AnalyteToF is ", analyteToF);
    var rho = (analyteToF.val - t0withErr.val)/(ref1ToF.val - t0withErr.val);
    var m = theCharge2*mOverQ1*rho*rho;
    var MassExcess = (m - Math.round(theMass2))*ukeV + theCharge2*eMasskeV;
    var dMassExcess = 2*m*Math.sqrt((analyteToF.err/analyteToF.val)*(analyteToF.err/analyteToF.val) + (ref1ToF.err/ref1ToF.val)*(ref1ToF.err/ref1ToF.val))*ukeV;
//add term for dt_0
    var DMassExcess = (m - theMass2)*ukeV;
    document.getElementById("lblMassExcess").innerHTML = String("ME=").concat(MassExcess.toFixed(2)," keV");
    document.getElementById("lbldM").innerHTML = String("δME=").concat(dMassExcess.toFixed(2)," keV");
    document.getElementById("lblDM").innerHTML = String("Δm=").concat(DMassExcess.toFixed(2)," keV");
  }
}
}

//----------------------------------------------------  
function getMass(thisNuclide, charge){
//    console.log(thisNuclide);
//    console.log(charge);

  var theNuclides = thisNuclide.split(/;|:/);
  var theAtoms = new Array();
  for(let i=0; i<theNuclides.length; i++){
    const thisPart = theNuclides.at(i);
    for(let j=0; j<thisPart.length; j++){
      var thisChar = thisPart.at(j);
      if(!(thisChar >= '0' && thisChar <= '9')){ 
        var theNuclide = thisPart.slice(j, thisPart.length);
        var theNumber = thisPart.slice(0, j);
        if(j == 0) theNumber = 1;
        theAtoms.push({nuclide: theNuclide, theNumber: theNumber});
        j=thisPart.length;
      }
    }
  }
//    console.log(theAtoms);

  var theMass = 0;
  for(let i=0; i<theAtoms.length; i++){
    var theJSON = NUBASE.find(({nuclide}) => nuclide === theAtoms.at(i).nuclide);
    console.log(theJSON);
    var n= parseFloat(theAtoms.at(i).theNumber);
    theMass += n*theJSON.A*ukeV + theJSON.MassExcess;
  }
  theMass -= parseFloat(charge)*eMasskeV;
  theMass /= ukeV;
//  console.log(theMass);
  return parseFloat(String(theMass)).toFixed(9);
  
}

//----------------------------------------------------  
function finalParse(theJSON){
  //Get the element name correct with no spaces
  var firstLetterPosition;
  for(let i=0; i<theJSON.nuclide.length; i++){
    var thisChar = theJSON.nuclide.at(i);
    if(!(thisChar >= '0' && thisChar <= '9')){ 
      theJSON.element = theJSON.nuclide.slice(i, theJSON.nuclide.length);
      i=theJSON.nuclide.length;
    }
  }
  for(let i=0; i<theJSON.element.length; i++){
    var thisChar = theJSON.element.at(i);
    if(thisChar == ' '){
      theJSON.element = theJSON.element.slice(0, i);
      i = theJSON.element.length;
    }
  }

  //Strip extraneous zeroes from Z
  if(theJSON.Z.at(0) == '0'){
    for(let i=0; i<theJSON.Z.length; i++){
      var thisChar = theJSON.Z.at(i);
      if(!(thisChar == '0')){
        theJSON.Z = theJSON.Z.slice(i, theJSON.Z.length);
        i=theJSON.Z.length;
      }
    }
  }
  theJSON.Z = parseInt(theJSON.Z);

  //Get the nulcide name correct with number after letters, convert A to int
  if(theJSON.A.at(0) == '0'){
    for(let i=0; i<theJSON.A.length; i++){
      var thisChar = theJSON.A.at(i);
      if(!(thisChar == '0')){
        theJSON.A = theJSON.A.slice(i, theJSON.A.length);
        i=theJSON.A.length;
      }
    }
    theJSON.nuclide = theJSON.element.concat("", theJSON.A);
    theJSON.A = parseInt(theJSON.A);
  }
  else{ 
    theJSON.nuclide = theJSON.element.concat("", theJSON.A);
    theJSON.A = parseInt(theJSON.A);
  }
//    if(theJSON.element[0] == "C") console.log(theJSON.A, " ,", theJSON.nuclide);

  //Check for theory mark on mass excess
  for(let i=0; i<theJSON.MassExcess.length; i++){
    var thisChar = theJSON.MassExcess.at(i);
    if(thisChar == '#'){
      theJSON.MassExcess = theJSON.MassExcess.slice(0, i);
      i=theJSON.MassExcess.length;
      theJSON.MassTheory = true;
    }
  }

  //Remove white space from mass excess, convert to float
  theJSON.MassExcess = parseFloat(theJSON.MassExcess);

  //Remove white space from mass excess error, convert to float
  for(let i=0; i<theJSON.dMassExcess.length; i++){
    var thisChar = theJSON.dMassExcess.at(i);
    if(thisChar == '#'){
      theJSON.dMassExcess = theJSON.dMassExcess.slice(0, i);
      i=theJSON.dMassExcess.length;
    }
  }
  theJSON.dMassExcess = parseFloat(theJSON.dMassExcess);

  switch(theJSON.i){
    case '1':
    case '2': 
      theJSON.isIsomer = true;
      theJSON.ExcitationEnergy = parseFloat(theJSON.ExcitationEnergy);
      theJSON.dExcitationEnergy = parseFloat(theJSON.dExcitationEnergy);
      break;
    case '3': 
    case '4': 
      theJSON.isLevel = true;
      theJSON.ExcitationEnergy = parseFloat(theJSON.ExcitationEnergy);
      theJSON.dExcitationEnergy = parseFloat(theJSON.dExcitationEnergy);
      break;
    case '5':
      theJSON.isResonances = true; 
      theJSON.ExcitationEnergy = parseFloat(theJSON.ExcitationEnergy);
      theJSON.dExcitationEnergy = parseFloat(theJSON.dExcitationEnergy);
      break;
    case '8':
    case '9': 
      theJSON.isIAS = true;
      theJSON.ExcitationEnergy = parseFloat(theJSON.ExcitationEnergy);
      theJSON.dExcitationEnergy = parseFloat(theJSON.dExcitationEnergy);
      break;
    default: 
      theJSON.ExcitationEnergy = 0;
      theJSON.dExcitationEnergy = 0;
  }

  //Remove white space from half-life, convert to float
  while(theJSON.Halflife.at(0) == ' '){
    theJSON.Halflife = theJSON.Halflife.slice(1, theJSON.Halflife.length);
  }
  while(theJSON.Halflife.at(theJSON.Halflife.length-1) == ' '){
    theJSON.Halflife = theJSON.Halflife.slice(0, theJSON.Halflife.length-1);
  }
  if(theJSON.Halflife == "stbl"){ 
    theJSON.isStable = true;
    theJSON.halflifeSeconds = 1e14;
    var endVal = 0;
    for(let i=0; i<theJSON.BR.length; i++) if(theJSON.BR.at(i) == ' ') endVal = i;
    theJSON.abundance = theJSON.BR.slice(3, endVal);
  }
  else{
//      console.log(theJSON.Halflife);
    theJSON.Halflife = parseFloat(theJSON.Halflife);
    if(isNaN(theJSON.Halflife)) theJSON.Halflife = 0;
    theJSON.abundance = 0;
  }

  //Remove white space from half-life, convert to float
  while(theJSON.dHalflife.at(0) == ' '){
    theJSON.dHalflife = theJSON.dHalflife.slice(1, theJSON.dHalflife.length);
  }
  while(theJSON.dHalflife.at(theJSON.dHalflife.length-1) == ' '){
    theJSON.dHalflife = theJSON.dHalflife.slice(0, theJSON.dHalflife.length-1);
  }
  theJSON.dHalflife = parseFloat(theJSON.dHalflife);
  if(isNaN(theJSON.dHalflife)) theJSON.dHalflife = 0;

  //Remove white space from halflife unit
  while(theJSON.t12unit.at(0) == ' '){
    theJSON.t12unit = theJSON.t12unit.slice(1, theJSON.t12unit.length);
  }
  while(theJSON.t12unit.at(theJSON.t12unit.length) == ' '){
    theJSON.t12unit = theJSON.t12unit.slice(0, theJSON.t12unit.length-1);
  }

  //Set halflife in seconds
  switch(theJSON.t12unit){
    case "Gy":
      theJSON.halflifeSeconds = 1e9*365*24*3600*theJSON.Halflife;
      break;
    case "My":
      theJSON.halflifeSeconds = 1e6*365*24*3600*theJSON.Halflife;
      break;
    case "ky":
      theJSON.halflifeSeconds = 1e3*365*24*3600*theJSON.Halflife;
      break;
    case "y":
      theJSON.halflifeSeconds = 365*24*3600*theJSON.Halflife;
      break;
    case "d":
      theJSON.halflifeSeconds = 24*3600*theJSON.Halflife;
      break;
    case "h":
     theJSON.halflifeSeconds = 3600*theJSON.Halflife;
      break;
    case "m":
      theJSON.halflifeSeconds = 60*theJSON.Halflife;
      break;
    case "s": 
      theJSON.halflifeSeconds = theJSON.Halflife;
      break;
    case "ms":
      theJSON.halflifeSeconds = 1e-3*theJSON.Halflife;
      break;
    case "us":
      theJSON.halflifeSeconds = 1e-6*theJSON.Halflife;
      break;
    case "ns":
      theJSON.halflifeSeconds = 1e-9*theJSON.Halflife;
      break;
    default: 
      if(theJSON.Halflife !== "stbl") theJSON.halflifeSeconds = 0;
  }

  return theJSON;
}

//----------------------------------------------------  
function loadNUBASE(){
  var theNUBASE = new Array();
  fetch("nubase_4.mas20.txt")
    .then((res) => res.text())
    .then((text) => {
      var theWholeTable = new Array();
      theWholeTable = text.split(/\r\n|\n/);       
      console.log("theWholeTable has %i entries", theWholeTable.length);
//        console.log(theWholeTable.at(0));
      for(let i=0; i<theWholeTable.length; i++){
//          if(theWholeTable.at(i).at(0) == '#') console.log(theWholeTable.at(i));
//          else{
        if(!(theWholeTable.at(i).at(0) == '#')){
          var thisLineAsJSON={
            A: "",
            Z: "",
            i: "",
            nuclide: "",
            element: "",
            state: "",
            MassExcess: "",
            dMassExcess: "",
            MassTheory: false,
            isIsomer: false,
            isLevel: false,
            isResonances: false,
            isIAS: false,
            isStable: false,
            stateOrigin: "",
            isomericOrder: "",
            ExcitationEnergy: "",
            dExcitationEnergy: "",
            Halflife: "",
            t12unit: "",
            dHalflife: "",
            halflifeSeconds: 0,
            spin: "",
            spinHow: "",
            ensdfYear: "",
            discoYear: "",
            abundance: "",
            BR: ""
          };
          thisLineAsJSON.A = theWholeTable.at(i).slice(0,3);
          thisLineAsJSON.Z = theWholeTable.at(i).slice(4,7);
          thisLineAsJSON.i = theWholeTable.at(i).at(7);
          thisLineAsJSON.nuclide = theWholeTable.at(i).slice(11,16);
          thisLineAsJSON.state = theWholeTable.at(i).at(16);
          thisLineAsJSON.MassExcess = theWholeTable.at(i).slice(18,31);
          thisLineAsJSON.dMassExcess = theWholeTable.at(i).slice(31,42);
          thisLineAsJSON.ExcitationEnergy = theWholeTable.at(i).slice(42,54);
          thisLineAsJSON.dExcitationEnergy = theWholeTable.at(i).slice(54,65);
          thisLineAsJSON.stateOrigin = theWholeTable.at(i).slice(65,67);
          thisLineAsJSON.isomericOrder = theWholeTable.at(i).slice(67,69);
          thisLineAsJSON.Halflife = theWholeTable.at(i).slice(69,78);
          thisLineAsJSON.t12unit = theWholeTable.at(i).slice(78,80);
          thisLineAsJSON.dHalflife = theWholeTable.at(i).slice(81,88);
          thisLineAsJSON.spin = theWholeTable.at(i).slice(88,102);
          thisLineAsJSON.ensdfYear = theWholeTable.at(i).slice(102,104);
          thisLineAsJSON.discoYear = theWholeTable.at(i).slice(114,118);
          thisLineAsJSON.BR = theWholeTable.at(i).slice(119, 209);

          thisLineAsJSON = finalParse(thisLineAsJSON);

//            if(thisLineAsJSON.element[0] == "C") console.log(thisLineAsJSON.A);
          theNUBASE.push(thisLineAsJSON);
        }         
      }
    })
    .catch((e) => console.error(e));
  return theNUBASE;
}

//----------------------------------------------------  