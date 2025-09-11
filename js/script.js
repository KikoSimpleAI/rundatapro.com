// RunMetrics Pro JavaScript Functions

// Time validation function
function validateTimeFormat(timeString, fieldName = 'time') {
    if (!timeString || timeString.trim() === '') {
        return { valid: false, message: `Please enter a ${fieldName}` };
    }
    
    // Remove any extra spaces
    timeString = timeString.trim();
    
    // Check if it contains only digits and colons
    if (!/^[\d:]+$/.test(timeString)) {
        return { valid: false, message: `${fieldName} can only contain numbers and colons (e.g., 25:30 or 1:23:45)` };
    }
    
    const parts = timeString.split(':');
    
    // Check for valid number of parts (2 or 3)
    if (parts.length < 2 || parts.length > 3) {
        return { valid: false, message: `${fieldName} must be in MM:SS or HH:MM:SS format` };
    }
    
    // Check for empty parts
    if (parts.some(part => part === '')) {
        return { valid: false, message: `${fieldName} cannot have empty parts (e.g., ::30 is invalid)` };
    }
    
    // Validate each part
    for (let i = 0; i < parts.length; i++) {
        const part = parseInt(parts[i]);
        if (isNaN(part) || part < 0) {
            return { valid: false, message: `${fieldName} contains invalid numbers` };
        }
        
        // Check specific ranges
        if (i === 0) { // Minutes or hours
            if (parts.length === 2 && part > 59) {
                return { valid: false, message: `Minutes cannot exceed 59 in MM:SS format` };
            }
            if (parts.length === 3 && part > 23) {
                return { valid: false, message: `Hours cannot exceed 23 in HH:MM:SS format` };
            }
        } else if (i === 1) { // Minutes or seconds
            if (part > 59) {
                return { valid: false, message: `Minutes cannot exceed 59` };
            }
        } else if (i === 2) { // Seconds
            if (part > 59) {
                return { valid: false, message: `Seconds cannot exceed 59` };
            }
        }
    }
    
    // Check for reasonable time ranges
    const totalSeconds = timeToSeconds(timeString);
    if (totalSeconds < 60) {
        return { valid: false, message: `${fieldName} seems too short (less than 1 minute)` };
    }
    if (totalSeconds > 36000) { // 10 hours
        return { valid: false, message: `${fieldName} seems too long (more than 10 hours)` };
    }
    
    return { valid: true, message: '' };
}

// Helper functions for input error display
function showInputError(input, message) {
    // Remove existing error message
    hideInputError(input);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 0.8em;
        margin-top: 5px;
        padding: 5px 10px;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 5px;
        border-left: 3px solid #ff6b6b;
    `;
    
    // Insert after the input's parent (input-group)
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
        inputGroup.appendChild(errorDiv);
    }
}

function hideInputError(input) {
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
        const existingError = inputGroup.querySelector('.input-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Metric popup functionality
function showMetricPopup(metricType) {
    const popup = document.getElementById('metricPopup');
    const title = document.getElementById('popupTitle');
    const icon = document.getElementById('popupIcon');
    const content = document.getElementById('popupContent');
    
    const metricData = getMetricData(metricType);
    
    title.textContent = metricData.title;
    icon.textContent = metricData.icon;
    content.innerHTML = metricData.content;
    
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMetricPopup() {
    const popup = document.getElementById('metricPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function getMetricData(metricType) {
    const metrics = {
        pace: {
            title: '⏱️ Pace',
            icon: '⏱️',
            content: `
                <h4>What is Pace?</h4>
                <p>Pace is the time it takes to cover a specific distance, typically expressed as minutes per mile or minutes per kilometer. It's the most fundamental metric for runners and directly correlates with race performance.</p>
                
                <h4>Why Track Pace?</h4>
                <ul>
                    <li><strong>Race Strategy:</strong> Helps you maintain consistent effort throughout a race</li>
                    <li><strong>Training Zones:</strong> Different paces target different energy systems</li>
                    <li><strong>Progress Tracking:</strong> Shows improvement over time</li>
                    <li><strong>Goal Setting:</strong> Provides concrete targets for training</li>
                </ul>
                
                <h4>How to Use Pace:</h4>
                <ul>
                    <li><strong>Easy Runs:</strong> 1-2 minutes slower than 5K pace</li>
                    <li><strong>Tempo Runs:</strong> 15-30 seconds slower than 5K pace</li>
                    <li><strong>Intervals:</strong> At or slightly faster than 5K pace</li>
                    <li><strong>Long Runs:</strong> 1-3 minutes slower than marathon pace</li>
                </ul>
            `
        },
        heartrate: {
            title: '❤️ Heart Rate',
            icon: '❤️',
            content: `
                <h4>What is Heart Rate?</h4>
                <p>Heart rate measures how many times your heart beats per minute (BPM). It's an excellent indicator of exercise intensity and helps ensure you're training in the right zones for your goals.</p>
                
                <h4>Heart Rate Zones:</h4>
                <ul>
                    <li><strong>Zone 1 (50-60% max HR):</strong> Recovery and warm-up</li>
                    <li><strong>Zone 2 (60-70% max HR):</strong> Aerobic base building</li>
                    <li><strong>Zone 3 (70-80% max HR):</strong> Aerobic endurance</li>
                    <li><strong>Zone 4 (80-90% max HR):</strong> Lactate threshold</li>
                    <li><strong>Zone 5 (90-100% max HR):</strong> VO2 max intervals</li>
                </ul>
                
                <h4>Benefits of HR Training:</h4>
                <ul>
                    <li><strong>Prevents Overtraining:</strong> Keeps you in appropriate intensity zones</li>
                    <li><strong>Improves Efficiency:</strong> Builds aerobic capacity</li>
                    <li><strong>Recovery Monitoring:</strong> Higher resting HR may indicate fatigue</li>
                    <li><strong>Personalized Training:</strong> Adapts to your fitness level</li>
                </ul>
                
                <h4>Max HR Calculation:</h4>
                <p>220 - your age (general formula) or use a field test for more accuracy.</p>
            `
        },
        cadence: {
            title: '👟 Cadence',
            icon: '👟',
            content: `
                <h4>What is Cadence?</h4>
                <p>Cadence is the number of steps you take per minute (SPM). It's a key indicator of running efficiency and can help reduce injury risk and improve performance.</p>
                
                <h4>Optimal Cadence:</h4>
                <ul>
                    <li><strong>Target Range:</strong> 170-180 steps per minute</li>
                    <li><strong>Elite Runners:</strong> Often 180+ SPM</li>
                    <li><strong>Beginners:</strong> May start at 160-165 SPM</li>
                    <li><strong>Individual Variation:</strong> Height and leg length affect optimal cadence</li>
                </ul>
                
                <h4>Benefits of Higher Cadence:</h4>
                <ul>
                    <li><strong>Reduced Impact:</strong> Shorter strides = less ground contact time</li>
                    <li><strong>Better Efficiency:</strong> Less vertical oscillation</li>
                    <li><strong>Injury Prevention:</strong> Reduces stress on joints</li>
                    <li><strong>Improved Form:</strong> Encourages midfoot landing</li>
                </ul>
                
                <h4>How to Improve Cadence:</h4>
                <ul>
                    <li>Use a metronome app during runs</li>
                    <li>Focus on quick, light steps</li>
                    <li>Gradually increase by 5-10 SPM</li>
                    <li>Practice during easy runs first</li>
                </ul>
            `
        },
        mileage: {
            title: '📏 Weekly Mileage',
            icon: '📏',
            content: `
                <h4>What is Weekly Mileage?</h4>
                <p>Weekly mileage is the total distance you run in a week. It's the foundation of endurance training and the primary driver of aerobic fitness improvements.</p>
                
                <h4>The 10% Rule:</h4>
                <ul>
                    <li><strong>Safe Progression:</strong> Increase weekly mileage by no more than 10%</li>
                    <li><strong>Injury Prevention:</strong> Allows body to adapt gradually</li>
                    <li><strong>Consistency:</strong> Better to run consistently than sporadically</li>
                    <li><strong>Recovery Weeks:</strong> Reduce mileage every 3-4 weeks</li>
                </ul>
                
                <h4>Mileage Guidelines by Goal:</h4>
                <ul>
                    <li><strong>5K Training:</strong> 20-40 miles per week</li>
                    <li><strong>10K Training:</strong> 30-50 miles per week</li>
                    <li><strong>Half Marathon:</strong> 40-70 miles per week</li>
                    <li><strong>Marathon:</strong> 50-100+ miles per week</li>
                </ul>
                
                <h4>Quality vs. Quantity:</h4>
                <ul>
                    <li><strong>80/20 Rule:</strong> 80% easy runs, 20% hard efforts</li>
                    <li><strong>Long Runs:</strong> 20-30% of weekly mileage</li>
                    <li><strong>Recovery:</strong> Easy days between hard workouts</li>
                    <li><strong>Listen to Your Body:</strong> Adjust based on how you feel</li>
                </ul>
            `
        },
        vo2max: {
            title: '🫁 VO2 Max',
            icon: '🫁',
            content: `
                <h4>What is VO2 Max?</h4>
                <p>VO2 Max is the maximum amount of oxygen your body can utilize during intense exercise. It's considered the gold standard for measuring aerobic fitness and endurance capacity.</p>
                
                <h4>What VO2 Max Tells You:</h4>
                <ul>
                    <li><strong>Aerobic Capacity:</strong> How efficiently your body uses oxygen</li>
                    <li><strong>Endurance Potential:</strong> Higher VO2 Max = better endurance performance</li>
                    <li><strong>Training Effectiveness:</strong> Shows if your training is working</li>
                    <li><strong>Genetic Potential:</strong> Influenced by genetics but can be improved</li>
                </ul>
                
                <h4>How to Improve VO2 Max:</h4>
                <ul>
                    <li><strong>High-Intensity Intervals:</strong> 3-5 minute efforts at 95-100% max HR</li>
                    <li><strong>Hill Training:</strong> Builds power and aerobic capacity</li>
                    <li><strong>Consistent Training:</strong> Regular aerobic exercise</li>
                    <li><strong>Progressive Overload:</strong> Gradually increase intensity</li>
                </ul>
                
                <h4>Typical VO2 Max Values:</h4>
                <ul>
                    <li><strong>Elite Male Runners:</strong> 70-85 ml/kg/min</li>
                    <li><strong>Elite Female Runners:</strong> 60-75 ml/kg/min</li>
                    <li><strong>Recreational Runners:</strong> 35-55 ml/kg/min</li>
                    <li><strong>Age Factor:</strong> Decreases by ~1% per year after 30</li>
                </ul>
            `
        },
        rpe: {
            title: '💭 Rate of Perceived Exertion (RPE)',
            icon: '💭',
            content: `
                <h4>What is RPE?</h4>
                <p>Rate of Perceived Exertion is a subjective scale (1-10) that measures how hard you feel you're working during exercise. It's a simple but powerful tool for monitoring training intensity.</p>
                
                <h4>RPE Scale:</h4>
                <ul>
                    <li><strong>1-2:</strong> Very easy, can maintain conversation easily</li>
                    <li><strong>3-4:</strong> Easy, comfortable pace</li>
                    <li><strong>5-6:</strong> Moderate, can hold conversation</li>
                    <li><strong>7-8:</strong> Hard, difficult to talk</li>
                    <li><strong>9-10:</strong> Maximum effort, cannot speak</li>
                </ul>
                
                <h4>Benefits of RPE:</h4>
                <ul>
                    <li><strong>No Equipment Needed:</strong> Always available</li>
                    <li><strong>Accounts for Daily Variation:</strong> Adapts to how you feel</li>
                    <li><strong>Holistic Assessment:</strong> Considers all factors affecting effort</li>
                    <li><strong>Prevents Overtraining:</strong> Listen to your body's signals</li>
                </ul>
                
                <h4>Using RPE in Training:</h4>
                <ul>
                    <li><strong>Easy Runs:</strong> RPE 3-4</li>
                    <li><strong>Tempo Runs:</strong> RPE 6-7</li>
                    <li><strong>Intervals:</strong> RPE 8-9</li>
                    <li><strong>Recovery:</strong> RPE 2-3</li>
                </ul>
                
                <h4>Tips for Accurate RPE:</h4>
                <ul>
                    <li>Check in with yourself every 10-15 minutes</li>
                    <li>Consider breathing, muscle fatigue, and overall feeling</li>
                    <li>Be honest about your effort level</li>
                    <li>Use it alongside other metrics for best results</li>
                </ul>
            `
        },
        sleep: {
            title: '😴 Sleep',
            icon: '😴',
            content: `
                <h4>Why Sleep Matters for Runners:</h4>
                <p>Sleep is when your body repairs muscle tissue, consolidates learning, and releases growth hormone. For runners, quality sleep is as important as training itself.</p>
                
                <h4>Sleep Requirements:</h4>
                <ul>
                    <li><strong>Adults:</strong> 7-9 hours per night</li>
                    <li><strong>Elite Athletes:</strong> 8-10 hours per night</li>
                    <li><strong>During Heavy Training:</strong> May need 9-10 hours</li>
                    <li><strong>Quality Matters:</strong> Deep sleep is crucial for recovery</li>
                </ul>
                
                <h4>Sleep's Impact on Performance:</h4>
                <ul>
                    <li><strong>Recovery:</strong> Muscle repair happens during deep sleep</li>
                    <li><strong>Immune Function:</strong> Reduces risk of illness</li>
                    <li><strong>Mental Focus:</strong> Better decision-making during races</li>
                    <li><strong>Hormone Balance:</strong> Regulates cortisol and growth hormone</li>
                </ul>
                
                <h4>Signs of Poor Sleep:</h4>
                <ul>
                    <li>Higher resting heart rate</li>
                    <li>Increased perceived exertion</li>
                    <li>Slower recovery between workouts</li>
                    <li>Mood changes and irritability</li>
                </ul>
                
                <h4>Sleep Optimization Tips:</h4>
                <ul>
                    <li>Maintain consistent sleep schedule</li>
                    <li>Create a cool, dark sleeping environment</li>
                    <li>Avoid screens 1 hour before bed</li>
                    <li>Limit caffeine after 2 PM</li>
                    <li>Consider sleep tracking to monitor patterns</li>
                </ul>
            `
        },
        groundcontact: {
            title: '⚡ Ground Contact Time',
            icon: '⚡',
            content: `
                <h4>What is Ground Contact Time?</h4>
                <p>Ground contact time is how long your foot stays on the ground with each step. It's measured in milliseconds and is a key indicator of running efficiency.</p>
                
                <h4>Optimal Ground Contact Time:</h4>
                <ul>
                    <li><strong>Elite Runners:</strong> 150-200 milliseconds</li>
                    <li><strong>Recreational Runners:</strong> 200-300 milliseconds</li>
                    <li><strong>Shorter is Better:</strong> Less time on ground = more efficient</li>
                    <li><strong>Speed Dependent:</strong> Faster running = shorter contact time</li>
                </ul>
                
                <h4>Why It Matters:</h4>
                <ul>
                    <li><strong>Efficiency:</strong> Less energy wasted on ground contact</li>
                    <li><strong>Speed:</strong> Quicker turnover allows faster pace</li>
                    <li><strong>Injury Prevention:</strong> Reduces impact forces</li>
                    <li><strong>Form Indicator:</strong> Reflects overall running technique</li>
                </ul>
                
                <h4>Factors Affecting Ground Contact Time:</h4>
                <ul>
                    <li><strong>Cadence:</strong> Higher cadence = shorter contact time</li>
                    <li><strong>Foot Strike:</strong> Forefoot/midfoot landing is typically shorter</li>
                    <li><strong>Muscle Strength:</strong> Stronger muscles = quicker push-off</li>
                    <li><strong>Running Surface:</strong> Harder surfaces may increase contact time</li>
                </ul>
                
                <h4>How to Improve:</h4>
                <ul>
                    <li>Increase cadence (steps per minute)</li>
                    <li>Strengthen calf and foot muscles</li>
                    <li>Practice quick, light steps</li>
                    <li>Focus on midfoot landing</li>
                    <li>Include plyometric exercises</li>
                </ul>
            `
        },
        vertical: {
            title: '📊 Vertical Oscillation',
            icon: '📊',
            content: `
                <h4>What is Vertical Oscillation?</h4>
                <p>Vertical oscillation measures how much your body bounces up and down while running. It's the vertical displacement of your center of mass with each step, measured in centimeters.</p>
                
                <h4>Optimal Vertical Oscillation:</h4>
                <ul>
                    <li><strong>Elite Runners:</strong> 6-8 cm</li>
                    <li><strong>Recreational Runners:</strong> 8-12 cm</li>
                    <li><strong>Less is Better:</strong> Lower oscillation = more efficient</li>
                    <li><strong>Speed Dependent:</strong> Faster running = slightly higher oscillation</li>
                </ul>
                
                <h4>Why It Matters:</h4>
                <ul>
                    <li><strong>Energy Efficiency:</strong> Less energy wasted on vertical movement</li>
                    <li><strong>Forward Motion:</strong> Energy should go forward, not up</li>
                    <li><strong>Impact Forces:</strong> Higher oscillation = more impact</li>
                    <li><strong>Running Economy:</strong> Directly affects oxygen consumption</li>
                </ul>
                
                <h4>Factors Affecting Vertical Oscillation:</h4>
                <ul>
                    <li><strong>Stride Length:</strong> Longer strides often increase oscillation</li>
                    <li><strong>Cadence:</strong> Higher cadence typically reduces oscillation</li>
                    <li><strong>Muscle Strength:</strong> Stronger core and legs help control bounce</li>
                    <li><strong>Running Form:</strong> Posture and foot strike pattern matter</li>
                </ul>
                
                <h4>How to Reduce Vertical Oscillation:</h4>
                <ul>
                    <li>Increase cadence (aim for 170-180 SPM)</li>
                    <li>Strengthen core muscles</li>
                    <li>Focus on forward lean from ankles</li>
                    <li>Practice running with a metronome</li>
                    <li>Work on quick, light foot strikes</li>
                    <li>Include single-leg balance exercises</li>
                </ul>
                
                <h4>Monitoring Tips:</h4>
                <ul>
                    <li>Use a running watch with advanced metrics</li>
                    <li>Track trends over time rather than single runs</li>
                    <li>Compare values at similar paces</li>
                    <li>Focus on gradual improvement</li>
                </ul>
            `
        }
    };
    
    return metrics[metricType] || { title: 'Metric', icon: '📊', content: 'Information not available.' };
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Race time prediction using Jack Daniels formula
function predictRaceTime() {
    const prevDistance = document.getElementById('prevDistance').value;
    const prevTime = document.getElementById('prevTime').value;
    const targetDistance = document.getElementById('targetDistance').value;
    
    // Validate the time input
    const timeValidation = validateTimeFormat(prevTime, 'previous race time');
    if (!timeValidation.valid) {
        alert(timeValidation.message);
        return;
    }
    
    const distances = {
        '5k': 5,
        '10k': 10,
        'half': 21.1,
        'full': 42.2
    };
    
    const distanceNames = {
        '5k': '5K',
        '10k': '10K',
        'half': 'Half Marathon',
        'full': 'Marathon'
    };
    
    // Convert time to seconds
    const timeParts = prevTime.split(':');
    let totalSeconds;
    if (timeParts.length === 2) {
        totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    } else if (timeParts.length === 3) {
        totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
    }
    
    // Jack Daniels formula for race prediction
    const prevDistanceKM = distances[prevDistance];
    const targetDistanceKM = distances[targetDistance];
    
    // Velocity calculation
    const prevVelocity = prevDistanceKM / (totalSeconds / 3600); // km/h
    
    // Pace degradation factor based on distance ratio
    const ratio = targetDistanceKM / prevDistanceKM;
    const degradationFactor = Math.pow(ratio, 0.07); // Empirical formula
    
    const predictedVelocity = prevVelocity / degradationFactor;
    const predictedTime = (targetDistanceKM / predictedVelocity) * 3600; // seconds
    
    // Convert back to time format
    const hours = Math.floor(predictedTime / 3600);
    const minutes = Math.floor((predictedTime % 3600) / 60);
    const seconds = Math.floor(predictedTime % 60);
    
    let timeString;
    if (hours > 0) {
        timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Calculate pace per mile and km
    const pacePerMileSeconds = predictedTime / (targetDistanceKM * 0.621371);
    const pacePerKmSeconds = predictedTime / targetDistanceKM;
    
    const pacePerMile = `${Math.floor(pacePerMileSeconds / 60)}:${(Math.floor(pacePerMileSeconds % 60)).toString().padStart(2, '0')}`;
    const pacePerKm = `${Math.floor(pacePerKmSeconds / 60)}:${(Math.floor(pacePerKmSeconds % 60)).toString().padStart(2, '0')}`;
    
    document.getElementById('predictionResult').innerHTML = `
        <h4>🎯 Predicted ${distanceNames[targetDistance]} Time</h4>
        <p><strong>Predicted Time:</strong> ${timeString}</p>
        <p><strong>Pace per Mile:</strong> ${pacePerMile}</p>
        <p><strong>Pace per KM:</strong> ${pacePerKm}</p>
        <p><em>Note: This prediction assumes similar training and race conditions.</em></p>
    `;
    document.getElementById('predictionResult').style.display = 'block';
}

// Calculate weekly mileage progression using 10% rule
function calculateMileageProgression() {
    const current = parseInt(document.getElementById('currentMileage').value);
    const weeks = parseInt(document.getElementById('weeksToGoal').value);
    const target = parseInt(document.getElementById('targetMileage').value);
    
    if (!current || !weeks || !target) {
        alert('Please fill in all fields');
        return;
    }
    
    const weeklyIncrease = (target - current) / weeks;
    const maxSafeIncrease = current * 0.10; // 10% rule
    
    let progression = [];
    let currentWeekMileage = current;
    
    for (let i = 1; i <= weeks; i++) {
        const increase = Math.min(weeklyIncrease, maxSafeIncrease);
        currentWeekMileage += increase;
        if (currentWeekMileage > target) currentWeekMileage = target;
        progression.push({week: i, mileage: Math.round(currentWeekMileage)});
    }
    
    let resultHTML = `
        <h4>📈 Weekly Mileage Progression</h4>
        <p><strong>Weekly Increase:</strong> ${weeklyIncrease.toFixed(1)} miles (Safe max: ${maxSafeIncrease.toFixed(1)} miles)</p>
    `;
    
    if (weeklyIncrease > maxSafeIncrease) {
        resultHTML += `<p style="color: #ff6b6b;"><strong>⚠️ Warning:</strong> Your target requires faster progression than the 10% rule. Consider extending your timeline.</p>`;
    }
    
    resultHTML += `<div style="margin-top: 15px;">`;
    progression.forEach(week => {
        resultHTML += `<div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span>Week ${week.week}:</span>
            <span><strong>${week.mileage} miles</strong></span>
        </div>`;
    });
    resultHTML += `</div>`;
    
    document.getElementById('mileageResult').innerHTML = resultHTML;
    document.getElementById('mileageResult').style.display = 'block';
}

// Calculate heart rate training zones
function calculateHRZones() {
    const age = parseInt(document.getElementById('age').value);
    const restingHR = parseInt(document.getElementById('restingHR').value) || 60;
    
    if (!age) {
        alert('Please enter your age');
        return;
    }
    
    const maxHR = 220 - age;
    const hrReserve = maxHR - restingHR;
    
    const zones = [
        {name: 'Zone 1 - Recovery', min: Math.round(restingHR + hrReserve * 0.5), max: Math.round(restingHR + hrReserve * 0.6), purpose: 'Active recovery, warm-up'},
        {name: 'Zone 2 - Aerobic Base', min: Math.round(restingHR + hrReserve * 0.6), max: Math.round(restingHR + hrReserve * 0.7), purpose: 'Easy runs, base building'},
        {name: 'Zone 3 - Aerobic', min: Math.round(restingHR + hrReserve * 0.7), max: Math.round(restingHR + hrReserve * 0.8), purpose: 'Steady runs, marathon pace'},
        {name: 'Zone 4 - Threshold', min: Math.round(restingHR + hrReserve * 0.8), max: Math.round(restingHR + hrReserve * 0.9), purpose: 'Tempo runs, lactate threshold'},
        {name: 'Zone 5 - VO2 Max', min: Math.round(restingHR + hrReserve * 0.9), max: maxHR, purpose: 'Intervals, 5K pace'}
    ];
    
    let resultHTML = `
        <h4>💓 Your Heart Rate Training Zones</h4>
        <p><strong>Max HR:</strong> ${maxHR} bpm | <strong>Resting HR:</strong> ${restingHR} bpm</p>
    `;
    
    zones.forEach(zone => {
        resultHTML += `
            <div class="zone">
                <div>
                    <div class="zone-name">${zone.name}</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${zone.purpose}</div>
                </div>
                <div class="zone-range">${zone.min}-${zone.max} bpm</div>
            </div>
        `;
    });
    
    document.getElementById('hrZonesResult').innerHTML = resultHTML;
    document.getElementById('hrZonesResult').style.display = 'block';
}

// Calculate training paces based on 5K time
function calculateTrainingPaces() {
    const fiveKTime = document.getElementById('fiveKTime').value;
    
    // Validate the time input
    const timeValidation = validateTimeFormat(fiveKTime, '5K time');
    if (!timeValidation.valid) {
        alert(timeValidation.message);
        return;
    }
    
    // Convert 5K time to seconds
    const timeParts = fiveKTime.split(':');
    const totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    
    // Calculate pace per mile and per km in seconds
    const fiveKPacePerMile = (totalSeconds / 3.107) * 1.609; // 5K to miles, then per mile
    const fiveKPacePerKm = totalSeconds / 5; // 5K time divided by 5km
    
    // Training pace multipliers (Jack Daniels method)
    const paces = [
        {name: 'Easy/Recovery', multiplier: 1.2, purpose: 'Easy runs, warm-up, cool-down'},
        {name: 'Marathon Pace', multiplier: 1.1, purpose: 'Long runs, marathon race pace'},
        {name: 'Threshold/Tempo', multiplier: 1.05, purpose: 'Tempo runs, lactate threshold'},
        {name: '5K Race Pace', multiplier: 1.0, purpose: '5K intervals, VO2 max training'},
        {name: 'Mile/1500m Pace', multiplier: 0.92, purpose: 'Speed intervals, neuromuscular power'}
    ];
    
    let resultHTML = `<h4>🎯 Your Training Paces</h4>`;
    
    paces.forEach(pace => {
        const paceSecondsMile = fiveKPacePerMile * pace.multiplier;
        const paceSecondsKm = fiveKPacePerKm * pace.multiplier;
        
        // Format mile pace
        const minutesMile = Math.floor(paceSecondsMile / 60);
        const secondsMile = Math.floor(paceSecondsMile % 60);
        const paceStringMile = `${minutesMile}:${secondsMile.toString().padStart(2, '0')}`;
        
        // Format km pace
        const minutesKm = Math.floor(paceSecondsKm / 60);
        const secondsKm = Math.floor(paceSecondsKm % 60);
        const paceStringKm = `${minutesKm}:${secondsKm.toString().padStart(2, '0')}`;
        
        resultHTML += `
            <div class="zone">
                <div>
                    <div class="zone-name">${pace.name}</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${pace.purpose}</div>
                </div>
                <div class="zone-range">
                    <div style="margin-bottom: 5px;"><strong>${paceStringMile}/mile</strong></div>
                    <div style="font-size: 0.9em; opacity: 0.9;">${paceStringKm}/km</div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('trainingPacesResult').innerHTML = resultHTML;
    document.getElementById('trainingPacesResult').style.display = 'block';
}

// Show/hide pace tables based on distance selection
function showPaceTable() {
    const selectedDistance = document.getElementById('paceDistanceSelector').value;
    
    // Hide all pace table containers
    const paceTables = document.querySelectorAll('.pace-table-container');
    paceTables.forEach(table => {
        table.style.display = 'none';
    });
    
    // Show the selected pace table
    const selectedTable = document.getElementById(`paceTable-${selectedDistance}`);
    if (selectedTable) {
        selectedTable.style.display = 'block';
        // Add a smooth fade-in animation
        selectedTable.style.opacity = '0';
        selectedTable.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
            selectedTable.style.opacity = '1';
        }, 10);
    }
}

// Update distance label based on selected unit
function updateDistanceLabel() {
    const unit = document.getElementById('distanceUnit').value;
    const label = document.getElementById('distanceLabel');
    const input = document.getElementById('weeklyMileage');
    
    if (unit === 'km') {
        label.textContent = 'Target Weekly Distance (km)';
        input.placeholder = 'e.g. 65';
    } else {
        label.textContent = 'Target Weekly Mileage';
        input.placeholder = 'e.g. 40';
    }
}

// Generate weekly training plan
function generateTrainingPlan() {
    const weeklyDistance = parseInt(document.getElementById('weeklyMileage').value);
    const trainingDays = parseInt(document.getElementById('trainingDays').value);
    const unit = document.getElementById('distanceUnit').value;
    
    if (!weeklyDistance) {
        alert('Please enter weekly distance');
        return;
    }
    
    // Convert to miles for calculations (all percentages are based on miles)
    const weeklyMileage = unit === 'km' ? weeklyDistance / 1.60934 : weeklyDistance;
    
    const runTypes = {
        3: ['Long Run (40%)', 'Easy Run (35%)', 'Tempo/Speed Work (25%)'],
        4: ['Long Run (35%)', 'Easy Run (30%)', 'Easy Run (20%)', 'Tempo/Speed Work (15%)'],
        5: ['Long Run (30%)', 'Easy Run (25%)', 'Easy Run (20%)', 'Tempo Run (15%)', 'Speed Work (10%)'],
        6: ['Long Run (25%)', 'Easy Run (20%)', 'Easy Run (18%)', 'Easy Run (17%)', 'Tempo Run (12%)', 'Speed Work (8%)'],
        7: ['Long Run (22%)', 'Easy Run (18%)', 'Easy Run (16%)', 'Easy Run (14%)', 'Easy Run (12%)', 'Tempo Run (10%)', 'Speed Work (8%)']
    };
    
    const percentages = {
        3: [0.40, 0.35, 0.25],
        4: [0.35, 0.30, 0.20, 0.15],
        5: [0.30, 0.25, 0.20, 0.15, 0.10],
        6: [0.25, 0.20, 0.18, 0.17, 0.12, 0.08],
        7: [0.22, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08]
    };
    
    // Calculate distances in the selected unit
    const unitSymbol = unit === 'km' ? 'km' : 'mi';
    const unitName = unit === 'km' ? 'kilometers' : 'miles';
    
    let resultHTML = `
        <h4>📊 Your Weekly Training Plan</h4>
        <p><strong>Total Weekly Distance:</strong> ${weeklyDistance} ${unitName} over ${trainingDays} days</p>
        <div style="margin-top: 15px;">
    `;
    
    runTypes[trainingDays].forEach((runType, index) => {
        const miles = weeklyMileage * percentages[trainingDays][index];
        const distance = unit === 'km' ? Math.round(miles * 1.60934) : Math.round(miles);
        const day = index + 1;
        resultHTML += `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>Day ${day}: ${runType}</span>
                <span><strong>${distance} ${unitSymbol}</strong></span>
            </div>
        `;
    });
    
    resultHTML += `</div>
        <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
            <h5 style="color: #ffd89b; margin-bottom: 10px;">Training Tips:</h5>
            <ul style="margin-left: 20px;">
                <li>80% of training should be at easy effort</li>
                <li>Include one rest day per week</li>
                <li>Build distance gradually (10% rule)</li>
                <li>Listen to your body and adjust as needed</li>
            </ul>
        </div>
    `;
    
    document.getElementById('trainingPlanResult').innerHTML = resultHTML;
    document.getElementById('trainingPlanResult').style.display = 'block';
}

// GDPR Cookie Consent Management
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieSettings = document.getElementById('cookieSettings');
    
    // Check if user has already made a choice
    const consent = localStorage.getItem('ga_consent');
    if (consent === null) {
        // Show cookie banner if no choice has been made
        cookieConsent.style.display = 'block';
    } else if (consent === 'granted') {
        // Initialize GA if consent was given
        initializeGoogleAnalytics();
    }
    
    // Event listeners for cookie banner
    document.getElementById('acceptCookies').addEventListener('click', function() {
        localStorage.setItem('ga_consent', 'granted');
        cookieConsent.style.display = 'none';
        initializeGoogleAnalytics();
    });
    
    document.getElementById('declineCookies').addEventListener('click', function() {
        localStorage.setItem('ga_consent', 'denied');
        cookieConsent.style.display = 'none';
    });
    
    document.getElementById('manageCookies').addEventListener('click', function() {
        cookieSettings.style.display = 'flex';
    });
    
    // Event listeners for cookie settings modal
    document.getElementById('closeCookieSettings').addEventListener('click', function() {
        cookieSettings.style.display = 'none';
    });
    
    document.getElementById('saveCookieSettings').addEventListener('click', function() {
        const analyticsEnabled = document.getElementById('analyticsToggle').checked;
        localStorage.setItem('ga_consent', analyticsEnabled ? 'granted' : 'denied');
        cookieSettings.style.display = 'none';
        cookieConsent.style.display = 'none';
        
        if (analyticsEnabled) {
            initializeGoogleAnalytics();
        }
    });
    
    document.getElementById('acceptAllCookies').addEventListener('click', function() {
        localStorage.setItem('ga_consent', 'granted');
        cookieSettings.style.display = 'none';
        cookieConsent.style.display = 'none';
        initializeGoogleAnalytics();
    });
    
    // Close settings modal when clicking outside
    cookieSettings.addEventListener('click', function(e) {
        if (e.target === cookieSettings) {
            cookieSettings.style.display = 'none';
        }
    });
}

function initializeGoogleAnalytics() {
    // Update consent mode to granted
    gtag('consent', 'update', {
        'analytics_storage': 'granted'
    });
    
    // Initialize GA4 with privacy-focused settings
    gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_flags: 'SameSite=Strict;Secure'
    });
    
    console.log('Google Analytics initialized with GDPR compliance');
}

// Initialize interactive features when page loads
window.onload = function() {
    // Initialize GDPR cookie consent
    initializeCookieConsent();
    
    // Add some dynamic animations to metric items
    setInterval(() => {
        const metricItems = document.querySelectorAll('.metric-item');
        metricItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }, 10000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Press 1-4 to switch tabs (only when not typing in input fields)
        if (event.key >= '1' && event.key <= '4') {
            // Check if the user is currently typing in an input field
            const activeElement = document.activeElement;
            const isTyping = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.tagName === 'SELECT' ||
                activeElement.contentEditable === 'true'
            );
            
            // Only switch tabs if not typing in an input field
            if (!isTyping) {
                const tabs = ['metrics', 'predictor', 'pacing', 'training'];
                const tabIndex = parseInt(event.key) - 1;
                if (tabIndex < tabs.length) {
                    showTab(tabs[tabIndex]);
                    // Update button states
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-btn')[tabIndex].classList.add('active');
                }
            }
        }
    });
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                document.querySelector('.tab-content.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        });
    });
};

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function timeToSeconds(timeString) {
    const parts = timeString.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
}

// Add input validation
document.addEventListener('DOMContentLoaded', function() {
    // Time input validation - improved to be less aggressive
    const timeInputs = document.querySelectorAll('input[type="text"][placeholder*="MM:SS"]');
    timeInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            // Only clean up if there are invalid characters, don't interfere with normal typing
            const cleanValue = value.replace(/[^\d:]/g, '');
            if (cleanValue !== value) {
                e.target.value = cleanValue;
            }
            // Limit length to prevent overflow
            if (e.target.value.length > 8) { // Allow for HH:MM:SS format
                e.target.value = e.target.value.substring(0, 8);
            }
        });
        
        // Add blur event handler for time validation
        input.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            if (value) {
                const fieldName = e.target.placeholder.includes('5K') ? '5K time' : 'race time';
                const validation = validateTimeFormat(value, fieldName);
                if (!validation.valid) {
                    // Add visual feedback
                    e.target.style.borderColor = '#ff6b6b';
                    e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    
                    // Show tooltip or message
                    showInputError(e.target, validation.message);
                } else {
                    // Clear error styling
                    e.target.style.borderColor = '';
                    e.target.style.backgroundColor = '';
                    hideInputError(e.target);
                }
            }
        });
        
        // Clear error styling on focus
        input.addEventListener('focus', function(e) {
            e.target.style.borderColor = '';
            e.target.style.backgroundColor = '';
            hideInputError(e.target);
        });
        
        // Add paste event handler for time inputs
        input.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value;
                const cleanValue = value.replace(/[^\d:]/g, '');
                if (cleanValue !== value) {
                    e.target.value = cleanValue;
                }
            }, 0);
        });
    });
    
    // Number input validation - improved
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Only prevent negative values, don't interfere with typing
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
        
        // Prevent pasting negative values
        input.addEventListener('paste', function(e) {
            setTimeout(() => {
                if (e.target.value < 0) {
                    e.target.value = 0;
                }
            }, 0);
        });
    });
    
    // Add focus/blur effects for better UX
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});