/**
 * Copies a string of text to the system clipboard and displays an alert message.
 * 
 * @param {string} text - The text content to copy
 * @param {string} [message="Copied to clipboard!"] - The toast alert feedback message
 */
export const copyToClipboard = (text, message = "Copied to clipboard!") => {
  if (!navigator.clipboard) {
    // Fallback for older environments
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert(message);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
    return;
  }
  
  navigator.clipboard.writeText(text)
    .then(() => {
      alert(message);
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
};
