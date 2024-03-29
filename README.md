# ChatBees plugin for Netlify

**Add a personalized AI assistant to your website in seconds**

You can check our our sample site [before](https://65bbd0916a9bd103ba1694dc--transcendent-quokka-d0500e.netlify.app/) and [after](https://transcendent-quokka-d0500e.netlify.app/) installing ChatBees

The [ChatBees](https://www.chatbees.ai) plugin seamlessly integrates an AI assistant into your website. This assistant is trained using your website's content, requiring no additional configuration. Simply install the plugin and redeploy your website to activate this feature.


<img src="https://i.postimg.cc/7L63gYXg/Screenshot-2024-01-31-at-11-00-23-PM.png" alt="drawing" width="800"/>


## Installation 
We're working on getting ChatBees plugin listed on Netlify to simplify the installation process. 
Meanwhile, please follow [File-based installation](https://docs.netlify.com/integrations/build-plugins/#configure-settings) and add the following configuration to your ```netlify.toml``` 
```
[[plugins]]
  package = "netlify-plugin-chatbees"
```

Then update your ```package.json``` to include ```netlify-plugin-chatbees``` dependency, run ```npm install -D netlify-plugin-chatbees``` or ```yarn add -D netlify-plugin-chatbees```.

## Post-installation
So far, ChatBees plugin created your AI assistant inside a shared ***public*** account. We may limit access to this account in the future, so please sign up with us to make sure your plugin is not affected. 

1. Sign up with your gmail at [ChatBees](https://www.chatbees.ai/) (let us know if you want to sign up with github, hotmail etc)
2. Create an API key if you haven't already.
3. Add the following Netlify environment variables (from your site -> "Site configuration" -> "Environment variables" -> "Add a variable" -> "Add a single variable")
   ```bash
   key: CHATBEES_ACCOUNT_ID
   scope: All scopes
   values: (Same value for all deploy contexts) <ENTER YOUR ACCOUNT ID HERE>
   ```

   ```bash
   key: CHATBEES_API_KEY
   scope: All scopes
   values: (Same value for all deploy contexts) <ENTER YOUR API KEY HERE>
   ```

## About ChatBees
[ChatBees](https://www.chatbees.ai) is a production-ready, serverless chat platform for your knowledge base. Our platform provides simple, scalable APIs for building LLM applications - in fact, you can build your own chatbot in minutes! Our goal is to enable LLM application developers to focus on building the best user experience without having to worry about productionization and deployment.


## How does this plugin work?
ChatBees executes two functions when your website is deployed:

1. ChatBees generates a personalized AI assistant that is integrated into your website
2. ChatBees scans your website content to train the AI assistant, ensuring it is knowledgeable about the information presented on your site.
   
Additionally, with each deployment, ChatBees updates your AI assistant to reflect the most current content available on your site.


## Pricing
ChatBees plugin is currently **FREE** to try (up to 200 unique URLs/pages per website) while we work out the details.Please contact us at build@chatbees.ai if your website contains more than 200 pages.


## Changelog
```Feb 2nd 2024``` v0.5 released
