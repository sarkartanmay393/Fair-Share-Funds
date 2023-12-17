const generateRandomName = () => {
  const names = [
    "Darknight",
    "Lucy",
    "Roronoa",
    "Gojo",
    "Gogo",
    "Shadow",
    "Phoenix",
    "Blaze",
    "Serenity",
    "Vortex",
    "Nova",
    "Zephyr",
    "Luna",
    "Solstice",
    "Ignite",
    "Abyss",
    "Eclipse",
    "Tempest",
    "Astral",
    "Cipher",
    "Nebula",
    "Valkyrie",
    "Stellar",
    "Quasar",
    "Chronos",
    "Crimson",
    "Aether",
    "Celestia",
    "Spectre",
    "Orion",
  ];
  return names[Math.round(Math.abs(Math.random() - 0.8) * 10) % names.length];
};

export default generateRandomName;
