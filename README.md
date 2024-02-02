# ChatBees plugin for Netlify

**Add a personalized AI assistant to your website in seconds**

You can check our our sample site [before](https://65bbd0916a9bd103ba1694dc--transcendent-quokka-d0500e.netlify.app/) and [after](https://transcendent-quokka-d0500e.netlify.app/) installing ChatBees

The [ChatBees](https://www.chatbees.ai) plugin seamlessly integrates an AI assistant into your website. This assistant is trained using your website's content, requiring no additional configuration. Simply install the plugin and redeploy your website to activate this feature.


<img src="https://i.postimg.cc/7L63gYXg/Screenshot-2024-01-31-at-11-00-23-PM.png" alt="drawing" width="800"/>


## How does it work?
ChatBees executes two functions when your website is deployed:

1. ChatBees generates a personalized AI assistant that is integrated into your website
2. ChatBees scans your website content to train the AI assistant, ensuring it is knowledgeable about the information presented on your site.
   
Additionally, with each deployment, ChatBees updates your AI assistant to reflect the most current content available on your site.

## Installation 
We're working on getting ChatBees plugin listed on Netlify to simplify the installation process. 
Meanwhile, please follow [File-based installation](https://docs.netlify.com/integrations/build-plugins/#configure-settings) and add the following configuration to your ```netlify.toml``` 
```
[[plugins]]
  package = "netlify-plugin-chatbees"
```

Then update your ```package.json``` to include ```netlify-plugin-chatbees``` dependency, run ```npm install -D netlify-plugin-chatbees``` or ```yarn add -D netlify-plugin-chatbees```.


## Pricing
ChatBees plugin is currently **FREE** to try (up to 200 unique URLs/pages per website) while we work out the details.Please contact us at build@chatbees.ai if your website contains more than 200 pages.


## Changelog
```Feb 2nd 2024``` v0.5 released
