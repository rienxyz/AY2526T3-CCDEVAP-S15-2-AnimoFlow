document.addEventListener('DOMContentLoaded', function() {
   /**
 * AnimoFlow - Campus Map Page
 * 
 * Description: Interactive map of DLSU campus with building markers.
 *              Users can hover markers to see building names and click
 *              for detailed building information.
 * 
 * Features:
 *   - Interactive map with building markers
 *   - Hover tooltips for building names
 *   - Click markers for building details (name, description, floors, elevators)
 *   - Clear button to hide building info
 * 
 * Building Data: 12 campus buildings with coordinates and details
 * Author: AnimoFlow Team
 * Date: August 2026
 */
   
   
   
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) {
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        }
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // ===== NAVBAR FUNCTIONALITY =====
    function updateNavUserEmail() {
        const emailEl = document.getElementById('navUserEmail');
        if (!emailEl) return;
        
        let userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.email && user.email !== 'guest_user') {
                    emailEl.textContent = user.email.split('@')[0];
                    return;
                }
            } catch (e) {}
        }
        
        const adminUser = localStorage.getItem('animoflow_admin_user');
        if (adminUser) {
            try {
                const admin = JSON.parse(adminUser);
                emailEl.textContent = admin.email.split('@')[0];
                return;
            } catch (e) {}
        }
        
        emailEl.textContent = 'Guest';
    }

    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('animoflow_user');
            localStorage.removeItem('animoflow_admin_token');
            localStorage.removeItem('animoflow_admin_user');
            window.location.href = '../login.html';
        });
    }

    updateNavUserEmail();

    // ===== BACK TO DASHBOARD =====
    const backBtn = document.getElementById('backToDashboardBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }

    // ===== SHOW INFO DISPLAY ON PAGE LOAD =====
    const infoDisp = document.getElementById('infodisp');
    if (infoDisp) {
        infoDisp.style.display = 'none';
    }
});

// ===== CAMPUS MAP DATA - FIXED IMAGE PATHS =====
const campusData = {
    lsh: {
        title: "St. La Salle Hall",
        description: "It is the oldest building in the campus. The building has 4 floors and is mainly used by SHS students, however, some SOE and COB subjects hold classes here as well.",
        floors: 4,
        elevators: 2,
        image: "../public/images/buildings/LaSalle.jpg"
    },
    yuch: {
        title: "Don Enrique T. Yuchhengco Hall",
        description: "Known colloquially as 'Yuch' by the students, this building is mostly used for conferences and also holds the Teresa G. Yuchenco auditorium, as well as The Museum.",
        floors: 9,
        elevators: 2,
        image: "../public/images/buildings/Yuch.jpg"
    },
    connon: {
        title: "Br. Gabriel Connon Hall",
        description: "Houses the university clinic, Waldo Prefecto Seminar Room, discussion rooms, and offices of various student organizaions.",
        floors: 5,
        elevators: 1,
        image: "../public/images/buildings/Connon.jpg"
    },
    hsy: {
        title: "Henry Sy Sr. Hall",
        description: "The Henry Sy Sr. Hall is located in the middle of campus grounds. While its not used for classes, it has an open ground floor that is used for a lot of activities, and a library on the 10th to 14th floor.",
        floors: 14,
        elevators: 3,
        image: "../public/images/buildings/Sy.jpg"
    },
    jsph: {
        title: "St. Joseph Hall",
        description: "A building with 6 floors located behind the Henry Sy Sr. Hall, this hall houses the College of Sciences and the SDFO.",
        floors: 6,
        elevators: 2,
        image: "../public/images/buildings/Jos.jpg"
    },
    blmn: {
        title: "Br. Alphonsus Bloemen Hall",
        description: "Building that houses various food stalls as well as the studio of the school broadcasting organization: Green Giant FM.",
        floors: 2,
        elevators: 0,
        image: "../public/images/buildings/BM.jpg"
    },
    velasco: {
        title: "Urbano J. Velasco Hall",
        description: "This 5-storey buildings houses the COE and is located next to the Henry Sy Sr. Hall.",
        floors: 5,
        elevators: 1,
        image: "../public/images/buildings/Vels.jpg"
    },
    migs: {
        title: "St. Miguel Febres Cordero Hall",
        description: "While housing the CLA, this 4-story building also holds some academic offices and and some COE labs. It also has a bridge located at the 2nd floor that leads to the Gokongwei Hall.",
        floors: 4,
        elevators: 1,
        image: "../public/images/buildings/Migs.jpg"
    },
    goks: {
        title: "John Gokongwei Sr. Hall",
        description: "This building is mainly used by CCS subject due to its many computer labs. It has 4 floors with computer laboratories on the 3rd and 4th floor and the school's ITS offiecs. The first floor also serves as a 24-hour study hall. There is a bridge from the 2nd floor leading into Miguel Hall.",
        floors: 4,
        elevators: 0,
        image: "../public/images/buildings/Gokongwei.jpg"
    },
    strc: {
        title: "Science & Technology Research Center",
        description: "This building has many research facilities and labs belonging to the College of Sciences and Engineering.",
        floors: 4,
        elevators: 1,
        image: "../public/images/buildings/strc.jpg"
    },
    andrew: {
        title: "Br. Andrew Gonzalez Hall",
        description: "Having 20 floors, this building is the tallest academic building in the Philippines. It holds a lot of classrooms and offices from various colleges, especially the COE. It also holds the Br. Benedict Resource Center and the Center for Lasallian Formation.",
        floors: 20,
        elevators: 3,
        image: "../public/images/buildings/Ands.jpg"
    },
    razon: {
        title: "Enrique M. Razon Sports Center",
        description: "The main sports facility of the campus. The 10-story sports center holds an olympic-sized swimming pool, a track-and-field oval, various courts and studios, weight training rooms, the George T. Yamg Performing Arts Studious, and Gold's Gym.",
        floors: 10,
        elevators: 1,
        image: "../public/images/buildings/ER.jpg"
    },
};

// ===== SHOW BUILDING INFO FUNCTION =====
function showBuildingInfo(buildingId) {
    const infoDisp = document.getElementById('infodisp');
    if (!infoDisp) return;
    
    infoDisp.style.display = 'block';
    
    const building = campusData[buildingId];
    if (!building) {
        console.error("Building data not found for ID:", buildingId);
        return;
    }
    
    document.getElementById("info-title").innerText = building.title;
    document.getElementById("info-description").innerText = building.description;
    document.getElementById("info-floors").innerText = "Floors: " + building.floors;
    document.getElementById("info-elevators").innerText = "Elevators: " + building.elevators;
    
    const infoImage = document.getElementById("info-image");
    if (infoImage) {
        infoImage.src = building.image;
        infoImage.alt = building.title;
    }
    
    // Scroll to info display
    infoDisp.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== CLEAR BUTTON =====
const clearBtn = document.getElementById('clea');
if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        const infoDisp = document.getElementById('infodisp');
        if (infoDisp) {
            infoDisp.style.display = 'none';
        }
    });
}