function createSecondBrainWidget(botId) {
  (function getSetInfo() {
    console.log('Getting set info...', botId);
    // check if element with id secondbrain.fyi-widget exists
    if (document.getElementById('secondbrain.fyi-widget')) {
      console.log('secondbrain.fyi widget already exists');
      return;
    }
    //-- HTML --
    const topSection = document.createElement("div");
    topSection.id = "secondbrain.fyi-widget";
    topSection.innerHTML = `<div id="secondbrain.fyi-chat-window" style="padding: 8px;
        width: 350px; max-width: 450px; box-shadow: rgb(17 12 46 / 15%) 0px 48px 100px 0px;
        border-radius: 8px; z-index: 1000; flex-direction: column; justify-content: center; align-items: center; min-width: 300px; position: fixed; bottom: 80px; overflow: hidden; overflow-y: scroll; right: 28px; border: 1px solid lightgray; background-color: white;">
            <div id="chat-container" style="width:100%"></div>
            <div style="display: flex; justify-items: flex-start; width: 100%;" >
                <div id="ai-thinking" style="display:none" class="chat-bubble">
                    <div class="typing">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    </div></div>
            </div>
            <!-- input field no tailwind css -->
            <form id="secondbrain.fyi-message_form" style="margin-top: 12px; display: flex; width: 98%; border: 1px solid lightgray; border-radius: 4px;">
                <input id="secondbrain.fyi-input" type="text" id="message"
                    style=" width: 100%; border: none; padding: 12px; border-radius: 4px; outline: none; font-family: Plus Jakarta Sans; font-size: 14px;">
                <button type="submit" id="secondbrain.fyi-send"
                    style="border: none; background-color: transparent; display: flex; align-items: center; cursor: pointer;">
                    <svg style="height:20px; width:20px; margin-right: 6px;" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path
                            d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </form>
            <p style="margin: 4px 0px; margin-top: 6px; font-size: 12px; color: gray;">powered by <a
                    href="https://www.secondbrain.fyi">secondbrain.fyi</a></p>
        </div>
        <button id="toggle-magichatwidget" style="display: flex;
        justify-content: center; align-items: center; color: white;
        border: none;
        cursor: pointer;
        position: fixed;
        bottom: 23px;
        right: 28px;
        padding: 8px;
        border-radius: 40px;
        background-color: #000;
        box-shadow: rgb(17 12 46 / 15%) 0px 20px 16px 0px;
        z-index: 9999;">
            <svg style="height:30px; width:30px; fill:white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd"
                    d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                    clip-rule="evenodd" />
            </svg>
        </button>`;

    // add <script type="module" src="https://md-block.verou.me/md-block.js"></script> to head
    var script = document.createElement("script");
    script.type = "module";
    script.src = "https://md-block.verou.me/md-block.js";
    document.querySelector(`head`).appendChild(script);
    document.querySelector(`body`).appendChild(topSection);
    //-- CSS --
    var style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
html,
body {
    padding: 0;
    margin: 0;
    font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif !important;
}

a {
    color: inherit;
    text-decoration: none;
}

* {
    box-sizing: border-box;
}
.chat-bubble {
    background-color:rgb(244, 244, 245);
    padding:8px 12px;
    -webkit-border-radius: 20px;
    -webkit-border-bottom-left-radius: 2px;
    -moz-border-radius: 20px;
    -moz-border-radius-bottomleft: 2px;
    border-radius: 20px;
    border-bottom-left-radius: 2px;
    display:inline-block;
  }
  .typing {
    align-items: center;
    display: flex;
    height: 17px;
  }
  .typing .dot {
    animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
    background-color: #6CAD96 ; //rgba(20,105,69,.7);
    border-radius: 50%;
    height: 7px;
    margin-right: 4px;
    vertical-align: middle;
    width: 7px;
    display: inline-block;
  }
  .typing .dot:nth-child(1) {
    animation-delay: 200ms;
  }
  .typing .dot:nth-child(2) {
    animation-delay: 300ms;
  }
  .typing .dot:nth-child(3) {
    animation-delay: 400ms;
  }
  .typing .dot:last-child {
    margin-right: 0;
  }
  
  @keyframes mercuryTypingAnimation {
    0% {
      transform: translateY(0px);
      background-color:#6CAD96; // rgba(20,105,69,.7);
    }
    28% {
      transform: translateY(-7px);
      background-color:#9ECAB9; //rgba(20,105,69,.4);
    }
    44% {
      transform: translateY(0px);
      background-color: #B5D9CB; //rgba(20,105,69,.2);
    }
  }
`;
    document.head.appendChild(style);
    console.log("secondbrain.fyi widget loaded");
    //-- JS --
    // set on click to open chat
    document.getElementById("toggle-magichatwidget").onclick = function () {
      // check if open or close
      if (document.getElementById("secondbrain.fyi-chat-window").style.display == "flex") {
        console.log("close");
        document.getElementById("secondbrain.fyi-chat-window").style.display = "none";
        document.getElementById("toggle-magichatwidget").innerHTML = `<svg style="height:30px; width:30px; fill:white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd"
                    d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                    clip-rule="evenodd" />
            </svg>`;
      } else {
        console.log("open");
        document.getElementById("secondbrain.fyi-chat-window").style.display = "flex";
        document.getElementById("toggle-magichatwidget").innerHTML = `<svg style="height:30px; width:30px; fill:white"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
              `;
      }
    };
    // set onsubmit to form with id secondbrain.fyi-message_form
    document.getElementById("secondbrain.fyi-message_form").onsubmit = async function (e) {
      e.preventDefault();
      // get input value
      var input = document.getElementById("secondbrain.fyi-input").value;
      // add answer to chat
      chatContent.push({
        role: 'user',
        content: input
      });
      // render chat
      renderChat(chatContent);
      // remove from input
      document.getElementById("secondbrain.fyi-input").value = "";
      // show thinking 
      document.getElementById("ai-thinking").style.display = "block";
      // disable send button
      document.getElementById("secondbrain.fyi-send").disabled = true;
      // add input to chat
      await askAI(chatContent, input);
      // enable send button
      document.getElementById("secondbrain.fyi-send").disabled = false;

    };
    // Chat content data
    const chatContent = [
      {
        role: 'system',
        content: 'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given text. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer, remember you are the text I am having a chat with. Refuse to answer any question not about the text. Never break character.'
      },
      {
        role: 'assistant',
        content: 'Hello, I am AI Assistant. Ask me anything'
      }
    ];

    function createChatMessage(messageData) {
      const messageContainer = document.createElement('div');
      messageContainer.style.cssText = `
      display: flex;
      clear: both;
      margin-${messageData.role === 'user' ? 'left' : 'right'}: 8px;
      justify-content: ${messageData.role === 'user' ? 'flex-end' : 'flex-start'};
    `;

      const message = document.createElement('div');
      message.style.cssText = `
      background-color: ${messageData.role === 'user' ? 'rgb(59, 129, 246)' : 'rgb(244, 244, 245)'};
      color: ${messageData.role === 'user' ? 'white' : 'black'};
      display: inline-block;
      margin-bottom: 8px;
      overflow: auto;
      border-radius: 12px;
      padding: 12px 16px;
      max-width: 100%;
    `;

      const messageWrapper = document.createElement('div');
      messageWrapper.style.cssText = `
      display: flex;
      gap: 12px;
    `;

      const messageContent = document.createElement(messageData.role === 'assistant' ? 'md-block' : 'div');
      messageContent.style.cssText = messageData.role === 'assistant' ?
        `flex-grow: 1;
         gap: 16px; font-size:14px;`:
        `flex-grow: 1;
         gap: 16px;`;

      const messageText = document.createElement('p');
      messageText.innerHTML = messageData.content;
      messageText.style.margin = 0;
      messageText.style.wordBreak = 'break-word';
      messageText.style.fontSize = '14px';

      messageContent.appendChild(messageText);
      messageWrapper.appendChild(messageContent);
      message.appendChild(messageWrapper);
      messageContainer.appendChild(message);
      return messageContainer;
    }

    async function askAI(chatContent, query) {
      fetch('http://localhost:3000/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bot_id: botId, chatContent: chatContent })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Answer:', data.answer + "contextString" + data.contextString + `prompt: ${data.prompt}`);
          // add answer to chat
          chatContent.push({
            role: 'assistant',
            content: data.answer
          });
          // render chat
          renderChat(chatContent);
          addQnA(query, data.answer);
          // hide thinking
          document.getElementById("ai-thinking").style.display = "none";
        })
        .catch((error) => {
          console.error('Error:', error);
          // hide thinking
          document.getElementById("ai-thinking").style.display = "none";
        });
    }

    function addQnA(question, answer) {
      console.log('Adding QnA:', botId, question, answer);
      try {
        const response = fetch('http://localhost:3000/api/add-qna', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bot_id: botId, question: question, answer: answer }),
        });

        if (!response.ok) {
          const errorData = response.json();
          throw new Error(errorData.error);
        }

        const { data } = response.json();
        console.log('QnA added successfully:', data);
      } catch (error) {
        console.error('Error adding QnA:', error.message);
      }
    }

    function renderChat(chatData) {
      const chatContainer = document.getElementById('chat-container');
      // Clear the chat
      chatContainer.innerHTML = '';

      // start from second message 
      chatData.slice(1).forEach((message) => {
        const chatMessage = createChatMessage(message);
        chatContainer.appendChild(chatMessage);
      });
    }

    // Render the chat
    renderChat(chatContent);
    console.log('chatContent', chatContent);

  })();
}

(function () {
  var botId = document.currentScript.getAttribute('id');
  console.log('botId', botId);
  createSecondBrainWidget(botId);
})();