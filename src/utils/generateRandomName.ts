const generateRandomName = (() => {
  const names = [
    "Darknight Chamber",
    "Lucy's Haven",
    "Roronoa Retreat",
    "Gojo Quarters",
    "Gogo Lounge",
    "Shadow Suite",
    "Phoenix Nest",
    "Blaze Chamber",
    "Serenity Manor",
    "Vortex Parlor",
    "Nova Quarters",
    "Zephyr Haven",
    "Luna Lodgings",
    "Solstice Suite",
    "Ignite Quarters",
    "Abyss Chamber",
    "Eclipse Lounge",
    "Tempest Haven",
    "Astral Lodgings",
    "Cipher Quarters",
    "Nebula Suite",
    "Valkyrie Retreat",
    "Stellar Chambers",
    "Quasar Quarters",
    "Chronos Suite",
    "Crimson Quarters",
    "Aether Retreat",
    "Celestia Chamber",
    "Spectre Lodgings",
    "Orion Oasis",
  ];

  let index = 0;

  return () => {
    if (index === 0) {
      // Shuffle the array when index is reset to 0
      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
      }
    }
    return names[index++ % names.length];
  };
})();

export default generateRandomName;
