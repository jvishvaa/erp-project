
export const iframeContents2 = `

<html>

<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css">
 <style>
.input{
   width:1150px;
   padding-top:30px;
   margin-bottom:20px;
 }
 </style>
</head>

<body>
<input class="input" id="keyboard" placeholder="यहाँ टाइप करें ... "/>
<div class="simple-keyboard"></div>

<script src="https://cdn.jsdelivr.net/npm/simple-keyboard@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/simple-keyboard-layouts@latest"></script>
<script> 
/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */

let Keyboard = window.SimpleKeyboard.default
let KeyboardLayouts = window.SimpleKeyboardLayouts.default

/**
 * Available layouts
 * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
 */
let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  layout:  { default: [  "\u0900 \u0901 \u0902 \u0903 \u0904 \u0905 \u0906 \u0907 \u0908 \u0909 \u090A \u090B {bksp}",
  "{tab} \u090F \u0910 \u0913 \u0914 \u0915 \u0916 \u0917 \u0918 \u0919 \u091A \u091B",
  "{lock} \u091C \u091D \u091E \u091F \u0920 \u0921 \u0922 \u0923 \u0924 \u0925 {enter}",
  "{shift} \u0926 \u0927 \u0928 \u0929 \u092A \u092B \u092C , . / {shift}",
  "{alt} {space} {alt}"
  ],
  "shift" : [
  "! @ \u0966 \u0967 \u0968 \u0969 \u096A \u096B \u096C \u096D \u096E \u096F {bksp}",
  "{tab} \u092D \u092E \u092F \u0930 \u0931 \u0932 \u0933 \u0935 \u0936 \u0937 \u0938 \u0939",
  "{lock} क्ष त्र ज्ञ श्र \u093A \u093B \u093C \u093D \u093E \u093F \u0940 \u0941 \u0942 \u0943 {enter}",
  "{shift} \u0944 \u0945 \u0946 \u0947 \u0948 \u0949 \u0964 \u0965 \u095C < > / {shift}",
  " {alt} {space} {alt}"] }
  })

/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector('.input').addEventListener('input', event => {
  keyboard.setInput(event.target.value)
})

console.log(keyboard)

function onChange (input) {
  document.querySelector('.input').value = input
  console.log('Input changed', input)
}

function onKeyPress (button) {
  console.log('Button pressed', button)

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === '{shift}' || button === '{lock}') handleShift()
}

function handleShift () {
  let currentLayout = keyboard.options.layoutName
  let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

  keyboard.setOptions({
    layoutName: shiftToggle
  })
}
</script>
</body>
</html>
`
