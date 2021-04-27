class FakeSearchParam {
    alphabets = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
    generate =(noOfParams, lettersPerWord) => {
      let param = []
      for (let paramCount = 0; paramCount <= noOfParams; paramCount++) {
        let paramName = this.randomWord(lettersPerWord)
        let paramCombiner = '='
        let paramValue = Math.ceil(Math.random())
        param.push([paramName, paramCombiner, paramValue].join(''))
      }
      return param.join('&')
    }
    randomWord= (lettersPerWord = 4) => {
      let word = ''
      for (let i = 0; i < lettersPerWord; i++) {
        let index = Math.floor(Math.random() * this.alphabets.length)
        word += this.alphabets[index]
      }
      return word
    }
}

export default FakeSearchParam
