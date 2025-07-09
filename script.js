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
let weightColorEl = document.createElement('weightColor');
let weightStatus = document.createElement('weightStatus');
let themeSelecterEl = document.getElementById('themeSelecter');

let strigifiedWeightsData = "";
let weightsData = {};
let weightsDataArr = [];
let theme = "green-theme";




if(localStorage.getItem("weightsData") === "null" || localStorage.getItem("weightsData") === null){
    weightsData = {};
    localStorage.removeItem("weightsData");
    
}
else{
    weightsData = JSON.parse(localStorage.getItem("weightsData"));
    weightsDataArr = Object.entries(weightsData);
    for(let i = weightsDataArr.length - 1; i >= 0; i--){ 
        addWeightsData(weightsDataArr[i][0]);
        calculateWeightLoss();
    }
}

if(localStorage.getItem("theme") === "null" || localStorage.getItem("theme") === null){
    localStorage.setItem("theme", "green-theme");
}
else{
    theme = localStorage.getItem("theme");
}


document.body.classList.add(theme);


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


function saveWeight() {
    let todayDate = new Date().toISOString().split('T')[0];  // Generates 'YYYY-MM-DD'
    weightsData[todayDate] = weightInputEl.value;
    saveWeightsDataToStorage();
    weightsAndDataContainer.innerHTML = "";  // Clear the container
    weightsDataArr = Object.entries(weightsData);
    for (let i = weightsDataArr.length - 1; i >= 0; i--) {
        addWeightsData(weightsDataArr[i][0]);
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
    themeSelecterEl.classList.toggle('d-none');
    weightInputEl.focus();
}

function findTodayAndpreviousDay(){
    let date = new Date();
    let today = date.toLocaleDateString();
    let previousDay = null;
    let dayCount = 1;
    while (!Object.keys(weightsData).includes(previousDay)){
        previousDay = new Date(date - (dayCount * 86400000)).toLocaleDateString()
        dayCount ++;
    }
    return {today, previousDay};

}


function calculateWeightLoss() {
    let todayStr = new Date().toISOString().split('T')[0];  // 'YYYY-MM-DD'
    let dates = Object.keys(weightsData).map(dateStr => ({ dateStr, date: new Date(dateStr) }));
    let previousEntries = dates.filter(entry => entry.date < new Date(todayStr));
    if (previousEntries.length > 0 && weightsData[todayStr]) {
        let mostRecent = previousEntries.reduce((prev, current) => (prev.date > current.date ? prev : current));
        let previousDay = mostRecent.dateStr;
        let weightChange = weightsData[previousDay] - weightsData[todayStr];
        if (weightChange < 0) {
            weightLossText.textContent = `Weight Gained: ${(weightChange * -1).toFixed(3)} Kg`;
            weightLossText.style.color = "Red";
        } else {
            weightLossText.textContent = `Weight Lost: ${weightChange.toFixed(3)} Kg`;
            weightLossText.style.color = "Green";
        }
    } else {
        weightLossText.textContent = "Weight Lost: 0 kg";
        weightLossText.style.color = "Black";
    }
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

themeSelecterEl.addEventListener('change', function(event){
    // document.body.classList.remove(document.body.classList);
    document.body.className = "";
    document.body.classList.add(event.target.value);
    localStorage.setItem("theme", event.target.value);
});