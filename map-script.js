const mDisp = document.getElementById('infodisp');
const clear = document.getElementById('clea');
const maps = document.getElementById('map');

mDisp.style.display = 'none';

const campusData = {
    lsh: {
        title: "St. La Salle Hall",
        description: "It is the oldest building in the campus. The building has 4 floors and is mainly used by SHS students, however, some SOE and COB subjects hold classes here as well. ",
        floors: 4,
        elevators: 2,
        image: "Images/LaSalle.jpg"
    },
    yuch: {
        title: "Don Enrique T. Yuchhengco Hall",
        description: "Known colloquially as 'Yuch' by the students, this building is mostly used for conferences and also holds the Teresa G. Yuchenco auditorium, as well as The Museum.",
        floors: 9,
        elevators: 2,
        image: "Images/Yuch.jpg"
    },
    connon: {
        title: "Br. Gabriel Connon Hall",
        description: "Houses the university clinic, Waldo Prefecto Seminar Room, discussion rooms, and offices of various student organizaions.",
        floors: 5,
        elevators: 1,
        image: "Images/Connon.jpg"
    },
    hsy: {
        title: "Henry Sy Sr. Hall",
        description: "The Henry Sy Sr. Hall is located in the middle of campus grounds. While its not used for classes, it has an open ground floor that is used for a lot of activities, and a library on the 10th to 14th floor.",
        floors: 14,
        elevators: 3,
        image: "Images/Sy.jpg"
    },
    jsph: {
        title: "St. Joseph Hall",
        description: "A building with 6 floors located behind the Henry Sy Sr. Hall, this hall houses the College of Sciences and the SDFO.",
        floors: 6,
        elevators: 2,
        image: "Images/Jos.jpg"
    },
    blmn: {
        title: "Br. Alphonsus Bloemen Hal",
        description: "Building that houses various food stalls as well as the studio of the school broadcasting organization: Green Giant FM.",
        floors: 2,
        elevators: 0,
        image: "Images/BM.jpg"
    },
    velasco: {
        title: "Urbano J. Velasco Hall",
        description: "This 5-storey buildings houses the COE and is located next to the Henry Sy Sr. Hall.",
        floors: 5,
        elevators: 1,
        image: "Images/Vels.jpg"
    },
    migs: {
        title: "St. Miguel Febres Cordero Hall",
        description: "While housing the CLA, this 4-story building also holds some academic offices and and some COE labs. It also has a bridge located at the 2nd floor that leads to the Gokongwei Hall.",
        floors: 4,
        elevators: 1,
        image: "Images/Migs.jpg"
    },
    goks: {
        title: "John Gokongwei Sr. Hall",
        description: "This building is mainly used by CCS subject due to its many computer labs. It has 4 floors with computer laboratories on the 3rd and 4th floor and the school's ITS offiecs. The first floor also serves as a 24-hour study hall. There is a bridge from the 2nd floor leading into Miguel Hall.",
        floors: 4,
        elevators: 0,
        image: "Images/Gokongwei.jpg"
    },
    strc: {
        title: "Science & Technology Research Center",
        description: "This building has many research facilities and labs belonging to the College of Sciences and Engineering.",
        floors: 4,
        elevators: 1,
        image: "Images/strc.jpg"
    },
    andrew: {
        title: "Br. Andrew Gonzalez Hall",
        description: "Having 20 floors, this building is the tallest academic building in the Philippines. It holds a lot of classrooms and offices from various colleges, especially the COE. It also holds the Br. Benedict Resource Center and the Center for Lasallian Formation.",
        floors: 20,
        elevators: 3,
        image: "Images/Ands.jpg"
    },
    razon: {
        title: "Enrique M. Razon Sports Center",
        description: "The main sports facility of the campus. The 10-story sports center holds an olympic-sized swimming pool, a track-and-field oval, various courts and studios, weight training rooms, the George T. Yamg Performing Arts Studious, and Gold's Gym.",
        floors: 10,
        elevators: 1,
        image: "Images/ER.jpg"
    },
};

function showBuildingInfo(buildingId) {
    mDisp.style.display = 'block';
    const building = campusData[buildingId];
    
    if (!building) {
        console.error("Building data not found for ID:", buildingId);
        return;
    }

    document.getElementById("info-title").innerText = building.title;
    document.getElementById("info-description").innerText = building.description;
    document.getElementById("info-floors").innerText = `Floors: ${building.floors}`;
    document.getElementById("info-elevators").innerText = `Elevators: ${building.elevators}`;
    document.getElementById("info-image").src = building.image;
}

clear.addEventListener('click', () => {
    mDisp.style.display = 'none';
});