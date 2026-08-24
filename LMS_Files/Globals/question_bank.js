/**
 * Team WOW LMS - Master Question Bank
 * Shared between Module Knowledge Checks, End-of-Day Comprehensive Quizzes, and Day 2 Recaps.
 */

const QUESTION_BANK = {
    module1: [
        {
            id: 'm1_mission',
            topic: 'Mission',
            question: 'What is the Team WOW mission?',
            options: [
                { text: 'A. Making pizzas as fast as possible', correct: false },
                { text: 'B. Dedicated to delivering the best customer experience possible', correct: true },
                { text: 'C. Memorizing the entire menu on Day 1', correct: false }
            ]
        },
        {
            id: 'm1_focus_areas',
            topic: 'Orientation',
            question: 'What are the four key focus areas of your 3-day training program?',
            options: [
                { text: 'A. Dough stretching, oven tending, dishwashing, and routing', correct: false },
                { text: 'B. Speed, profit margins, sales competitions, and marketing', correct: false },
                { text: 'C. Service, Uniform & Professionalism, Safety & Workplace Standards, and Execution', correct: true }
            ]
        },
        {
            id: 'm1_expectations',
            topic: 'Expectations',
            question: 'What does leadership expect from you on Day 1?',
            options: [
                { text: 'A. Flawless perfection and zero mistakes', correct: false },
                { text: 'B. A great attitude, willingness to learn, and commitment to improving every day', correct: true },
                { text: 'C. Working independent shifts with no supervision', correct: false }
            ]
        }
    ],

    module2: [
        {
            id: 'm2_leads_mandatory',
            topic: 'Customer Service / LEADS',
            mandatory: true,
            question: 'When handling customer concerns, we follow LEADS. What does LEADS stand for?',
            options: [
                { text: 'A. Look, Evaluate, Assess, Deliver, Smile', correct: false },
                { text: 'B. Listen, Empathize, Apologize, Do what it takes, Stand by your promise', correct: true },
                { text: 'C. Listen, Explain internal mistakes, Argue, Discount, Send out', correct: false }
            ]
        },
        {
            id: 'm2_service_recovery',
            topic: 'Customer Service Recovery',
            question: 'When a customer has an issue with their order, what should you do before trying to explain what happened?',
            options: [
                { text: 'A. Explain the internal kitchen mistakes so they know it wasn’t your fault', correct: false },
                { text: 'B. Offer an immediate 50% discount without asking questions', correct: false },
                { text: 'C. Connect with empathy and acknowledge that their frustration is real', correct: true }
            ]
        },
        {
            id: 'm2_store_image',
            topic: 'Store Image',
            question: 'Why is maintaining a clean store and lobby so critical to the customer experience?',
            options: [
                { text: 'A. Customers judge whether they can trust us with their food before we ever speak to them', correct: true },
                { text: 'B. It gives employees something to do when no orders are on the screen', correct: false },
                { text: 'C. Clean lobbies allow us to charge higher menu prices', correct: false }
            ]
        },
        {
            id: 'm2_employee_image',
            topic: 'Employee Image',
            question: 'Why is wearing a clean, complete uniform with pride important on every shift?',
            options: [
                { text: 'A. It makes sure everyone looks identical in store photos', correct: false },
                { text: 'B. Appearance creates confidence and shows customers we are prepared and professional', correct: true },
                { text: 'C. It allows managers to avoid conducting daily shift meetings', correct: false }
            ]
        },
        {
            id: 'm2_uniform_safety',
            topic: 'Uniform Standards',
            question: 'Which of the following follows Team WOW uniform and safety standards?',
            options: [
                { text: 'A. Wearing your apron outside to take out trash and into the restroom', correct: false },
                { text: 'B. Wearing closed-toe non-slip shoes, hat facing forward, and apron worn only inside food areas', correct: true },
                { text: 'C. Wearing basketball shorts or sweatpants as long as they are dark-colored', correct: false }
            ]
        },
        {
            id: 'm2_sense_urgency',
            topic: 'Hustle & Urgency',
            question: 'How does Coach Bobby define a true "Sense of Urgency" in our stores?',
            options: [
                { text: 'A. Running through the store in a panic shouting at teammates to hurry', correct: false },
                { text: 'B. Moving with purpose: fast but controlled, quick but accurate, focused and intentional', correct: true },
                { text: 'C. Skipping quality checks on pizzas whenever the store gets busy', correct: false }
            ]
        },
        {
            id: 'm2_talking_tone',
            topic: 'Intangibles & Tone',
            question: 'Can you say all the right words to a customer and still provide poor customer service?',
            options: [
                { text: 'A. Yes — your tone, eye contact, facial expressions, and body language matter just as much as your words', correct: true },
                { text: 'B. No — as long as you recite the script word-for-word, the customer will always be happy', correct: false },
                { text: 'C. Only when taking orders over the phone, but not at the front counter', correct: false }
            ]
        },
        {
            id: 'm2_operations',
            topic: 'Operations as Service',
            question: 'Why does Coach Bobby say that "Great operations ARE customer service"?',
            options: [
                { text: 'A. Because only the front counter CSR is responsible for customer satisfaction', correct: false },
                { text: 'B. Because a great smile cannot fix a missing, late, or incorrectly made pizza — it’s a team sport', correct: true },
                { text: 'C. Because making pizzas fast is more important than greeting customers', correct: false }
            ]
        }
    ],

    module5_final: [
        {
            id: 'm5_q1_mission',
            topic: 'Team WOW Mission',
            question: 'What is the overarching mission of Team WOW that guides every position in the store?',
            options: [
                { text: 'A. Dedicated to delivering the best customer experience possible', correct: true },
                { text: 'B. Making pizzas as fast as possible regardless of mistakes', correct: false },
                { text: 'C. Reaching maximum sales targets above all else', correct: false }
            ]
        },
        {
            id: 'm5_q2_pillars',
            topic: 'Core Pillars',
            question: 'What are the four core focus areas of your 3-day onboarding program?',
            options: [
                { text: 'A. Speed, Dough Prep, Sales Contests, and Routing', correct: false },
                { text: 'B. Service, Uniform & Professionalism, Safety & Workplace Standards, and Execution', correct: true },
                { text: 'C. Cash Handling, Oven Tending, Dishwashing, and Phone Scripts', correct: false }
            ]
        },
        {
            id: 'm5_q3_store_image',
            topic: 'Store Image',
            question: 'When does a customer begin judging their experience at our store?',
            options: [
                { text: 'A. Way before we speak to them — when they see the parking lot, lobby, counter, and cleanliness', correct: true },
                { text: 'B. Only after they take their first bite of food at home', correct: false },
                { text: 'C. Only if an order takes longer than 45 minutes', correct: false }
            ]
        },
        {
            id: 'm5_q4_uniform_jersey',
            topic: 'Uniform Standards',
            question: 'Why do we treat our uniform as our "Game Day Jersey"?',
            options: [
                { text: 'A. Because appearance creates confidence and shows customers we are prepared, professional, and proud', correct: true },
                { text: 'B. So that shift managers do not have to conduct daily pre-game checks', correct: false },
                { text: 'C. It allows team members to wear athletic sweatpants on busy days', correct: false }
            ]
        },
        {
            id: 'm5_q5_leads',
            topic: 'LEADS Recovery',
            question: 'When handling a customer concern or remake, what does LEADS stand for?',
            options: [
                { text: 'A. Listen, Empathize, Apologize, Do what it takes, Stand by your promise', correct: true },
                { text: 'B. Look, Evaluate, Assess, Deliver, Smile', correct: false },
                { text: 'C. Listen, Explain internal mistakes, Argue, Discount, Send out', correct: false }
            ]
        },
        {
            id: 'm5_q6_urgency',
            topic: 'Sense of Urgency',
            question: 'What is true "Sense of Urgency" on a Team WOW shift?',
            options: [
                { text: 'A. Running in a panic and shouting at teammates when orders drop', correct: false },
                { text: 'B. Moving with purpose: fast but controlled, quick but accurate, focused and intentional', correct: true },
                { text: 'C. Cutting corners on topping portions to clear the make line faster', correct: false }
            ]
        },
        {
            id: 'm5_q7_operations_service',
            topic: 'Operations as Service',
            question: 'Why is customer service considered a "team sport" in our stores?',
            options: [
                { text: 'A. Because everyone touches the customer experience — a smile cannot fix a missing, late, or cold pizza', correct: true },
                { text: 'B. Because only the driver and counter CSR interact with the guest', correct: false },
                { text: 'C. Because make line athletes are not responsible for customer satisfaction', correct: false }
            ]
        },
        {
            id: 'm5_q8_menu_knowledge',
            topic: 'Menu Mastery',
            question: 'Why is product and menu knowledge critical when taking customer orders?',
            options: [
                { text: 'A. It gives you the confidence to guide customers, suggest favorites, and answer dietary/crust questions smoothly', correct: true },
                { text: 'B. It is only needed if the computer register goes offline', correct: false },
                { text: 'C. It allows you to change recipe portions without manager approval', correct: false }
            ]
        },
        {
            id: 'm5_q9_phone_standards',
            topic: 'Phone Standards',
            question: 'What is our standard for answering store phone calls?',
            options: [
                { text: 'A. Answer promptly by the 2nd ring with a friendly, professional greeting script', correct: true },
                { text: 'B. Let the phone ring 5 times so callers know the kitchen is busy', correct: false },
                { text: 'C. Pick up and immediately place the caller on hold without greeting them', correct: false }
            ]
        },
        {
            id: 'm5_q10_order_building',
            topic: 'Upselling & Order Building',
            question: 'What is the goal of upselling sides, drinks, and desserts during an order?',
            options: [
                { text: 'A. Enhancing the customer’s meal experience and ensuring they don’t forget dipping cups or drinks', correct: true },
                { text: 'B. Forcing customers to purchase items they didn’t ask for', correct: false },
                { text: 'C. Slowing down order entry time at the register', correct: false }
            ]
        }
    ]
};
