var ukeV = 931494.10372;
var eMasskeV = 510.99895069;
var NUBASE = new Array();
var t0withErr = {val: 125, err: 0};
var bwithErr = {val: 0, err: 0};
NUBASE = loadNUBASE();
var periodicData = getChart(document.getElementById("divPeriodicTable"));

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

btnSelectNone = document.getElementById("btnSelectNone");
  btnSelectNone.addEventListener("click", fnSelectNone, false);

btnStandardSelection = document.getElementById("btnSelectStandardSet");
  btnStandardSelection.addEventListener("click", fnStandardSelection, false);

btnFindSCM = document.getElementById("btnFindSCM");
  btnFindSCM.addEventListener("click", fnFindSCM, false);

window.electronAPI.onMenuClearT0((value) => {
    t0withErr = {val: 125, err: 0};
    document.getElementById("lblCalct0").innerHTML = "...";
    document.getElementById("t0").value = 125;
    console.log(periodicData);
    console.log(periodicData.length);
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
    if (typeof myVar !== 'undefined') console.log(theJSON);
    var n= parseFloat(theAtoms.at(i).theNumber);
    theMass += n*theJSON.A*ukeV + theJSON.MassExcess;
  }
  theMass -= parseFloat(charge)*eMasskeV;
  theMass /= ukeV;
//  console.log(theMass);
  return parseFloat(String(theMass)).toFixed(9);
}

//----------------------------------------------------  
function getMarkup(thisNuclide, charge){
  
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
  
    var theMass = 0;
    var theMarkup ="";
    for(let i=0; i<theAtoms.length; i++){
      var theJSON = NUBASE.find(({nuclide}) => nuclide === theAtoms.at(i).nuclide);
      var n= parseFloat(theAtoms.at(i).theNumber);
      var theAtom ="<sup>".concat(theJSON.A,"</sup>").concat("",theJSON.element);
      if(n>1) theAtom = theAtom.concat("<sub>", n).concat("", "</sub>");
      theMarkup = theMarkup.concat("", theAtom);// "<sup>".concat(theJSON.A,"</sup>").concat(theJSON.element,"<sub>").concat(n, "</sub>"));
    }
    console.log(charge);
    if(charge == "1") theMarkup = theMarkup.concat("", "<sup>+</sup>");
    else if(charge == 2) theMarkup = theMarkup.concat("", "<sup>2+</sup>");
    else if(charge == 3) theMarkup = theMarkup.concat("", "<sup>3+</sup>");

    return theMarkup;
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
    theJSON.abundance = parseFloat(theJSON.BR.slice(3, endVal));
  }
  else{
//      console.log(theJSON.Halflife);
    theJSON.Halflife = parseFloat(theJSON.Halflife);
    if(isNaN(theJSON.Halflife)) theJSON.Halflife = 0;
    if(theJSON.BR.slice(0,2) == "IS"){ 
      var endVal = 0;
      for(let i=0; i<theJSON.BR.length; i++) if(theJSON.BR.at(i) == ' ') endVal = i;
      theJSON.abundance = parseFloat(theJSON.BR.slice(3, endVal));
    }
    else theJSON.abundance = 0;
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
    case "Py":
      theJSON.halflifeSeconds = 1e12*365*24*3600*theJSON.Halflife;
      break;
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

//          if(thisLineAsJSON.element[0] == "V") console.log(thisLineAsJSON);
          theNUBASE.push(thisLineAsJSON);
        }         
      }
    })
    .catch((e) => console.error(e));
//    getChart();
  return theNUBASE;
}

//----------------------------------------------------  

function getChart(mydiv){
  var symbols = new Array();

  async function getSymbols(){
    return fetch("periodic.data")
        .then((res) => res.text())
        .then((text) => {
          var theWholeTable = new Array();
          theWholeTable = text.split(/\r\n|\n/);       
          console.log("The periodic table has %i entries", theWholeTable.length);
          for(let i=0; i<theWholeTable.length; i++){
              var thisData = new Array();
              thisData = theWholeTable.at(i).split(' ');
              var thisJSON = {Symbol: "", row: "", column: "", selected: "N"};
              if(thisData.length = 3){

                thisJSON.Symbol = thisData.at(0);
                thisJSON.row = parseFloat(thisData.at(1));
                thisJSON.column = parseFloat(thisData.at(2));
                  symbols.push(thisJSON);
//                  console.log(symbols.at(i));
              }
              else console.log(thisData.length);
          }
        })
        .catch((e) => console.error(e));
  }

  async function doIt(){
    await getSymbols();
//    console.log(symbols);
//    console.log(symbols.length);
    for(let i=0; i<symbols.length;i++){
      var btnThisElement = document.createElement("button");
      btnThisElement.index = i;
      btnThisElement.id = "btnElement"+i;
      btnThisElement.type = "text";
      btnThisElement.style.position = 'absolute';
      btnThisElement.style.backgroundColor = "yellow";
      btnThisElement.style.left = 1.5+27*symbols.at(i).column + "px";
      btnThisElement.style.top = 1.5+15*symbols.at(i).row + "px";
      btnThisElement.style.width = '27px';
      btnThisElement.style.font = "10px Arial";
      btnThisElement.addEventListener("click", 
        function(){
          if(this.style.backgroundColor === "green"){ 
            this.style.backgroundColor = "yellow";
            symbols.at(parseInt(this.index)).selected = "N";
          }
          else{
             this.style.backgroundColor = "green";
             symbols.at(parseInt(this.index)).selected = "Y";
          }
        }, false);
        btnThisElement.innerHTML = symbols.at(i).Symbol;
      mydiv.appendChild(btnThisElement);
    }
  }

  doIt();

  return symbols;
}

function getElementIndex(theElement){
  for(let i=0; i<periodicData.length;i++){
    if(periodicData.at(i).Symbol == theElement) return i;
  }
  return -1;
}

function fnSelectNone(){
  for(let i=0; i<periodicData.length;i++){
    var thisButton = document.getElementById("btnElement"+i);
    thisButton.style.backgroundColor = "yellow";
    thisButton.selected = "N";
    periodicData.at(i).selected = "N";
  }
  console.log("Nothing?");
}

function fnStandardSelection(){
  var standardArray = ["H", "C", "N", "O", "F", "S", "Ar"];
  fnSelectNone();
  for(let i=0; i<standardArray.length; i++){
    var thisIndex = getElementIndex(standardArray.at(i));
    var thisButton = document.getElementById("btnElement"+thisIndex);
    thisButton.style.backgroundColor = "green";
    thisButton.selected = "Y";
    periodicData.at(thisIndex).selected = "Y";
  }

  getListOfSelectedIsotopes();
}

function getListOfSelectedElements(){
  var selectedElements = new Array();
  for(let i=0; i<periodicData.length;i++){
    if(periodicData.at(i).selected === "Y"){ 
//      console.log(periodicData.at(i).Symbol);
      selectedElements.push(periodicData.at(i).Symbol);
    }
  }

  return selectedElements;
}

function getListOfSelectedIsotopes(){
  var theSelectedIsotopes = new Array();
  var theSelectedElements = getListOfSelectedElements();
  var minAbundance = parseFloat(document.getElementById("minAbundance").value);
  var maxRIs = parseFloat(document.getElementById("selMaxRI").value);
  var minHalflife = parseFloat(document.getElementById("minHalflife").value);
  console.log(minAbundance);
  console.log(maxRIs);
  console.log(minHalflife);
  for(let i=0; i<theSelectedElements.length; i++){
    var thisElement = theSelectedElements.at(i);
//    console.log(thisElement);
    for(let j=0; j<NUBASE.length; j++){
      if(thisElement == NUBASE.at(j).element){ 
        if(parseFloat(NUBASE.at(j).abundance) > minAbundance){
//          console.log(NUBASE.at(j).nuclide);
          theSelectedIsotopes.push(NUBASE.at(j).nuclide);
        }
        if(maxRIs > 0) if(parseFloat(NUBASE.at(j).abundance) == 0){
          if(NUBASE.at(j).halflifeSeconds > minHalflife){
//            console.log("%s, %d s", NUBASE.at(j).nuclide, NUBASE.at(j).halflifeSeconds);
            theSelectedIsotopes.push(NUBASE.at(j).nuclide);
          } 
        }
      }
    }
  }
  return theSelectedIsotopes;
}

function fnFindSCM() {
  async function showProcessing() {
      return new Promise(resolve => {
          document.getElementById("btnFindSCM").innerHTML = "Processing...";
          resolve();
      });
  }

  showProcessing()
      .then(() => {
          // Allow UI to update before calling the next function
          return new Promise(resolve => setTimeout(resolve, 10));
      })
      .then(() => reallyFindSCM())
      .catch(error => console.log(error));
}

async function reallyFindSCM(){

  async function addToTable(name, mass, sdev, mdev){
    return new Promise(resolve => {
      const row = document.createElement("tr");

      const cellMoleculeName = document.createElement("td");
      const cellTextMoleculeName = document.createTextNode(name);
      cellMoleculeName.appendChild(cellTextMoleculeName);
      cellMoleculeName.innerHTML = getMarkup(name, parseFloat(document.getElementById("selChargeSCM").value));
      cellMoleculeName.style.width = "80px";
      row.appendChild(cellMoleculeName);

      const cellMoleculeMass = document.createElement("td");
      const cellTextMoleculeMass = document.createTextNode(parseFloat(mass).toFixed(9));
      cellMoleculeMass.appendChild(cellTextMoleculeMass);
      cellMoleculeMass.style.width = "80px";
      row.appendChild(cellMoleculeMass);

      const cellMoleculeDevSigma = document.createElement("td");
      const cellTextMoleculeDevSigma = document.createTextNode(sdev.toFixed(2));
      cellMoleculeDevSigma.appendChild(cellTextMoleculeDevSigma);
      cellMoleculeDevSigma.style.width = "80px";
      row.appendChild(cellMoleculeDevSigma);
      
      const cellMoleculeDevKeV = document.createElement("td");
      const cellTextMoleculeDevKeV = document.createTextNode(mdev.toFixed(1));
      cellMoleculeDevKeV.appendChild(cellTextMoleculeDevKeV);
      cellMoleculeDevKeV.style.width = "80px";
      row.appendChild(cellMoleculeDevKeV);
      
      tblBody.appendChild(row);
//      document.getElementById("SCMTable").appendChild(tblBody);
      resolve();
    });
  }

  var tbl = document.getElementById("SCMTable");
  tbl.innerHTML = "<thead><tr><th>Molecule</th><th>Mass [u]</th><th>Δm [σ]</th><th>Δm [keV]</th></tr></thead>";
  const tblBody = document.createElement("tbody");
  tbl.setAttribute("border", "1");
  tbl.appendChild(tblBody);

  var maxElements = parseInt(document.getElementById("selMaxElements").value);
  var maxAtoms = parseInt(document.getElementById("selMaxAtoms").value);

  var theNuclide1 = document.getElementById("NameRef1");
  var theCharge1 = parseFloat(document.getElementById("selCharge1").value);
  var theMass1 = getMass(theNuclide1.value, theCharge1);
  document.getElementById("Mass1").innerHTML = String(theMass1).concat("", " u");

  var t_ref = parseFloat(document.getElementById("ToF_Ref1").value);
  var dt_ref = parseFloat(document.getElementById("ToF_Ref1err").value);
  if(document.getElementById("ToF_Ref1err").value == "") dt_ref = 0;
  console.log("dt_ref is %f", dt_ref);
  var m_ref = parseFloat(document.getElementById("Mass1").innerHTML);
  var q_ref = parseFloat(document.getElementById("selCharge1").value);
  var m_lap = parseFloat(document.getElementById("ref1Laps").value);

  var t_SCM = parseFloat(document.getElementById("ToF_SCM").value);
  var dt_SCM = parseFloat(document.getElementById("ToF_SCMErr").value);
  if(document.getElementById("ToF_SCMErr").value == "") dt_SCM = 0;
  var q_SCM = parseFloat(document.getElementById("selChargeSCM").value);
  console.log("q_SCM is %f", q_SCM);

  console.log("q_SCM is %f", q_SCM);
  console.log("m_ref is %f", m_ref);
  console.log("q_ref is %f", q_ref);
  console.log("t_SCM is %f", t_SCM);
  console.log("t0withErr is %f", t0withErr.val);
  console.log("t_ref is %f", t_ref);

  var m_SCM = q_SCM*(m_ref/q_ref)*(t_SCM - t0withErr.val)*(t_SCM - t0withErr.val)/((t_ref - t0withErr.val)*(t_ref - t0withErr.val));
  var dm_SCM = Math.sqrt((dt_ref*dt_ref)/(t_ref*t_ref) + (dt_SCM*dt_SCM)/(t_SCM*t_SCM))*m_SCM;

  //calculate mass at lap number
  console.log("t_0 is %f", t0withErr.val);
  console.log("m_SCM is %f", m_SCM);
  console.log("dm_SCM is %f", dm_SCM);

  var theSelectedIsotopes = getListOfSelectedIsotopes();
  if(theSelectedIsotopes.length == 0) alert("No isotopes to choose from!");
  else{  //Look for match
    var theCandidate = "";
    var theWinnersList = new Array();
    if(maxElements == 1) for(let i=0; i<theSelectedIsotopes.length; i++) for(let n=0; n<=maxAtoms; n++){
      theCandidate = String(n).concat("", theSelectedIsotopes.at(i));
//      console.log(theCandidate);
      var test_mass = getMass(theCandidate, q_SCM)/q_SCM; //theSelectedIsotopes.at(i)
      var m_dif = m_SCM - test_mass;
      if(Math.abs(m_dif) < 0.5/q_SCM){
        var sigma = Math.abs(m_dif)/dm_SCM;
        console.log("test_nuclide is %s", theCandidate);//theSelectedIsotopes.at(i));
        console.log("test_mass is %f", test_mass);
        console.log("the difference is %f sigma", sigma);
        addToTable(theCandidate, test_mass, sigma, m_dif*ukeV);

      }
    }
    if(maxElements == 2) for(let i=0; i<theSelectedIsotopes.length; i++) for(let n=0; n<=maxAtoms; n++){
      var theCandidatePart1 = "";
      if(n != 0) theCandidatePart1 = String(n).concat("", theSelectedIsotopes.at(i));
      for(let i2=i+1; i2<theSelectedIsotopes.length; i2++) for(let n2=0; n2<=maxAtoms; n2++){
        var theCandidatePart2 = "";
        if(n2 != 0) theCandidatePart2 = String(n2).concat("", theSelectedIsotopes.at(i2));
        if(n == 0) theCandidate = theCandidatePart2;
        else if(n2 == 0) theCandidate = theCandidatePart1;
        else theCandidate = theCandidatePart1.concat(";", theCandidatePart2);
        if(theCandidate != ""){
          var test_mass = getMass(theCandidate, q_SCM); //theSelectedIsotopes.at(i)
          var m_dif = m_SCM - test_mass;
          if(Math.abs(m_dif) < 0.5/q_SCM){
            var sigma = Math.abs(m_dif)/dm_SCM;
            var alreadyListed = 0;
            for(let winnerIndex=0; winnerIndex<theWinnersList.length; winnerIndex++) 
              if(theWinnersList.at(winnerIndex) == theCandidate) alreadyListed = 1;
            if(alreadyListed == 0){ 
              theWinnersList.push(theCandidate);
              console.log("test_nuclide is %s", theCandidate);//theSelectedIsotopes.at(i));
              console.log("test_mass is %f", test_mass);
              console.log("the difference is %f sigma", sigma);
              addToTable(theCandidate, test_mass, sigma, m_dif*ukeV)
                .then(() => {
                  // Allow UI to update before calling the next function
                  return new Promise(resolve => setTimeout(resolve, 100));
                })
                .catch(error => console.log(error));
              console.log(tblBody.style.height);
            }
          }
        }
      }
    }
    if(maxElements == 3) for(let i=0; i<theSelectedIsotopes.length; i++) for(let n=0; n<=maxAtoms; n++){
      var theCandidatePart1 = "";
      if(n != 0) theCandidatePart1 = String(n).concat("", theSelectedIsotopes.at(i));
      for(let i2=i+1; i2<theSelectedIsotopes.length; i2++) for(let n2=0; n2<=maxAtoms; n2++){
        var theCandidatePart2 = "";
        if(n2 != 0) theCandidatePart2 = String(n2).concat("", theSelectedIsotopes.at(i2));
        for(let i3=i2+1; i3<theSelectedIsotopes.length; i3++) for(let n3=0; n3<=maxAtoms; n3++){
          var theCandidatePart3 = "";
          if(n3 != 0) theCandidatePart3 = String(n3).concat("", theSelectedIsotopes.at(i3));
          if(n == 0){
            if(n2 == 0) theCandidate = theCandidatePart3;
            else if(n3 == 0) theCandidate = theCandidatePart2;
            else theCandidate = theCandidatePart2.concat(";", theCandidatePart3);
          }
          else if(n2 == 0){
            if(n == 0) theCandidate = theCandidatePart3;
            else if(n3 == 0) theCandidate = theCandidatePart1;
            else theCandidate = theCandidatePart1.concat(";", theCandidatePart3);
          }
          else if(n3 == 0){
            if(n == 0) theCandidate = theCandidatePart2;
            if(n2 == 0) theCandidate = theCandidatePart1;
            else theCandidate = theCandidatePart1.concat(";", theCandidatePart2);
          }
          else theCandidate = theCandidatePart1.concat(";", theCandidatePart2.concat(";", theCandidatePart3));
          if(theCandidate != ""){
            var test_mass = getMass(theCandidate, q_SCM); //theSelectedIsotopes.at(i)
            var m_dif = m_SCM - test_mass;
            if(Math.abs(m_dif) < 0.5/q_SCM){
              var sigma = Math.abs(m_dif)/dm_SCM;
              var alreadyListed = 0;
              for(let winnerIndex=0; winnerIndex<theWinnersList.length; winnerIndex++) 
                if(theWinnersList.at(winnerIndex) == theCandidate) alreadyListed = 1;
              if(alreadyListed == 0){ 
                theWinnersList.push(theCandidate);
                addToTable(theCandidate, test_mass, sigma, m_dif*ukeV)
                .then(() => {
                  // Allow UI to update before calling the next function
                  return new Promise(resolve => setTimeout(resolve, 100));
                })
                .catch(error => console.log(error));
              }
            }
          }
        }
      }
    }

  }
  document.getElementById("btnFindSCM").innerHTML = "Find Them!";   

}