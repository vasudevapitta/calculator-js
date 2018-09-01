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
  		model.combined = eval(string);
  		return model.combined;
  	},

  	clear(){
  		model.key = 0;
  		return model.key;
  	},

  	//handling negative integers & decimals
  	neg(stringOrNum){
  		const string = stringOrNum.toString();
  		const firstChar = string.charAt(0);
  		const result = (firstChar=='-')?model.combined=string.substr(1):model.combined='-'+model.combined;
  		return result;
  	},

  	combined(){
  		model.combined=model.combined+model.key+model.operator;
  		return model.combined;
  	}

  };

  const view = {
  	init(){
  		this.output = $('.item');
  		this.key = $('.normal');
  		this.equal = $('.equal');
  		this.clear = $('.clear');
  		this.neg = $('.neg');
  		this.operator = $('.operator');
  		this.currentOutputVal = $(this.output).html();
  		this.render();
  	},

  	render(){
  		this.setUpEventListeners();
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
			const myOperator = controller.setOperator(this.innerHTML);
			const result = controller.combined();
			view.screen(result);
			controller.emptyOperator();
		})

  	},

  	screen(result){
  		$(view.output).html(result);
  	}
  }

  controller.init();
}

newCalc(); //starts a new calculation
 
});