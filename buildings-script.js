const bDisp = document.getElementById('infodisp');
const confirm = document.getElementById('confi');
const clear = document.getElementById('clea');
const bImage = document.getElementById('bPhoto');
const bDesc = document.getElementById('text');
const bSelect = document.getElementById('buildings');

bDisp.style.display = 'none';

confirm.addEventListener('click', () => {
    confirm.disabled = true;
    bSelect.disabled = true;
    bDisp.style.display = 'block';
    const selected = bSelect.value;

    if(selected === "LS") {
        bImage.src = "Images/LaSalle.jpg";
        bImage.alt = "An image of the St. LaSalle Hall";
        bDesc.textContent = "It is the oldest building in the campus. The building has 4 floors and is mainly used by SHS students, however, some SOE and COB subjects hold classes here as well. ";
    } else if(selected === "G") {
        bImage.src = "Images/Gokongwei.jpg";
        bImage.alt = "An image of the Gokongwei Building";
        bDesc.textContent = "This building is mainly used by CCS subject due to its many computer labs. It has 4 floors with computer laboratories on the 3rd and 4th floor and the school's ITS offiecs. The first floor also serves as a 24-hour study hall. There is a bridge from the 2nd floor leading into Miguel Hall.";
    } else if(selected === "HS") {
        bImage.src = "Images/Sy.jpg";
        bImage.alt = "An image of the Henry Sy Hall";
        bDesc.textContent = "The Henry Sy Sr. Hall is located in the middle of campus grounds. While its not used for classes, it has an open ground floor that is used for a lot of activities, and a library on the 10th to 14th floor.";
    } else if(selected === "Y") {
        bImage.src = "Images/Yuch.jpg";
        bImage.alt = "An image of the Yuchengco Hall";
        bDesc.textContent = "Known colloquially as 'Yuch' by the students, this building is mostly used for conferences and also holds the Teresa G. Yuchenco auditorium, as well as The Museum.";
    } else if(selected === "M") {
        bImage.src = "Images/Migs.jpg";
        bImage.alt = "An image of the Miguel Hall"; 
        bDesc.textContent = "While housing the CLA, this 4-story building also holds some academic offices and and some COE labs. It also has a bridge located at the 2nd floor that leads to the Gokongwei Hall.";
    } else if(selected === "V") {
        bImage.src = "Images/Vels.jpg";
        bImage.alt = "An image of the Velasco Hall";
        bDesc.textContent = "This 5-storey buildings houses the COE and is located next to the Henry Sy Sr. Hall.";
    } else if(selected === "J") {
        bImage.src = "Images/Jos.jpg";
        bImage.alt = "An image of the St. Joseph Hall";
        bDesc.textContent = "A building with 6 floors located behind the Henry Sy Sr. Hall, this hall houses the College of Sciences and the SDFO.";
    } else if(selected === "A") {
        bImage.src = "Images/Ands.jpg";
        bImage.alt = "An image of the Br. Andrew Hall";
        bDesc.textContent = "Having 20 floors, this building is tallest academic building in the Philippines. It holds a lot of classrooms and offices from various colleges, especially the COE. It also holds the Br. Benedict Resource Center and the Center for Lasallian Formation.";
    } else if(selected === "ER") {
        bImage.src = "Images/ER.jpg";
        bImage.alt = "An image of the Enrique M. Razon Sports Center";
        bDesc.textContent = "The main sports facility of the campus. The 10-story sports center holds an olympic-sized swimming pool, a track-and-field oval, various courts and studios, weight training rooms, the George T. Yamg Performing Arts Studious, and Gold's Gym.";
    }

});

clear.addEventListener('click', () => {
    confirm.disabled = false;
    bSelect.disabled = false;
    bDisp.style.display = 'none';
});