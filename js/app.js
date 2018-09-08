$(()=>{
  
  function newCalc(){

  const model = {
    key: '', //numbers
    operator: '', //math operators
    combined: '', //string to evaluate
  };

  const controller = {

  	init(){
  		view.init();
  	},

  	setKey(key){
  		model.combined = (model.combined==0)?'':model.combined;
  		model.key = key;
  		return model.key;
  	},

  	emptyKey(){
  		model.key = '';
  	},

  	setOperator(myOperator){
		model.operator = myOperator;
		return model.operator;
  	},

  	emptyOperator(){
  		model.operator = '';
  	},

  	//to fix abruptly ending strings for evaluation (ending with either / * % - or +)
  	fixString(stringOrNum){
  		let string = stringOrNum.toString();
  		const lastChar = string.slice(-1);
  		let endNum;

  		switch(lastChar) {
		    case '/':
		    case '*':
		        endNum = '1';
		        break;
		    case '%':
		    	string = string.slice(0, -1);
		        endNum = '/100';
		        break;
		    case '-':
		    case '+':
		        endNum = '0';
		        break;
		     default:
		     	endNum = '';
		}

		return string+endNum;
  	},

  	evaluate(string){
      try {
  		model.combined = eval(string);
      }
      catch(err){
      model.combined = 'err';
      }
  		return model.combined;
  	},

  	clear(){
  		model.key = 0;
  		return model.key;
  	},

  	//handling negative integers & decimals
  	neg(stringOrNum){
  		const string = stringOrNum.toString();

  		const patt2 = /[+-/*%]/g;
      let matchInd;
      let result;
        while ((match = patt2.exec(string)) != null) {
        matchInd=match.index;
      }

      if(string.length===matchInd || matchInd===undefined || string.charAt(0)=='-'){
        const firstChar = string.charAt(0);
        model.combined = (firstChar=='-')?string.substr(1):'-'+model.combined;
        return model.combined;
      }
      else {

        const piece1 = string.slice(0, matchInd+1);
        let piece2 = string.slice(matchInd-string.length);

        const evaluate = piece2.charAt(0).match(/[+/%*]/g)?true:false;

        if(evaluate){
          String.prototype.replaceAt=function(index, replacement) {
          return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
          }
          piece2=piece2.replaceAt(0, '-');
        }

        result = `${piece1}(${piece2})`;
        console.log(result);
      } 

  	},

  	combined(){
  		model.combined=model.combined+model.key+model.operator;
  		return model.combined.toString();
  	},

    lastChar(){
      const string = this.combined();
      const lastChar = string.slice(-1);
      return lastChar;
    },

    chopLastOperator(){
      const string = this.combined();
      const choppedString = string.slice(0, -1);
      model.combined=choppedString;
    },

    getCombined(){
      return model.combined;
    },
  };

  const view = {
  	init(){
  		this.output = $('.item');
  		this.key = $('.normal');
  		this.equal = $('.equal');
  		this.clear = $('.clear');
  		this.neg = $('.neg');
      this.operator = $('.operator');
      this.sqrt = $('.sqrt');
      this.plusMinusDot = $('.plusMinusDot');
  		this.backspace = $('.backspace');
  		this.currentOutputVal = $(this.output).html();
  		this.render();
  	},

  	render(){
  		this.setUpEventListeners();
  	},

    finalStep([open='']=[]){
        const myOperator = controller.setOperator(`${open}${this.innerHTML}`);
        const result = controller.combined();
        view.screen(result);
        controller.emptyOperator();
    },

  	setUpEventListeners(){

  		$(this.key).click(function(){
  			const key = this.innerHTML;
  			const result = controller.setKey(key);
	  		const addToCombined = controller.combined(result);
	  		view.screen(addToCombined);
			controller.emptyKey();
		});

		$(this.equal).click(function(){
		  	const fixString = controller.fixString($(view.output).html());
		  	const result = controller.evaluate(fixString);
		  	view.screen(result);
		});

    $(this.sqrt).click(function(){
        const num = controller.combined();
        const result = Math.sqrt(num);
        view.screen(result);
    });

		$(this.clear).click(function(){
		  const result = controller.clear();
		  view.screen(result);
		  newCalc();
		});

		$(this.neg).click(function(){
			const result = controller.combined();
			const negResult = controller.neg(result);
			const finalResult = controller.combined(negResult);
			view.screen(finalResult);
		});

		$(this.operator).click(function(){
      const lastChar = controller.lastChar();

      const patt1 = /[/*%]/g;

      const charCheck = lastChar.match(patt1);
      if(charCheck){
        controller.chopLastOperator();
      }
        view.finalStep.call(this);

		});

    $(this.plusMinusDot).click(function(){
      const newChar = $(this).html();
      const lastChar = controller.lastChar();
      const open=(lastChar===newChar)?'(':'';
      const close=(lastChar===newChar)?')':'';
        view.finalStep.call(this, open);
    });

    $(this.backspace).click(function(){
      controller.chopLastOperator();
      const result=controller.getCombined;
      view.screen(result);
    });

  	},

  	screen(result){
  		$(view.output).html(result);
  	}
  }

  controller.init();
}

newCalc(); //starts a new calculation
 
});