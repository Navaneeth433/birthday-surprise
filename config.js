window.STORY_CONFIG = {
  girlfriend: {
    fullName: "Nayana Binu Plachikattil",
    nickname: "Nayana",
    turningAge: 22,
    birthdayDate: "Tomorrow",
    coupleNickname: "Nayana & Me"
  },

  meta: {
    title: "Happy 22nd Birthday Nayana! 💖 | Our Story Adventure",
    subheading: "Someone has locked your birthday surprise... solve our 4 chapter memory quest to unlock it! ✨"
  },

  // Playful Taunt Messages shown when she picks the WRONG answer! 😂
  wrongTaunts: [
    "Podi mandi ayye ih pollum arilla",
    "Kazhutha 😜",
    "Hmm kastamm",
    "u bloodyy fool",
    "kozpmilla thett arakayallum pattum❤️"
  ],

  // CHAPTER 1: Timeline Quiz
  level1: {
    title: "Chapter 1: Where It All Began 🕰️",
    subtitle: "Answer these timeline questions to rebuild our milestone memory road!",

    questions: [
      {
        id: 1,
        question: "When did our story officially begin?",
        options: [
          "The day we first talked",
          "Classil",
          "Inductionil",
          "The day you stole my heart"
        ],
        correctIndex: 2,
        timelineYear: "Milestone 1",
        timelineText: "Kannum kanich enne trappil akki✨"
      },

      {
        id: 2,
        question: "What was the very first nickname or funny name you used for me?",
        options: [
          "monkey",
          "thavalla",
          "pashu",
          "Puttu"
        ],
        correctIndex: 0,
        timelineYear: "Milestone 2",
        timelineText: "When cute nicknames became our official secret language ❤️"
      },

      {
        id: 3,
        question: "Who made the first move (or sent that legendary message)?",
        options: [
          "Definitely me!",
          "You, without a doubt!",
          "It was mutual magic",
          "A lucky twist of fate"
        ],
        correctIndex: 1,
        timelineYear: "Milestone 3",
        timelineText: "Aval thanne avale peduthi 🥰"
      }
    ]
  },

  // CHAPTER 2: Guess the Memory
  level2: {
    title: "Chapter 2: Guess the Memory 📸",
    subtitle: "Unblur these special photos of us by answering where/what it was!",

    cards: [
      {
        id: 1,
        title: "Memory #1",
        imageUrl: "assets/photo1.jpg",
        placeholderText: "🌸 Cute Moment",
        blurStart: 25,
        question: "Where were we in this sweet moment?",
        options: [
          "Library",
          "Ente veed",
          "Nadatham",
          "Canteen"
        ],
        correctIndex: 0,
        caption: "Uff scnn❤️",
        taunt: "Kann open karroooo 😂"
      },

      {
        id: 2,
        title: "Memory #2",
        imageUrl: "assets/photo2.jpg",
        placeholderText: "✨Rand perum",
        blurStart: 25,
        question: "What were we celebrating here?",
        options: [
          "Xmas",
          "pranth",
          "Nammude marriage",
          "vipanchika",
          "Christmas"
        ],
        correctIndex: 4,
        caption: "Kollam✨",
        taunt: "ayye mandi shee xmas alla christmass allleee 😜"
      }
    ]
  },

  // CHAPTER 3: Relationship Quiz
  level3: {
    title: "Chapter 3: How Well Do You Know Us? ❤️",
    subtitle: "Answer these heartfelt & funny relationship questions!",

    questions: [
      {
        id: 1,
        question: "When I'm having a rough day, what is the #1 thing I need from you?",

        options: [
          "A detailed 5-step problem solving lecture",
          "Complete radio silence and space",
          "A warm hug, food, and you teasing me until I smile pinne korach ummayum",
          "A distraction movie"
        ],

        correctIndex: 2,

        sweetResponse: "Hmmmmmmmmmm 🥰",

        taunt: "Ninnnee ennne ariyyee illa veryy badd 😂"
      },

      {
        id: 2,
        question: "What is something you do that instantly makes my heart melt?",

        options: [
          "Ninte smile",
          "Ninte eyes",
          "Nink enthenkilum avshyam ullapo snehthode vilikunath",
          "Ellam❤️"
        ],

        correctIndex: 3,

        sweetResponse: "Shalyam ivide njn avale impress akan enthokke cheynam avlk orr look itta njn vinnu",

        taunt: "Wrong! The answer is ALL OF THE ABOVE because I love everything you do! Mandi"
      },

      {
        id: 3,
        question: "If we had 24 hours with zero responsibilities, what would be our dream plan?",

        options: [
          "Veetil irinn food order",
          "Chooma nadatham enthenkilum addi indaki",
          "padikka",
          "Movie date"
        ],

        correctIndex: 1,

        sweetResponse: "Addi annalo main",

        taunt: "Athannodi main"
      }
    ]
  },

  // CHAPTER 4: Secret Code
  level4: {
    title: "Chapter 4: Crack the Secret Cipher 🔐",
    subtitle: "Combine our special clues to unlock the vault key!",

    clues: [
      {
        step: "1",
        text: "Her first name (Capitalized)",
        valueHint: "N A Y A N A"
      },

      {
        step: "2",
        text: "Her milestone turning age",
        valueHint: "2 2"
      },

      {
        step: "3",
        text: "Final Secret Key = NAME + AGE",
        valueHint: "NAYANA22"
      }
    ],

    secretPasscode: "NAYANA22",

    successMessage:
      "ACCESS GRANTED! 🔑 You have unlocked the ultimate Birthday Surprise!"
  },

  // =========================================================
  // FINAL BIRTHDAY LETTER
  // =========================================================

  letter: {
    heading: "Happy Birthday, Aliyaa! 💌❤️",

    salutation: "Chundariiiii ❤️",

    paragraphs: [
      "If you're reading this, it means you've successfully conquered every single test and puzzle I built for you (even after getting teased a few times! 😂❤️).",

      "Chundariii enthannn vayassayaloo Happiieesttttt of the birthday aliyaa ilu choondariiiiiiiii enthan le time povunne ella thvanna um polle bday gifts onum illa ariya still ithenkilum cheyenam indayi enikk ilu diii kazhuthee.",

      "Nee bahrain poyalum no issue ji nammude relationship strong ann ji nee break up ath ith parayum enkilum u love mee vavvveee. Enik ariya future nne patti nink pediya enn nee athonnum aloikanda bahrain poo onn cool avv enit avide job hunt cheyy korach fund indakk enit nammuk aloik. Job kittum doubt cheyyalee ❤️",

      "Thank u ji enete life il kerri vann life thanne matti nee. Enik arilla orr chane inn ann ingane cheythe ella thavaneyum letter alle njn namma meet up vekkind allo appo thara vicharichu but ath nalla nerthe alle appo ninet kayil thanna nee apppo thanne thorkum kazhutha 😂❤️",

      "Happy Birthday aliyaa ❤️"
    ],

    signoff: "Forever & Always Yours, puttus ❤️",

    signature: "With all my love ❤️"
  },

  // BIRTHDAY CAKE
  cake: {
    title: "Make a Wish, Kazhuthe 🎂",

    subtitle:
      "Blow out the 22 birthday candles to trigger your special celebration fireworks!",

    wishPrompt:
      "Wish big, work hard, and know that I'll always be cheering for you!"
  },

  // PHOTO MEMORY WALL
  memoryWall: [
    {
      caption: "My fav donkey ilu kazhuthe",
      note: "ah nilpp nokknne 😂",
      imageUrl: "assets/memory1.jpg"
    },

    {
      caption: "Uff chundari",
      note: "Wishing the happiest 22nd birthday to the prettiest girl in the world kayy annalo mainnn",
      imageUrl: "assets/memory2.jpg"
    },

    {
      caption: "Enthri penne",
      note: "Ah Nottam nokkk",
      imageUrl: "assets/memory3.jpg"
    }
  ]
};