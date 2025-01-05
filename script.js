const fontFamily = document.getElementById('fontFamily');
const fontSize = document.getElementById('fontSize');
const increaseFontSize = document.getElementById('increaseFontSize');
const decreaseFontSize = document.getElementById('decreaseFontSize');
const bold = document.getElementById('bold');
const italic = document.getElementById('italic');
const underline = document.getElementById('underline');
const fontColor = document.getElementById('fontColor');
const editor = document.getElementById('editor');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const trashIcon = document.getElementById('trashIcon');
const preview = document.getElementById('preview');
const coffee = document.getElementById('coffee');


const fontOptions = [
  { name: "Calibri", style:"Calibri, san-serif"},
  { name: "Arial", style: "Arial, sans-serif" },
  { name: "Times New Roman", style: "'Times New Roman', serif" },
  { name: "Courier New", style: "'Courier New', monospace" },
  { name: "Georgia", style: "Georgia, serif" },
  { name: "Verdana", style: "Verdana, sans-serif" },
];

fontOptions.forEach((font) => {
  const option = document.createElement("option");
  option.value = font.style;
  option.textContent = font.name;
  option.style.fontFamily = font.style;
  fontFamily.appendChild(option);
});

fontFamily.addEventListener('change', () => {
  preview.style.fontFamily = fontFamily.value;
});

coffee.addEventListener('click', () => {
  console.log("Coffee Clicked!"); 

  const numBeans = 50; 
  for (let i = 0; i < numBeans; i++) {
    createCoffeeBean();
  }
});

function createCoffeeBean() {
  const bean = document.createElement('img');
  bean.src = './assets/images/bean.png';
  bean.classList.add('coffee-bean');

  bean.style.left = Math.random() * window.innerWidth + 'px';
  bean.style.width = '30px';
  bean.style.height = 'auto';

  bean.style.position = 'fixed';
  bean.style.top = '-100px';
  bean.style.zIndex = '1000';

  const fallDuration = Math.random() * 3 + 2;  
  bean.style.animation = `coffeeRain ${fallDuration}s linear forwards`;

  document.body.appendChild(bean);

  setTimeout(() => {
    bean.remove();
  }, fallDuration * 1000);  
}


editor.addEventListener('input', () => {
  const text = editor.value.trim();
  wordCount.textContent = `Words: ${text ? text.split(/\s+/).length : 0}`;
  charCount.textContent = `Characters: ${text.length}`;
  updatePreview();
});

fontFamily.addEventListener('change', () => {
  preview.style.fontFamily = fontFamily.value;
});

fontSize.addEventListener('change', () => {
  preview.style.fontSize = fontSize.value + 'px';
});

increaseFontSize.addEventListener('click', () => {
  let currentSize = parseInt(window.getComputedStyle(preview).fontSize);
  preview.style.fontSize = currentSize + 1 + 'px';
});

decreaseFontSize.addEventListener('click', () => {
  let currentSize = parseInt(window.getComputedStyle(preview).fontSize);
  preview.style.fontSize = currentSize - 1 + 'px';
});

bold.addEventListener('click', () => {
  preview.style.fontWeight = preview.style.fontWeight === 'bold' ? 'normal' : 'bold';
  bold.classList.toggle('active');
});

italic.addEventListener('click', () => {
  preview.style.fontStyle = preview.style.fontStyle === 'italic' ? 'normal' : 'italic';
  italic.classList.toggle('active');
});

underline.addEventListener('click', () => {
  preview.style.textDecoration = preview.style.textDecoration === 'underline' ? 'none' : 'underline';
  underline.classList.toggle('active');
});

fontColor.addEventListener('input', () => {
  preview.style.color = fontColor.value;
});

function updatePreview() {
  preview.textContent = editor.value;
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {
    switch (event.key.toLowerCase()) {
      case 'b':
        event.preventDefault();
        bold.click();
        break;
      case 'i':
        event.preventDefault();
        italic.click();
        break;
      case 'u':
        event.preventDefault();
        underline.click();
        break;
      case 'c':
        event.preventDefault();
        navigator.clipboard.writeText(editor.value).then(() => {
          alert('Content copied to clipboard!');
        });
        break;
      case 'v':
        event.preventDefault();
        navigator.clipboard.readText().then((text) => {
          editor.value += text;
          updatePreview();
        });
        break;
    }
  }
});

trashIcon.addEventListener('click', () => {
  editor.value = '';
  updatePreview(); 
});

setInterval(() => {
  localStorage.setItem('editorContent', editor.value);
}, 5000); // Autosave every 5 seconds

// Load saved content on page load
window.onload = () => {
  const savedContent = localStorage.getItem('editorContent');
  if (savedContent) {
    editor.value = savedContent;
    updatePreview();
  }
  const loadingScreen = document.getElementById('loadingScreen');
  
  // Set a timeout to hide the loading screen after 3 seconds
  setTimeout(() => {
    loadingScreen.style.display = 'none'; // Hide the loading screen
  }, 3000); // 3000 milliseconds = 3 seconds
};

document.getElementById('exportTxt').addEventListener('click', () => {
  const blob = new Blob([editor.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'document.txt';
  link.click();
});

// Import jsPDF from the global scope
const { jsPDF } = window.jspdf;

document.getElementById('exportPdf').addEventListener('click', () => {
  const pdf = new jsPDF();
  
  // Get font size and color
  const fontSize = parseInt(window.getComputedStyle(preview).fontSize);
  const fontColor = preview.style.color || '#000000'; // Default to black if no color is set

  // Set default font size and color
  pdf.setFontSize(fontSize);
  pdf.setTextColor(fontColor);
  pdf.setFont("helvetica"); // Change to a supported font if needed

  // Split the editor content into lines
  const textLines = editor.value.split('\n');
  let y = 10; // Starting Y position

  textLines.forEach((line) => {
    // Check for styles in the line
    let currentFont = "normal";
    if (bold.classList.contains('active')) {
      currentFont = "bold";
    }
    if (italic.classList.contains('active')) {
      currentFont = "italic";
    }

    // Set the font style
    pdf.setFont(currentFont);

    // Add the text to the PDF
    pdf.text(line, 10, y);
    y += fontSize + 2; // Move down for the next line
  });

  pdf.save('document.pdf');
});

document.getElementById('exportDoc').addEventListener('click', () => {
  const fontSize = parseInt(window.getComputedStyle(preview).fontSize);
  const fontColor = preview.style.color || '#000000'; // Default to black if no color is set

  // Create a simple HTML structure for the Word document
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-size: ${fontSize}px;
            color: ${fontColor};
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Ensure the font family is set */
          }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .underline { text-decoration: underline; }
        </style>
      </head>
      <body>
        ${editor.value.replace(/\n/g, '<br>').replace(/<b>(.*?)<\/b>/g, '<span class="bold">$1</span>')
                      .replace(/<i>(.*?)<\/i>/g, '<span class="italic">$1</span>')
                      .replace(/<u>(.*?)<\/u>/g, '<span class="underline">$1</span>')}
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'document.doc';
  link.click();
});
