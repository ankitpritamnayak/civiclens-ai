let selectedBase64Image = null;

// File Upload Visual Controls & base64 encoding
const imageInput = document.getElementById('imageInput');
const uploadPrompt = document.getElementById('upload-prompt');
const previewContainer = document.getElementById('image-preview-container');
const previewImg = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-img');

if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                selectedBase64Image = event.target.result;
                previewImg.src = selectedBase64Image;
                uploadPrompt.classList.add('hidden');
                previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
}

if (removeImgBtn) {
    removeImgBtn.addEventListener('click', function(e) {
        e.preventDefault();
        imageInput.value = '';
        selectedBase64Image = null;
        uploadPrompt.classList.remove('hidden');
        previewContainer.classList.add('hidden');
    });
}

// Primary Submit Action
// Primary Submit Action
document.getElementById('issueForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const titleVal = document.getElementById('title').value;
    const cityVal = document.getElementById('city').value;
    const locationVal = document.getElementById('location').value;
    const descVal = document.getElementById('description').value;

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    // UI Loading state
    submitBtn.disabled = true;
    btnText.innerText = "Running AI Analysis...";
    btnSpinner.classList.remove('hidden');

    try {
        // Unified call to gemini.js service
        const analysis = await analyzeIssue(titleVal, descVal, selectedBase64Image);

        // Smart Severity-Routing Execution
        const isEmergency = (analysis.severity === "Critical" || analysis.severity === "High");

        // 1. Get the currently logged-in user so we know who is making the report
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        // If nobody is logged in, stop the submission and alert them!
        if (authError || !user) {
            alert("Please log in to submit a report.");
            return; 
        }

        // 2. Save generated structure to Database
        const { data, error } = await supabaseClient
            .from('reports')
            .insert([
                {
                    profile_id: user.id, // PERFECTLY UNCOMMENTED AND CORRECT
                    title: titleVal,
                    city: cityVal,
                    location: locationVal,
                    description: descVal,
                    image_url: selectedBase64Image,
                    status: "Open",
                    category: analysis.category,
                    severity: analysis.severity,
                    department: analysis.department,
                    recommendation: analysis.recommendation,
                    is_emergency: isEmergency
                }
            ]);

        if (error) {
            console.error("Supabase Full Error:", JSON.stringify(error, null, 2));
            alert("Supabase Error: " + error.message);
            return;
        }

        // Display results container view
        displayAIResults(analysis, isEmergency);

    } catch (error) {
        console.error("Application Error:", error);
        alert("An unexpected error occurred during report submission.");
    } finally {
        submitBtn.disabled = false;
        btnText.innerText = "Initiate AI Analysis & Report";
        btnSpinner.classList.add('hidden');
    }
});
// Dynamic output render
function displayAIResults(analysis, isEmergency) {
    document.getElementById('ai-waiting').classList.add('hidden');
    const resultsDiv = document.getElementById('ai-results');
    resultsDiv.classList.remove('hidden');

    document.getElementById('ai-category').innerText = analysis.category;
    document.getElementById('ai-severity').innerText = analysis.severity;
    document.getElementById('ai-department').innerText = analysis.department;
    document.getElementById('ai-recommendation').innerText = analysis.recommendation;

    const badge = document.getElementById('severity-badge');
    badge.innerText = analysis.severity;
    badge.className = "px-2 py-1 rounded text-[10px] font-bold";

    const emergencyBanner = document.getElementById('emergency-routing-banner');
    if (emergencyBanner) emergencyBanner.remove();

    const bannerDiv = document.createElement('div');
    bannerDiv.id = 'emergency-routing-banner';
    bannerDiv.className = "flex items-center gap-2 p-2.5 rounded-lg text-[10px] mt-4 border ";

    if (isEmergency) {
        badge.classList.add('bg-rose-500/20', 'text-rose-400');
        bannerDiv.classList.add('bg-rose-500/10', 'border-rose-500/20', 'text-rose-400');
        bannerDiv.innerHTML = `<i class="fa-solid fa-bolt text-xs"></i> <span><b>AI Emergency Route:</b> Dispatched straight to Government Command Center instantly.</span>`;
    } else {
        if (analysis.severity === "Medium") {
            badge.classList.add('bg-amber-500/20', 'text-amber-400');
        } else {
            badge.classList.add('bg-indigo-500/20', 'text-indigo-400');
        }
        bannerDiv.classList.add('bg-emerald-500/10', 'border-emerald-500/20', 'text-emerald-400');
        bannerDiv.innerHTML = `<i class="fa-solid fa-users text-xs"></i> <span><b>AI Community Route:</b> Staged for local NGO verification & open bounty cleanup layer.</span>`;
    }
    
    resultsDiv.appendChild(bannerDiv);
}