var budgetController = (function (){
//protoype for incomes


var Income=function(id,description,value){
	this.id=id;
	this.description=description;
	this.value=value;
};
//protype for expenses
var Expense=function(id,description,value){
	this.id=id;
	this.description=description;
	this.value=value;
};

//Calculates the sum of incomes and expenses and stores it
function calculateBudget(type){
	var sum=0;
	//if prevents from sum being empty in case of empty array
	if (dataStruc.allitems[type]!==[])
	{
	dataStruc.allitems[type].forEach(function(cur){
		sum+=cur.value;})
	}
	dataStruc.totals[type]=sum;
	
}
//datastructure for all objects 
var dataStruc={
	allitems:{
		inc:[],
		exp:[]
	},
	totals:{
		inc:0,
		exp:0
	},
	budget:0
};
return{
	//makes income and expense objects and stores in data strucuture array
	appendbudget:function(type,description,value){
		var newItem,ID;
		
		if(dataStruc.allitems[type].length>0){
		
		ID=(dataStruc.allitems[type][dataStruc.allitems[type].length-1].id)+1;
		} else{
			ID=0;
		};
		if(type==='inc'){
			newItem= new Income(ID,description,value);
			
		}if(type==='exp'){
			newItem= new Expense(ID,description,value);
		}
		dataStruc.allitems[type].push(newItem);
		return newItem;

	},
	//calculates the budget and calls calculate budget which is private frunction
	budgetCalculator:function(){
		calculateBudget('inc');
		calculateBudget('exp');

		dataStruc.budget=dataStruc.totals['inc']-dataStruc.totals['exp'];

	},
	//returns the calculated budgets and inc-exp to master control
	budgetreturner:function(){
		return{
		budget:dataStruc.budget,
		incomes:dataStruc.totals['inc'],
		expenses:dataStruc.totals['exp']
	};
	},

	deleteBudgetItem:function(type,id){
		var idArray,index;
		idArray=dataStruc.allitems[type].map(function(current){
			return current.id;
		});
			index=idArray.indexOf(id);
			if(index!==-1){
			dataStruc.allitems[type].splice(index,1);

			}
	}
};

})();


var  UIController = (function(){
	return{
		//returns inputs from user to mastercontrol
		getInputs:function() {
		return{
			type: document.querySelector('.choices').value,
			description: document.querySelector('.add-description').value,
			value:parseFloat(document.querySelector('.add-value').value)
		};
		},
		//adds items to list
		projectItem:function(obj,type)
		{
			var html,newhtml,element;
			if (type==='inc')
			{
			element='.desc-income-title';
			html='<div class="income-wrapper" id="inc-%id%"><div class="item-description">%description%</div><div><span class="item-income">%value%</span><span><button>&#10005;</button></span></div></div>';
			}
			else if(type==='exp'){
			html='<div class="expense-wrapper" id="exp-%id%"><div class="item-description">%description%</div><div><span class="item-income">%value%</span><span><button>&#10005;</button></span></div></div>';
			element='.desc-expense-title';
			}

			newhtml=html.replace('%description%',obj.description.toUpperCase());
			newhtml=newhtml.replace('%value%',obj.value);
			newhtml=newhtml.replace('%id%',obj.id);
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
		},
		//deletes inputs from user after event
		clearItems:function(){
			document.querySelector('.add-description').value="";
			document.querySelector('.add-value').value="";
			document.querySelector('.add-description').focus();

		},
		//displays incomes,expense and availaible budget  
		displayBudget:function(budget){
			document.querySelector('.budget-value').textContent=budget.budget;
			document.querySelector('.income-value').textContent=budget.incomes;
			document.querySelector('.expense-value').textContent=budget.expenses;


		},


		//removes the deleted item from UI
		deleteUiItem:function(id){
			var el=document.getElementById(id)
			el.parentNode.removeChild(el);
		}

	};

	
})();


var masterControl = (function (bdgctrl,uictrl){

	var addItem = function()
	{
		var input,newItem,budget;
		//stores inputs from uictrl
		input = uictrl.getInputs();
		//if prevents false entries from user
		if(input.description!=="" && input.value!=NaN)
		{
			//passes stored inputs to make item objects in bgtctrl and stores the newitem made
			newItem =bdgctrl.appendbudget(input.type,input.description,input.value);
			//display list
			uictrl.projectItem(newItem,input.type);
			//clear fields
			uictrl.clearItems();
			//activates the budget part
			addBudget();

		}
	}
	

	var addBudget=function(){

			//calculates the sums of inc and exp
			bdgctrl.budgetCalculator();
			//stores calculated sums
			budget=bdgctrl.budgetreturner();
			//displays the calculated sum on ui
			uictrl.displayBudget(budget);
		}

	var deleteItem=function(event){
		var arr,type,itemID,ID;
			itemID=(event.target.parentNode.parentNode.parentNode.id);
			if(itemID){
			arr=itemID.split('-');
			type=arr[0];
			ID=parseInt(arr[1]);
		//removes the item at given id
		bdgctrl.deleteBudgetItem(type,ID);
		//removes the item from ui
		uictrl.deleteUiItem(itemID);
		//updates the new budget
		addBudget();



	}}

	
	//Event Listeners i.e init part of the app

/** 1 **/	document.querySelector('.add-bttn').addEventListener('click',addItem)

/** 2 **/	document.addEventListener('keypress',function(event){
					if(event.keycode===13||event.which===13){
					addItem();
					}
				})
	
	//Event handler for whole bottom part (Event delegation)
/** 3 **/	document.querySelector('.bottom').addEventListener('click',deleteItem)

})(budgetController,UIController);