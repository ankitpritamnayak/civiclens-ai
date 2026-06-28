// LocalStorage storage key
const STORAGE_KEY = 'civiclens_reports';

// Mock Initial data template to pre-populate local storage on first launch
const MOCK_INITIAL_REPORTS = [
    {
        id: "rep-001",
        title: "Major Pothole on Patia Station Road",
        category: "Road",
        city: "Bhubaneswar",
        location: "Patia, near Station Road",
        description: "A wide, deep pothole has opened up right near the central junction, posing a high hazard to motorcyclists in the evening. Water keeps settling inside it.",
        status: "Open",
        timestamp: "2026-06-23T14:32:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Road",
            severity: "High",
            department: "Road Maintenance Dept",
            recommendation: "Immediate structural backfilling required; place caution markers immediately."
        }
    },
    {
        id: "rep-002",
        title: "Garbage Pile-up near Damana Square",
        category: "Garbage",
        city: "Bhubaneswar",
        location: "Damana, behind reliance store",
        description: "Local marketplace dumping waste along the service lane. Heavy odor and dogs scavenging, blocking light pedestrian transit lanes.",
        status: "In Progress",
        timestamp: "2026-06-24T09:15:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Garbage",
            severity: "Medium",
            department: "Municipal Sanitation Department",
            recommendation: "Deploy standard waste truck collector and schedule daily surveillance sweeps."
        }
    },
    {
        id: "rep-003",
        title: "Broken Street Light in Sahid Nagar",
        category: "Street Light",
        city: "Bhubaneswar",
        location: "Sahid Nagar, Lane 3",
        description: "Entire line of street lamps is down on this lane, causing complete dark zone areas after sunset. High security risk for evening commuters.",
        status: "Resolved",
        timestamp: "2026-06-22T21:40:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Street Light",
            severity: "Medium",
            department: "Electrical & Public Lighting",
            recommendation: "Inspect junction boxes on Pole 14B and restore fuse links."
        }
    },
    {
        id: "rep-004",
        title: "Water Main Leakage near Ring Road",
        category: "Water Supply",
        city: "Cuttack",
        location: "Ring Road, adjacent to Deer Park",
        description: "Clean drinking water pressure leak venting onto concrete tracks. Flooding has begun adjacent park areas for consecutive days.",
        status: "Open",
        timestamp: "2026-06-24T11:05:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Water Supply",
            severity: "High",
            department: "Water & Sewerage Board",
            recommendation: "Emergency valve isolation required to halt system pressure loss and prevent base erosion."
        }
    },
    {
        id: "rep-005",
        title: "Plastic Waste Pile-up at Sea Beach",
        category: "Garbage",
        city: "Puri",
        location: "Golden Beach, Lighthouse lane",
        description: "Plastic containers, waste packaging strewn around beach tourist pathways. Threatening marine life and visual aesthetics.",
        status: "Open",
        timestamp: "2026-06-23T07:22:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Garbage",
            severity: "High",
            department: "Beach Administration Committee",
            recommendation: "Organize automated raking systems and deploy extra public disposal bins."
        }
    },
    {
        id: "rep-006",
        title: "Sewer Line Overflow in Sector 5",
        category: "Drainage",
        city: "Rourkela",
        location: "Sector 5 Market Row",
        description: "Sewer inspection chamber is clogged, causing liquid waste to seep into local marketplace aisles.",
        status: "Resolved",
        timestamp: "2026-06-21T18:30:00.000Z",
        image: null,
        aiAnalysis: {
            category: "Drainage",
            severity: "High",
            department: "Sewerage Infrastructure Div.",
            recommendation: "Run vacuum drainage clears and sanitise target corridors."
        }
    }
];

// Verify or initialize data in LocalStorage
function initDatabase() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_REPORTS));
    }
}

// Get raw storage data array
function getReports() {
    initDatabase();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Persist storage records array
function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

// Render dynamic configuration indicators on load
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
});