
export const iframeContents1 = `

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
<input class="input" id="keyboard" placeholder="ಇಲ್ಲಿ  ಬರೆಯಿರಿ "/>
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
  layout:  {default: [
    "\u0cca \u0CE7 \u0CE8 \u0CE9 \u0CEA \u0CEB \u0CEC \u0CED \u0CEE \u0CEF \u0CE6 - \u0cc3 {bksp}",
    "{tab} \u0ccc \u0cc8 \u0cbe \u0cc0 \u0cc2 \u0cac \u0cb9 \u0c97 \u0ca6 \u0c9c \u0ca1",
    "{lock} \u0ccb \u0cc7 \u0ccd \u0cbf \u0cc1 \u0caa \u0cb0 \u0c95 \u0ca4 \u0c9a \u0c9f {enter}",
    "{shift} \u0cc6 \u0c82 \u0cae \u0ca8 \u0cb5 \u0cb2 \u0cb8 , . / {shift}",
    "{alt} {space} {alt}"
    ],
    "shift" : [
    "\u0c92 ! @ \u0ccd\u0cb0 \u0cb0\u0ccd \u0c9c\u0ccd\u0c9e \u0ca4\u0ccd\u0cb0 \u0c95\u0ccd\u0cb7 \u0cb6\u0ccd\u0cb0 ( ) \u0c83 \u0c8b {bksp}",
    "{tab} \u0c94 \u0c90 \u0c86 \u0c88 \u0c8a \u0cad \u0c99 \u0c98 \u0ca7 \u0c9d \u0ca2 \u0c9e",
    "{lock} \u0c8f \u0c85 \u0c87 \u0c89 \u0cab \u0cb1 \u0c96 \u0ca5 \u0c9b \u0ca0 {enter}",
    "{shift} \u0c8e \u0ca3 \u0cb3 \u0cb6 \u0cb7 \u0c93  < > / {shift}",
    " {alt} {space} {alt}"
    ] }
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
