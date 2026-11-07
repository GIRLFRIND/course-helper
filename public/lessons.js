window.skillPathLessons = [
  {
    id: "html-1", course: "html", title: "Build your first HTML page", duration: "12 min",
    summary: "Learn what HTML does and create the basic structure of a page.",
    sections: [
      { heading: "What HTML does", text: "HTML describes the meaning and structure of content in a web page. A browser reads the elements in your HTML file and turns them into a page people can read and use." },
      { heading: "Start with a document", text: "A document begins with a doctype declaration. The html element contains the whole page. The head holds page information, while the body holds visible content.", example: "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>Hello, web!</h1>\n    <p>This is my first page.</p>\n  </body>\n</html>" },
      { heading: "Try it yourself", text: "Create an index.html file. Change the page title and write a short welcome message inside the body." }
    ],
    task: "Add a second paragraph explaining what you want to learn."
  },
  {
    id: "html-2", course: "html", title: "Headings and paragraphs", duration: "14 min",
    summary: "Organize a page using meaningful headings and readable text.",
    sections: [
      { heading: "Give the page an outline", text: "Headings communicate the outline of a page to readers and assistive technology. Use h1 for the main page heading, followed by h2 for major sections and h3 for subsections. Choose a heading for its meaning, not just its default size." },
      { heading: "Write paragraphs", text: "Use a p element for a paragraph of text. Browsers add spacing around paragraphs by default, and CSS can change their appearance later.", example: "<h1>My garden</h1>\n<p>I grow herbs on my balcony.</p>\n<h2>What I grow</h2>\n<p>Basil and mint are my favorites.</p>" },
      { heading: "Try it yourself", text: "Write a page with one main heading, two section headings, and a paragraph under each section." }
    ],
    task: "Add a section about your favorite subject. Give it a heading and a descriptive paragraph."
  },
  {
    id: "html-3", course: "html", title: "Links, images, and lists", duration: "18 min",
    summary: "Connect pages and add images and structured lists.",
    sections: [
      { heading: "Link to another page", text: "An anchor element creates a link. Its href attribute says where the link goes, and its text should explain what opens when someone selects it.", example: "<a href=\"https://example.com\">Visit the example site</a>" },
      { heading: "Describe images", text: "Use the img element with a src attribute for the image file and useful alt text that describes its purpose. An image that is only decorative can use empty alt text.", example: "<img src=\"images/seedlings.jpg\" alt=\"Three seedlings growing in pots\">" },
      { heading: "Choose a list", text: "Use ul for a list where order does not matter, or ol when the sequence matters. Put each item in an li element.", example: "<ul>\n  <li>Seeds</li>\n  <li>Soil</li>\n  <li>A pot</li>\n</ul>" },
      { heading: "Try it yourself", text: "Add a list of three items to your page and a link to a site you find useful." }
    ],
    task: "Add an image with alt text that tells a reader what the picture shows."
  },
  {
    id: "html-4", course: "html", title: "Create a simple form", duration: "20 min",
    summary: "Collect information with labeled form controls.",
    sections: [
      { heading: "Forms collect information", text: "A form groups controls that collect information. A label helps everyone understand what to enter and can be clicked to focus its control." },
      { heading: "Connect labels and fields", text: "Give each control a unique id and set the matching label's for attribute. Choose an input type that describes the data, such as email for an email address.", example: "<form>\n  <label for=\"email\">Email address</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required>\n  <button type=\"submit\">Join</button>\n</form>" },
      { heading: "Try it yourself", text: "Create a form with a name field and an email field. Add a submit button and make both fields required." }
    ],
    task: "Add a label and a text input for a learner's name."
  },
  {
    id: "css-1", course: "css", title: "CSS rules and selectors", duration: "14 min",
    summary: "Select HTML elements and apply visual styles.",
    sections: [
      { heading: "How a CSS rule works", text: "A CSS rule has a selector and a declaration block. The selector chooses elements; each declaration names a property and a value.", example: "p {\n  color: #245c4b;\n  font-size: 1.1rem;\n}" },
      { heading: "Select by element, class, or id", text: "An element selector such as p matches all paragraphs. A class selector starts with a dot and can be reused. An id selector starts with # and should identify one element on the page.", example: ".highlight {\n  background-color: #e5f7ef;\n}\n\n#page-title {\n  color: #4a3e83;\n}" },
      { heading: "Connect a stylesheet", text: "Put CSS in a file such as styles.css and link it from the document head. Keeping styles separate makes a site easier to update.", example: "<link rel=\"stylesheet\" href=\"styles.css\">" },
      { heading: "Try it yourself", text: "Create a class named highlight, apply it to a paragraph, and give it a background color." }
    ],
    task: "Style your page heading with a color and a font size."
  },
  {
    id: "css-2", course: "css", title: "The box model and spacing", duration: "16 min",
    summary: "Understand content, padding, borders, and margins.",
    sections: [
      { heading: "Every element is a box", text: "The CSS box model describes an element's content, padding, border, and margin. Padding adds room inside the border; margin adds space outside it." },
      { heading: "Make sizes predictable", text: "By default, width describes only the content area. The border-box setting includes padding and borders in the declared width, which makes responsive layouts easier to reason about.", example: "* {\n  box-sizing: border-box;\n}\n\n.card {\n  width: 20rem;\n  padding: 1rem;\n  border: 1px solid #ccc;\n  margin-bottom: 1rem;\n}" },
      { heading: "Try it yourself", text: "Give a card padding, a border, and space below it. Compare padding with margin by changing each value." }
    ],
    task: "Make all elements use border-box sizing and add comfortable padding to a card."
  },
  {
    id: "css-3", course: "css", title: "Build a layout with Flexbox", duration: "18 min",
    summary: "Arrange items in a row or column and control their alignment.",
    sections: [
      { heading: "Make a flex container", text: "Set display: flex on a parent to arrange its direct children along a main axis. The default direction is a row.", example: ".toolbar {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}" },
      { heading: "Control direction and space", text: "Use flex-direction to switch between rows and columns. Use justify-content to distribute items along the main axis and align-items to position them across it.", example: ".card-list {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}" },
      { heading: "Try it yourself", text: "Build a navigation bar with a site name and three links. Use Flexbox and gap to space the items." }
    ],
    task: "Center an icon and label vertically inside a button using Flexbox."
  },
  {
    id: "css-4", course: "css", title: "Make a page responsive", duration: "18 min",
    summary: "Adapt a layout for narrow and wide screens.",
    sections: [
      { heading: "Start with flexible sizes", text: "A responsive page adapts to its available space. Prefer flexible widths, max-width, and wrapping instead of assuming every screen has the same size.", example: ".content {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}" },
      { heading: "Add a media query", text: "A media query applies styles only when a condition is true. This example changes a card layout from one column to two when the screen is wide enough.", example: ".cards {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n\n@media (min-width: 700px) {\n  .cards {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}" },
      { heading: "Try it yourself", text: "Preview your page at a narrow width, then add a breakpoint that makes your cards use two columns on wider screens." }
    ],
    task: "Check that text and buttons fit on a phone-sized screen without horizontal scrolling."
  },
  {
    id: "js-1", course: "js", title: "Variables and values", duration: "16 min",
    summary: "Store text, numbers, and other values in named variables.",
    sections: [
      { heading: "Give values useful names", text: "A variable is a named place to keep a value. Use const when you will not reassign the variable, and let when its value needs to change.", example: "const learnerName = \"Sam\";\nlet lessonsDone = 0;\nlessonsDone = lessonsDone + 1;" },
      { heading: "Work with common types", text: "Strings hold text, numbers hold numeric values, and booleans are true or false. The plus operator adds numbers or joins strings, depending on their types.", example: "const greeting = \"Hello, \" + learnerName;\nconst hasStarted = lessonsDone > 0;" },
      { heading: "Try it yourself", text: "Create variables for a course name and the number of lessons in it. Build a message that includes both values." }
    ],
    task: "Use a template literal to display a learner's name and completed lesson count."
  },
  {
    id: "js-2", course: "js", title: "Make decisions with conditions", duration: "18 min",
    summary: "Choose what the program does using conditions and functions.",
    sections: [
      { heading: "Use an if statement", text: "An if statement runs a block only when its condition is true. Add else when you want an alternative path.", example: "const score = 7;\n\nif (score >= 5) {\n  console.log(\"You passed\");\n} else {\n  console.log(\"Try again\");\n}" },
      { heading: "Put reusable work in a function", text: "A function gives a set of instructions a name. Parameters provide input, and return sends a result back to the caller.", example: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\"Sam\"));" },
      { heading: "Try it yourself", text: "Write a function that accepts a score and returns whether the learner passed." }
    ],
    task: "Add an else-if branch for a score that is close to passing."
  },
  {
    id: "js-3", course: "js", title: "Arrays and loops", duration: "20 min",
    summary: "Keep related values in arrays and repeat work with loops.",
    sections: [
      { heading: "Keep a list in an array", text: "An array stores an ordered list of values. Array positions start at zero, and length tells you how many items the list contains.", example: "const topics = [\"HTML\", \"CSS\", \"JavaScript\"];\nconsole.log(topics[0]);\nconsole.log(topics.length);" },
      { heading: "Repeat an action", text: "A for...of loop visits each value in an iterable such as an array. This is a clear way to perform the same action for each item.", example: "for (const topic of topics) {\n  console.log(`Next topic: ${topic}`);\n}" },
      { heading: "Try it yourself", text: "Create an array of three things you want to learn. Loop over it and print one sentence for each item." }
    ],
    task: "Add a fourth topic and use a loop to print the complete list."
  },
  {
    id: "js-4", course: "js", title: "Respond to a button click", duration: "22 min",
    summary: "Find an element on the page and respond to user actions.",
    sections: [
      { heading: "Find an element", text: "The document object represents the current web page. querySelector finds the first element that matches a CSS selector.", example: "const button = document.querySelector(\"#change-message\");\nconst message = document.querySelector(\"#message\");" },
      { heading: "Listen for an event", text: "Add an event listener to respond when something happens. A click handler can update text on the page without reloading it.", example: "button.addEventListener(\"click\", () => {\n  message.textContent = \"You clicked the button!\";\n});" },
      { heading: "Try it yourself", text: "Add a button and a paragraph to an HTML page. When clicked, make the button update the paragraph." }
    ],
    task: "Change the message each time the button is clicked."
  },
  {
    id: "python-1", course: "python", title: "Python values and variables", duration: "16 min",
    summary: "Store text and numbers, then display results.",
    sections: [
      { heading: "Store a value", text: "A Python variable gives a name to a value. Python uses the value to determine its type, so you do not have to declare the type separately.", example: "learner_name = \"Sam\"\nlessons_done = 0\nprint(learner_name)\nprint(lessons_done)" },
      { heading: "Combine values", text: "Use + to add numbers or join strings. Convert a number to text with str when combining it into a sentence.", example: "message = learner_name + \" has completed \" + str(lessons_done) + \" lessons.\"\nprint(message)" },
      { heading: "Try it yourself", text: "Create a variable for a favorite subject and print a sentence about it." }
    ],
    task: "Store a number of practice minutes and include it in a printed sentence."
  },
  {
    id: "python-2", course: "python", title: "Conditions and loops", duration: "18 min",
    summary: "Choose actions and repeat them with Python control flow.",
    sections: [
      { heading: "Choose with if and else", text: "Python runs an if block when its condition is true. Indentation marks which statements belong to each block.", example: "score = 7\n\nif score >= 5:\n    print(\"You passed\")\nelse:\n    print(\"Try again\")" },
      { heading: "Repeat with for", text: "A for loop visits values in a sequence. Use range when you need a sequence of numbers.", example: "for topic in [\"HTML\", \"CSS\", \"Python\"]:\n    print(\"Next topic:\", topic)" },
      { heading: "Try it yourself", text: "Make a list of three learning topics and print each one with a for loop." }
    ],
    task: "Use a condition to print a different message when a score is below five."
  },
  {
    id: "python-3", course: "python", title: "Write reusable functions", duration: "18 min",
    summary: "Create functions that accept input and return results.",
    sections: [
      { heading: "Define a function", text: "A function groups reusable instructions. The def keyword starts a function definition, and indented lines form its body.", example: "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Sam\"))" },
      { heading: "Return a result", text: "Use return to send a value back to the code that called the function. A returned result can be stored, printed, or passed to another function.", example: "def add(first, second):\n    return first + second\n\ntotal = add(3, 4)\nprint(total)" },
      { heading: "Try it yourself", text: "Write a function that takes the minutes studied each day and returns the total for a week." }
    ],
    task: "Call your function with two different inputs and print both results."
  },
  {
    id: "python-4", course: "python", title: "Lists and dictionaries", duration: "20 min",
    summary: "Collect values in lists and describe records with dictionaries.",
    sections: [
      { heading: "Store an ordered collection", text: "A list stores several values in order. You can access an item by its zero-based index and add another item with append.", example: "topics = [\"HTML\", \"CSS\"]\ntopics.append(\"Python\")\nprint(topics[0])" },
      { heading: "Describe a record", text: "A dictionary stores values under named keys. It is useful when each value has a label, such as a learner's name and course.", example: "learner = {\n    \"name\": \"Sam\",\n    \"course\": \"Python\",\n}\nprint(learner[\"course\"])" },
      { heading: "Try it yourself", text: "Create a dictionary for a book with title and author keys. Print a sentence using both values." }
    ],
    task: "Add a completed key to your learner dictionary and print its value."
  }
];
