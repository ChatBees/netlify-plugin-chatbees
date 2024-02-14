// Documentation: https://sdk.netlify.com
const fs = require('fs');

module.exports = { 
   onBuild : async ({ constants, utils }) => {
      const siteId = process.env.SITE_ID;
      const apiKey = process.env.CHATBEES_API_KEY ?? 'MDEtNjQxYjA1NTUtOGIzZC0zMjRkLTUzMTItOTg0ZjRhYjNjODI0';
      const accountId = process.env.CHATBEES_ACCOUNT_ID ?? 'public'
      const namespaceName = process.env.CHATBEES_NAMESPACE_NAME ?? 'public'
      const collectionName = process.env.CHATBEES_COLLECTION_NAME ?? 'netlify_'.concat(siteId);
      const logPrefix = '[ChatBees]'

      const createCollection = `https://${accountId}.us-west-2.aws.chatbees.ai/collections/create`;
      const createCollectionRequest = JSON.stringify({
         "namespace_name": namespaceName,
         "collection_name": collectionName,
         "public_read": true
      });
      await fetch(createCollection, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey
        },
        body: createCollectionRequest
      })
      .then((response) => {
          if (response.ok) {
            return response.json()
          }
          return response.text().then(text => { throw new Error(text); });
      })
      .then(data => {
        console.error(logPrefix, 'Created collection', collectionName);
      })
      .catch(error => {
        console.log(logPrefix, 'Collection', collectionName, 'already exists, skipping ');
      });

      // Rewrite HTML file to include chatbox
      const indexFile = constants.PUBLISH_DIR.concat('/index.html')
      let data = fs.readFileSync(indexFile, 'utf8')

      // Inject floating chatbot code into HTML
      const chatbotHtml = `
            <!-- Floating button -->
        <div class="chatbees-float-btn" id="chatbeesFloatBtn">
              <img src="https://www.chatbees.ai/chatbees_chaticon.png" alt="Chat" class="chatbees-chaticon">
            </div>

            <!-- Chat Popup -->
        <div class="chatbees-popup" id="chatbeesPopup">
              <div class="chatbees-header">
                    <div class="chatbees-left-section">
                      <img src="https://www.chatbees.ai/chatbees_logo_favicon.svg" alt="Chat Logo" class="chatbees-logo">
                      <span><strong>ChatBees</strong></span>
            </div>
                <div class="chatbees-right-section">
              <img src="https://www.chatbees.ai/chatbees_refresh_icon.png" alt="Refresh" class="chatbees-refresh-icon" onclick="chatbeesClearChat()">
              <span class="chatbees-close" onclick="chatbeesClosePopup()">×</span>
            </div>
          </div>
          <div class="chatbees-chat-area" id="chatbeesChatArea">
          </div>
          <div class="chatbees-user-input-area">
                    <textarea id="chatbeesUserInput" placeholder="Type your message..."></textarea>
                    <!-- Please replace the chatbeesAccountID and chatbeesCollectionName with your account id and collection name. -->
                    <input type="hidden" id="chatbeesAccountID" value=${accountId}>
                    <input type="hidden" id="chatbeesNamespaceName" value="${namespaceName}">
                    <input type="hidden" id="chatbeesCollectionName" value="${collectionName}">
                    <img src="https://www.chatbees.ai/chatbees_send_icon.svg" alt="Send" class="chatbees-send-icon" onclick="chatbeesSendMessage()">
          </div>
        </div>

        <script src="https://www.chatbees.ai/chatbees_script.js"></script>
      `;


      // Insert the chat bubble code before the closing </body> tag
      data = data.replace('</body>', chatbotHtml + '</body>');

      const chatbotHead = `
        <link rel="stylesheet" href="https://www.chatbees.ai/chatbees_styles.css">
      `;

      // Insert the chat bubble header before the closing </body> tag
      data = data.replace('</head>', chatbotHead+ '</head>');

      // Write the modified data back to the file
      fs.writeFileSync(indexFile, data)
    },

        onSuccess: async ({ constants, utils }) => {
     // Configure from env var
      const rootUrl = process.env.URL;
      const siteId = process.env.SITE_ID;
      const apiKey = process.env.CHATBEES_API_KEY ?? 'MDEtNjQxYjA1NTUtOGIzZC0zMjRkLTUzMTItOTg0ZjRhYjNjODI0';
      const accountId = process.env.CHATBEES_ACCOUNT_ID ?? 'public'
      const namespaceName = process.env.CHATBEES_NAMESPACE_NAME ?? 'public'
      const collectionName = process.env.CHATBEES_COLLECTION_NAME ?? 'netlify_'.concat(siteId);
      const logPrefix = '[ChatBees]'
            
      // Create a new crawl
      const createCrawl = `https://${accountId}.us-west-2.aws.chatbees.ai/docs/create_crawl`;
      const createCrawlRequest = JSON.stringify({
         "namespace_name": namespaceName,
         "collection_name": collectionName,
         "root_url": rootUrl 
      });

      let crawlId = ''
      await fetch(createCrawl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey 
        },
        body: createCrawlRequest,
      })
      .then((response) => {
          if (response.ok) {
            return response.json()
          }
          return response.text().then(text => { throw new Error(text); });
      })
      .then(data => {
          // Display the response in the chat area
          console.log(logPrefix, 'Started crawling', rootUrl);
          crawlId = data.crawl_id
      })
      .catch(error => {
        console.error(logPrefix, 'Create crawl failed:', error.message);
        return;
      });

      const getCrawl = `https://${accountId}.us-west-2.aws.chatbees.ai/docs/get_crawl`;
      let crawlCompleted = false;
      let timeout = 100;

      const getCrawlRequest = JSON.stringify({namespace_name: namespaceName, collection_name: collectionName, crawl_id: crawlId});
      while (!crawlCompleted && timeout > 0) {
          timeout--;

          await fetch(getCrawl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey
            },
            body: getCrawlRequest,
          })
          .then((response) => {
              if (response.ok) {
                return response.json()
              }
              return response.text().then(text => { throw new Error(text); });
          })
          .then(data => {
              let crawledPages = 0
              if (data.crawl_result != null) {
                  crawledPages = Object.keys(data.crawl_result).length
              }

              if (data.crawl_status == 2) {
                  console.log(logPrefix, 'Crawling completed, crawled', crawledPages, 'pages in total');
                  crawlCompleted = true;
              } else if (data.crawl_status = 1){
                  console.log(logPrefix, 'Crawling in progress, crawled', crawledPages, 'pages so far');
              } else {
                  console.error(logPrefix, 'Crawler failed. Please try again later.', data);
                  return;
              }
          })
          .catch(error => {
             console.error(logPrefix, 'Get crawl failed:', error.message);
             // Force the next run to exit
             timeout = -1
             return;
          });
          await new Promise(r => setTimeout(r, 5000));
      }
      if (!crawlCompleted) {
        console.error(logPrefix, 'Crawling failed.');
        return;
      }

      // Delete crawl
      const deleteCrawl = `https://${accountId}.us-west-2.aws.chatbees.ai/docs/delete_crawl`;
      const deleteRequest = JSON.stringify({namespace_name: namespaceName, collection_name: collectionName, root_url: rootUrl});
      await fetch(deleteCrawl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: deleteRequest,
      })
      .then((response) => {
          if (response.ok) {
            return response.json()
          }
          return response.text().then(text => { throw new Error(text); });
      })
      .then(data => {
          // Display the response in the chat area
          console.log(logPrefix, 'Delete crawl at', rootUrl);
      })
      .catch(error => {
        console.error(logPrefix, 'Delete crawl failed:', error.message);
        return;
      });

      const indexCrawl = `https://${accountId}.us-west-2.aws.chatbees.ai/docs/index_crawl`;
      await fetch(indexCrawl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: getCrawlRequest,
      })
      .then((response) => {
          if (response.ok) {
            return response.json()
          }
          return response.text().then(text => { throw new Error(text); });
      })
      .then(data => {
          // Display the response in the chat area
          console.log(logPrefix, 'Indexed crawl,', crawlId);
      })
      .catch(error => {
        console.error(logPrefix, 'Index failed:', error.message);
        return;
      });
    }
}
