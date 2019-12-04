---
layout: "docs"
---

Dictionary in IMA.js app serves many purposes. Simplest of them is keeping text strings out of component markup. More advanced one would be internationalisation and in-text replacements.

## Configuration

First we need to tell IMA.js where to look for dictionary files. Naming convention of the files is up to you, but it should be clear what language are the files meant for and **glob pattern** has to be able to match path to the files.

```javascript
// app/build.js

let languages = {
  cs: [
    './app/component/**/*CS.json',
    './app/page/**/*CS.json'
  ],
  en: [
    './app/component/**/*EN.json',
    './app/page/**/*EN.json'
  ]
};
```

> **Note**: File name is used as a namespace for strings it defines. String defined under key `submit` in file `uploadFormCS.json` will be accessible under `uploadForm.submit`.

We also need to specify what language is the app using. This is done dynamically depending on current URL. You can customize URL to language mapping in environment settings. Key-value pairs are used for configuring the languages used with specific hosts or starting paths.
 - **Key** has to start with '//' instead of a protocol, and you can define the root path. Optional parameter ":language" could be defined at the end to display language in the URL.
 - **Value** is a language to use when the key is matched by the current URL. If the ":language" parameter is used, the language specified in this value is used as the default language when the path part specifying the language is not present in the current URL.

```javascript
// app/environment.js
module.exports = (() => {
  return {
    prod: {
      $Language: {
        '//*:*': 'cs'
      }
    // ...
```

## Usage

Every component and view extending **AbstractComponent** has access to method `localize` from within its instance. This method is alias to a `get` method from the Dictionary instance and takes 2 arguments:
 - **key** - namespace and name of the localization string. If you have `submitAnswer` string in file `pollVoteEN.json` the key to this string would be `pollVote.submitAnswer`.
 - **paramaters** - Optional object with replacements and parameters for **format-message** syntax. For more info about the syntax check out [ICU guide](http://userguide.icu-project.org/formatparse/messages).

```javascript
// app/component/poll/PollVote.jsx

_renderSubmitButton() {
  return (
    <button
      class={this.cssClasses('poll__submit-btn')}
      onClick={event => this.onSubmit(event)}>
      {this.localize('pollVote.submitAnswer')}
    </button>
  );
}
```

Dictionary is also registered in [Object Container](/docs/object-container) and thus can be obtained in Controllers, Extensions and other classes constructed through OC. 
