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
       2. Phase Transition Logic (Envelope -> Ask -> Celebration -> Anniversary -> Wizard)
       ------------------------------------------------------------- */
    const envelope = document.getElementById('envelope');
    const envelopePhase = document.getElementById('envelope-phase');
    const yesBtn = document.getElementById('yes-btn');
    const phase1 = document.getElementById('phase-1');

    // Step 0: Click Envelope -> Show Phase 1
    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.add('envelope-open');
            setTimeout(() => {
                envelopePhase.style.opacity = '0';
                setTimeout(() => {
                    envelopePhase.classList.add('hidden-phase');
                    envelopePhase.classList.remove('flex'); // remove flex to hide completely
                    envelopePhase.style.display = 'none';

                    phase1.classList.remove('hidden-phase');
                    phase1.classList.add('visible-phase'); // Ensure it's visible based on CSS
                    phase1.style.display = 'flex'; // Ensure flex layout is applied
                    // Fade in effect
                    phase1.style.opacity = '0';
                    setTimeout(() => {
                        phase1.style.opacity = '1';
                    }, 50);

                }, 500);
            }, 1500); // Wait longer for the letter up animation
        });
    }
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
                anniversaryPhase.scrollTop = 0;

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
            phase2.scrollTop = 0;

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

        // Transition to Greeting Phase
        setTimeout(() => {
            document.getElementById('phase-2').classList.add('hidden-phase');
            document.getElementById('phase-2').classList.remove('visible-phase');
            document.getElementById('phase-2').style.display = 'none';

            const greetingPhase = document.getElementById('greeting-phase');
            if (greetingPhase) {
                greetingPhase.classList.remove('hidden-phase');
                greetingPhase.classList.add('visible-phase');
                greetingPhase.style.display = 'flex';
            }
        }, 1000); // Wait a bit for mailto to trigger
    });

    /* -------------------------------------------------------------
       5. Restart Logic
       ------------------------------------------------------------- */
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // Hide Greeting Phase
            const greetingPhase = document.getElementById('greeting-phase');
            greetingPhase.classList.add('hidden-phase');
            greetingPhase.classList.remove('visible-phase');
            greetingPhase.style.display = 'none';

            // Reset Forms and State
            planningForm.reset();
            currentStep = 1;
            showStep(1);

            // Clear selections
            document.querySelectorAll('.card-option').forEach(el => el.classList.remove('selected', 'border-pink-500', 'ring-2', 'ring-pink-400'));
            // Clear hidden inputs manually
            document.querySelectorAll('input[type="hidden"]').forEach(el => el.value = '');
            // Hide suggestion inputs
            document.querySelectorAll('.suggestion-input').forEach(el => el.classList.add('hidden'));

            // Reset Phases Visibility & Opacity
            // Ensure Celebration Phase is reset
            const celebrationPhase = document.getElementById('celebration-phase');
            if (celebrationPhase) {
                celebrationPhase.classList.add('hidden-phase');
                celebrationPhase.classList.remove('visible-phase');
                celebrationPhase.style.display = 'none';
                celebrationPhase.style.opacity = '1';
            }

            // Ensure Anniversary Phase is reset & Scrolled to Top
            const anniversaryPhase = document.getElementById('anniversary-phase');
            if (anniversaryPhase) {
                anniversaryPhase.classList.add('hidden-phase');
                anniversaryPhase.classList.remove('visible-phase');
                anniversaryPhase.style.display = 'none';
                anniversaryPhase.style.opacity = '1';
                anniversaryPhase.scrollTop = 0; // Scroll to top
            }

            // Ensure Phase 2 is reset & Scrolled to Top
            const phase2 = document.getElementById('phase-2');
            if (phase2) {
                phase2.classList.add('hidden-phase');
                phase2.classList.remove('visible-phase');
                phase2.style.display = 'none';
                phase2.style.opacity = '1';
                phase2.scrollTop = 0; // Scroll wizard to top too
            }

            // Close Envelope
            const envelope = document.getElementById('envelope');
            if (envelope) {
                envelope.classList.remove('envelope-open');
            }

            // Show Envelope Phase
            const envelopePhase = document.getElementById('envelope-phase');
            if (envelopePhase) {
                envelopePhase.classList.remove('hidden-phase');
                envelopePhase.style.opacity = '1';
                envelopePhase.style.display = 'flex';
            }
        });
    }

});
