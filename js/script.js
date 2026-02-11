document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
       1. Floating Hearts Animation
       ------------------------------------------------------------- */
    const heartsContainer = document.getElementById('hearts-container');
    const heartEmojis = ['💖', '💕', '🥰', '🌹', '✨', '😻', '💝'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heartsContainer.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 6000);
    }
    setInterval(createHeart, 300);


    /* -------------------------------------------------------------
       2. Phase Transition Logic (Ask -> Celebration -> Anniversary -> Wizard)
       ------------------------------------------------------------- */
    const yesBtn = document.getElementById('yes-btn');
    const phase1 = document.getElementById('phase-1');
    const celebrationPhase = document.getElementById('celebration-phase');
    const anniversaryPhase = document.getElementById('anniversary-phase');
    const planDateBtn = document.getElementById('plan-date-btn');
    const phase2 = document.getElementById('phase-2');

    // Step 1: Click Yes -> Show Celebration
    yesBtn.addEventListener('click', () => {
        phase1.style.opacity = '0';
        setTimeout(() => {
            phase1.classList.add('hidden-phase');
            phase1.classList.remove('visible-phase');
            phase1.classList.remove('flex');
            phase1.style.display = 'none';

            celebrationPhase.classList.remove('hidden-phase');
            celebrationPhase.classList.add('visible-phase');
            celebrationPhase.style.display = 'flex';
        }, 500);

        // Step 2: Auto Transition Celebration -> Anniversary (after 3s)
        setTimeout(() => {
            celebrationPhase.style.opacity = '0';
            setTimeout(() => {
                celebrationPhase.classList.add('hidden-phase');
                celebrationPhase.classList.remove('visible-phase');
                celebrationPhase.style.display = 'none';

                anniversaryPhase.classList.remove('hidden-phase');
                anniversaryPhase.classList.add('visible-phase');
                anniversaryPhase.style.display = 'flex';

                startTimer();
            }, 500);
        }, 3500);
    });

    // Step 3: Click "Let's Plan" -> Show Wizard
    planDateBtn.addEventListener('click', () => {
        anniversaryPhase.style.opacity = '0';
        setTimeout(() => {
            anniversaryPhase.classList.add('hidden-phase');
            anniversaryPhase.classList.remove('visible-phase');
            anniversaryPhase.style.display = 'none';

            phase2.classList.remove('hidden-phase');
            phase2.classList.add('visible-phase');
            phase2.style.display = 'flex';

            // Fix: Reset opacity to 1 to ensure visibility if it was faded out previously
            setTimeout(() => {
                phase2.style.opacity = '1';
            }, 10);
        }, 500);
    });


    // Step 4: Back from Wizard -> Anniversary (New Feature)
    const backToAnniversaryBtn = document.getElementById('back-to-anniversary-btn');
    if (backToAnniversaryBtn) {
        backToAnniversaryBtn.addEventListener('click', () => {
            // Fade out Phase 2
            phase2.classList.remove('visible-phase');
            phase2.style.opacity = '0';

            setTimeout(() => {
                phase2.classList.add('hidden-phase');
                phase2.style.display = 'none';

                anniversaryPhase.classList.remove('hidden-phase');
                anniversaryPhase.classList.add('visible-phase');
                anniversaryPhase.style.display = 'flex';

                // Ensure opacity is reset for fade-in
                setTimeout(() => {
                    anniversaryPhase.style.opacity = '1';
                }, 10);

            }, 500);
        });
    }

    // Anniversary Timer Logic
    function startTimer() {
        const startDate = new Date('2025-02-13T00:00:00');

        function update() {
            const now = new Date();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = hours;
            document.getElementById('minutes').innerText = minutes;
            document.getElementById('seconds').innerText = seconds;
        }

        update();
        setInterval(update, 1000);
    }


    /* -------------------------------------------------------------
       3. Wizard Navigation & Selection
       ------------------------------------------------------------- */
    let currentStep = 1;
    const totalSteps = 6;

    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.step').forEach(el => {
            el.classList.remove('active-step');
            el.style.display = 'none';
        });

        // Show current step
        const activeStep = document.getElementById(`step-${step}`);
        activeStep.classList.add('active-step');
        activeStep.style.display = 'block';

        // Scroll to top of form
        document.getElementById('phase-2').scrollTop = 0;
    }

    // Next Buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Back Buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Option Selection Logic
    document.querySelectorAll('.card-option').forEach(option => {
        option.addEventListener('click', function () {
            const category = this.dataset.category;
            const value = this.dataset.value;
            const inputField = document.getElementById(`input-${category}`);
            const suggestionInput = this.querySelector('.suggestion-input');

            // Reset siblings
            document.querySelectorAll(`.card-option[data-category="${category}"]`).forEach(sib => {
                sib.classList.remove('selected', 'border-pink-500', 'ring-2', 'ring-pink-400');
                const sibInput = sib.querySelector('.suggestion-input');
                if (sibInput) sibInput.classList.add('hidden');
            });

            // Highlight selected
            this.classList.add('selected', 'border-pink-500', 'ring-2', 'ring-pink-400');

            if (value === 'suggestion') {
                suggestionInput.classList.remove('hidden');
                suggestionInput.focus();
                inputField.value = suggestionInput.value;
            } else {
                inputField.value = value;
            }
        });
    });

    // Handle typing in suggestion boxes
    document.querySelectorAll('.suggestion-input').forEach(input => {
        input.addEventListener('input', function (e) {
            const card = this.closest('.card-option');
            const category = card.dataset.category;

            if (card.classList.contains('selected')) {
                document.getElementById(`input-${category}`).value = this.value;
            }
        });
    });

    function validateStep(step) {
        if (step === 6) return true;

        const categories = {
            1: 'date',
            2: 'place',
            3: 'photobooth',
            4: 'food',
            5: 'wear'
        };
        const category = categories[step];
        const value = document.getElementById(`input-${category}`).value;

        if (!value) {
            alert('Please pick an option! 🥺');
            return false;
        }
        return true;
    }


    /* -------------------------------------------------------------
       4. Submission
       ------------------------------------------------------------- */
    const planningForm = document.getElementById('planning-form');

    planningForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('input-date').value;
        const place = document.getElementById('input-place').value;
        const photobooth = document.getElementById('input-photobooth').value;
        const food = document.getElementById('input-food').value;
        const wear = document.getElementById('input-wear').value;
        const note = document.getElementById('input-note').value;

        const recipient = "marcdanielmilano@gmail.com";
        const subject = encodeURIComponent("My 1st Anniversary and Valentine's Date Choices 💘");
        const bodyValue = `
            Hi! Here is how I want our date to be:

            📅 Date: ${date}
            📍 Place: ${place}
            📸 Photobooth: ${photobooth}
            🍽️ Food: ${food}
            👗 Wear: ${wear}

            💌 Special Note:
            ${note}
                    `.trim();

        window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyValue)}`;
    });

});
