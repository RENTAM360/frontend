export function getInitials(fullName: string) {
  if (!fullName || typeof fullName !== 'string') {
    return ''; 
  }

  const words = fullName.split(' '); 
  const initials = words.map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase();
    }
    return '';
  }).join(''); 

  return initials;
}