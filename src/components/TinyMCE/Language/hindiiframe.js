
export const hindiiframeContent = `


<html>
<head>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

<script type="text/javascript">
  // Load the Google Transliteration API
  google.load("elements", "1", {
    packages: "transliteration"
  });

  function onLoad() {
    var options = {
      sourceLanguage: 'en',
      destinationLanguage: ['hi'],
      shortcutKey: 'ctrl+m',
      transliterationEnabled: true
    }

    // Create an instance on TransliterationControl with the required options.
    var control = new google.elements.transliteration.TransliterationControl(options);

    // Enable transliteration in the textfields with the given ids.
    var ids = ["language"];
    control.makeTransliteratable(ids);

    // Show the transliteration control which can be used to toggle between English and Hindi and also choose other destination language.
    control.showControl('translControl');
  }

  google.setOnLoadCallback(onLoad);
</script>
</head>
<body>
<form><textarea name="ta"  rows="6"  id="language" cols="6" placeholder="यहाँ टाइप करें ...  " style="width:1100px;height:400px;" ></textarea></form>
</body>
</html>
`
