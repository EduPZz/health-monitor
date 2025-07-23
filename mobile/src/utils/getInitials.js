export default function getInitials(name) {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    const word = words[0];
    if (word.length < 2) return word.charAt(0).toUpperCase();
    else return word.charAt(0).toUpperCase() + word.charAt(1).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
};
