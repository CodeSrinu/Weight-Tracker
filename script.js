let addWeightBtnEl = document.getElementById('addWeightBtn');
let popUpEl = document.getElementById('popUpEl');
let mainHeadingEl = document.getElementById('mainHeading');
let weightInputEl = document.getElementById('weightInput');
let popUpAddBtnEl = document.getElementById('popUpAddBtn');
let formEl = document.getElementById('form');
let closeIconEl = document.getElementById('closeIcon');
let weightsAndDataContainer = document.getElementById('weightsAndDataContainer');
let errorMsgEl = document.getElementById('errorMsg');
let weightLossText = document.getElementById('weightLossText');
let strigifiedWeightsData = "";
let weightsData = {};


if(localStorage.getItem("weightsData") === "null" || localStorage.getItem("weightsData") === null){
    weightsData = {};
    localStorage.setItem("weightsData", null);
}
else{
    weightsData = JSON.parse(localStorage.getItem("weightsData"));
    for(let i of Object.keys(weightsData)){ 
        addWeightsData(i);
        calculateWeightLoss();
    }
}

function saveWeightsDataToStorage(){
    strigifiedWeightsData = JSON.stringify(weightsData);
    localStorage.setItem("weightsData", strigifiedWeightsData);
}


function addWeightsData(dateKey){

    let weightDataContainer = document.createElement('li');
    weightDataContainer.id = dateKey;
    weightDataContainer.classList.add("weight-data-item", "m-2", "d-flex", "mt-2", "pl-0");
    weightsAndDataContainer.appendChild(weightDataContainer);

    let dataContainer = document.createElement('div');
    let weight = document.createElement('h1');
    weight.textContent = `${parseFloat(weightsData[dateKey]).toFixed(3)} Kg`;
    weight.classList.add("weight");
    dataContainer.appendChild(weight);


    let date = document.createElement('p');
    date.textContent = dateKey;
    date.classList.add("date");
    dataContainer.appendChild(date);
    weightDataContainer.appendChild(dataContainer);

    let deleteIconContainer = document.createElement('div');
    deleteIconContainer.classList.add("d-flex", "flex-column", "justify-content-center");
    weightDataContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete-icon', 'bi', 'bi-trash3-fill');
    deleteIcon.id = "deleteIcon";
    deleteIconContainer.appendChild(deleteIcon);

    deleteIcon.onclick = function() {
        delete weightsData[dateKey];
        saveWeightsDataToStorage();
        weightsAndDataContainer.removeChild(weightDataContainer);
        calculateWeightLoss();

    }



}


function saveWeight(){
    
        let todayDate = new Date().toLocaleDateString();
        weightsData[todayDate] = weightInputEl.value;
        saveWeightsDataToStorage();
        weightsAndDataContainer.textContent = "";
        for(let i of Object.keys(weightsData)){
            addWeightsData(i);
        }
        calculateWeightLoss();
        weightInputEl.value = "";
        errorMsgEl.textContent = "";
}


function addOrRemoveWeightPopUp() {
    popUpEl.classList.toggle('d-none');
    mainHeadingEl.classList.toggle('d-none');
    addWeightBtnEl.classList.toggle('d-none');
    weightsAndDataContainer.classList.toggle("d-none");
    weightLossText.classList.toggle('d-none');
}


addWeightBtnEl.addEventListener('click', addOrRemoveWeightPopUp);
closeIconEl.addEventListener('click', addOrRemoveWeightPopUp);

formEl.addEventListener('submit', function(event){
    event.preventDefault();
    if(weightInputEl.value !== ""){
        saveWeight();
        addOrRemoveWeightPopUp();
        errorMsgEl.textContent = "";
    }
    else{
        errorMsgEl.textContent = "Please enter Weight!";

    }
});


function calculateWeightLoss(){
    let date = new Date();
    let today = date.toLocaleDateString();
    let yesterday = new Date(date - (86400000)).toLocaleDateString();
    if(Object.keys(weightsData).includes(yesterday) && Object.keys(weightsData).includes(today)){
        let weightLost = weightsData[yesterday] - weightsData[today];
        weightLossText.textContent = `Weight Lost: ${(weightLost).toFixed(3)} Kg`;
    }
    else{
        weightLossText.textContent = `Weight Lost: 0 kg`;
    }
}

