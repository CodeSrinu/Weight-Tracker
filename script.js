let addWeightBtnEl = document.getElementById('addWeightBtn');
let popUpEl = document.getElementById('popUpEl');
let mainHeadingEl = document.getElementById('mainHeading');
let weightInputEl = document.getElementById('weightInput');
let popUpAddBtnEl = document.getElementById('popUpAddBtn');
let formEl = document.getElementById('form');
let closeIconEl = document.getElementById('closeIcon');
let weightsAndDataContainer = document.getElementById('weightsAndDataContainer');
let errorMsgEl = document.getElementById('errorMsg');
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

    }



}


function saveWeight(){
    if(weightInputEl.value !== ""){
        let todayDate = new Date().toLocaleDateString();
        weightsData[todayDate] = weightInputEl.value;
        saveWeightsDataToStorage(todayDate);
        addWeightsData(todayDate);
        weightInputEl.value = "";
        errorMsgEl.textContent = "";
    }
    else{
        errorMsgEl.textContent = "Please enter Weight!"

    }
}


function addOrRemoveWeightPopUp() {
    popUpEl.classList.toggle('d-none');
    mainHeadingEl.classList.toggle('d-none');
    addWeightBtnEl.classList.toggle('d-none');
    weightsAndDataContainer.classList.toggle("d-none");
}


addWeightBtnEl.addEventListener('click', addOrRemoveWeightPopUp);
closeIconEl.addEventListener('click', addOrRemoveWeightPopUp);

formEl.addEventListener('submit', function(event){
    event.preventDefault();
    saveWeight();
    addOrRemoveWeightPopUp();
});



