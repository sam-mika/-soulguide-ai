let selectedCategory = "";

const emergencyWords = [
  "suicide", "self harm", "kill myself", "sethuruven", "sagalam",
  "vazha pidikkala", "uyira vidanum", "naan saaganum", "saaga poren",
  "sethuda poren", "life venam"
];

const data = {
  anime: {
    stress: ["Barakamon", "Haikyuu!!", "Natsume's Book of Friends"],
    sad: ["A Silent Voice", "Your Name", "Frieren"],
    action: ["Solo Leveling", "Jujutsu Kaisen", "Demon Slayer"],
    fantasy: ["Overlord", "Re:Zero", "That Time I Got Reincarnated as a Slime", "Mushoku Tensei"],
    motivation: ["Black Clover", "Naruto", "My Hero Academia"]
  },
  movie: {
    stress: ["The Pursuit of Happyness", "Zindagi Na Milegi Dobara", "96"],
    sad: ["Good Will Hunting", "Forrest Gump", "Meiyazhagan"],
    action: ["Vikram", "John Wick", "Mad Max: Fury Road"],
    motivation: ["Rocky", "Soorarai Pottru", "12th Fail"]
  },
  webseries: {
    stress: ["Hospital Playlist", "Reply 1988", "Kota Factory"],
    action: ["Alice in Borderland", "The Boys", "Money Heist"],
    fantasy: ["The Witcher", "Alchemy of Souls", "Sweet Home"]
  },
  song: {
    stress: ["Kun Faya Kun", "Nenjukkul Peidhidum", "The Nights - Avicii"],
    sad: ["Let Her Go", "Munbe Vaa", "Someone Like You"],
    motivation: ["Believer", "Aalaporan Tamizhan", "Hall of Fame"]
  },
  book: {
    stress: ["Atomic Habits", "Ikigai", "The Alchemist"],
    motivation: ["Man's Search for Meaning", "Can't Hurt Me", "Think and Grow Rich"],
    psychology: ["The Power of Your Subconscious Mind", "Emotional Intelligence"]
  },
  poetry: {
    stress: [
      "Mazhai pola varum sogamum kadandhu pogum; manam thidama irundhaal velicham thirumbi varum.",
      "When the mind is tired, breathe slowly; even the darkest night ends with sunrise."
    ],
    sad: [
      "Un sirippu thirumbi varum; indha neram mattum unakku oru paadam.",
      "Broken moments can still build a stronger soul."
    ],
    motivation: [
      "Vizhundhaalum ezhundhu nillu; un payanam innum mudiyala.",
      "Your pain is not the end; it is the beginning of your strength."
    ]
  }
};

function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerHTML = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function chooseCategory(category) {
  selectedCategory = category;
  addMessage(category.toUpperCase(), "user");

  if (category === "psychology") {
    addMessage("Enna problem? Stress, anxiety, sadness, anger, heartbreak, study pressure nu type pannunga.", "bot");
  } else if (category === "yoga") {
    addMessage("Yoga / exercise ethukku venum? Stress, sleep, body pain, energy nu type pannunga.", "bot");
  } else {
    addMessage("Super. Ippo unga mood or genre sollunga. Example: stress, sad, action, fantasy, motivation.", "bot");
  }
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();

  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    });

    const data = await response.json();

    addMessage(data.reply, "bot");

  } catch (error) {
    addMessage("AI response error. Please try again.", "bot");
  }
}

function recommend(category, mood) {
  let key = "stress";

  if (mood.includes("sad") || mood.includes("lonely") || mood.includes("sogam")) key = "sad";
  if (mood.includes("action")) key = "action";
  if (mood.includes("fantasy") || mood.includes("isekai")) key = "fantasy";
  if (mood.includes("motivation") || mood.includes("study")) key = "motivation";
  if (mood.includes("psychology")) key = "psychology";

  const list = data[category]?.[key] || data[category]?.stress;

  if (!list) {
    addMessage("Indha category-ku data innum add pannala. Vera mood try pannunga.", "bot");
    return;
  }

  let html = `<b>${category.toUpperCase()} suggestion:</b><br>`;
  list.forEach(item => html += `• ${item}<br>`);
  html += "<br><b>Why?</b> Unga mood-ku emotional relief, motivation, or calm feel kudukkum.";
  addMessage(html, "bot");
}

function psychologyReply(msg) {
  let reply = "Ungaloda feeling valid dhaan. 4-4-6 breathing try pannunga: 4 sec inhale, 4 sec hold, 6 sec exhale. 5 rounds pannunga.";

  if (msg.includes("anxiety")) {
    reply = "Anxiety vandha grounding try pannunga: 5 things paarunga, 4 things touch pannunga, 3 sounds kekkunga, 2 smells notice pannunga, 1 deep breath.";
  }

  if (msg.includes("anger")) {
    reply = "Anger vandha immediate reply panna vendam. 10 deep breaths + 5 minutes gap. Apram calm-a decide pannunga.";
  }

  if (msg.includes("study")) {
    reply = "Study pressure-ku 25 minutes study + 5 minutes break method use pannunga. Daily small target set pannunga.";
  }

  addMessage(reply, "bot");
}

function yogaReply(msg) {
  let reply = "Simple exercise: 10 minutes walking + neck stretch + shoulder roll. Stress kammi aagum.";

  if (msg.includes("sleep")) {
    reply = "Sleep-ku: 5 minutes slow breathing, phone avoid 30 minutes, Child Pose or Legs-up-the-wall pose try pannunga.";
  }

  if (msg.includes("energy")) {
    reply = "Energy-ku: 15 squats, 10 wall pushups, 10 minutes brisk walk. Water kudinga.";
  }

  addMessage(reply, "bot");
}

function emergencyReply() {
  addMessage(
    `Neenga ippo romba kashtamana situation-la irukkura maadhiri theriyudhu. Neenga thaniya face panna vendam.<br><br>
    <b>India emergency support:</b><br>
    📞 Emergency: 112<br>
    📞 Tele-MANAS Mental Health: 14416 / 1-800-891-4416<br>
    📞 Women Helpline: 181<br>
    📞 Child Helpline: 1098<br>
    📞 Ambulance: 108<br><br>
    Ippo unga nambikkaiyana friend/family member kitta call pannunga. Danger irundha 112 call pannunga.`,
    "bot"
  );
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
