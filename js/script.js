window.addEventListener('load',function(){
	/* MAIN VARIABLES*/
	const mainContent        = document.querySelector('.letter-generator__content');
	const mainField          = mainContent.querySelector('.letter-generator__inp');
	const resultBox          = mainContent.querySelector('.letter-generator__result-text');
	/* SETTINGS VARIABLES*/
	const langSelectBtn      = mainContent.querySelector('.letter-generator__select');
	const animCheckBoxBtn    = mainContent.querySelector('#checkbox-rect1');
	const animCheckBoxBlock  = mainContent.querySelector('.letter-generator__item.animate');
	const whichLibIsSelected = mainContent.querySelector('.letter-generator__library');
	const additionalSettBlok = mainContent.querySelector('.settings-blok');
	/* MANAGE VARIABLES */
	const subBtnGenerate     = mainContent.querySelector('.letter-generator__btn-gener');
	const copyTheResBtn      = mainContent.querySelector('.letter-generator__btn-copy');
	const settingsBtn        = mainContent.querySelector('.settings-img');

	/* INITIAL SETTINGS OF GENERATOR */
	let spacesBetweenWords = '       '; //defaul = 7 spaces
	/* CODE TO CHECK THE CHANGE OF THE WORD LIBRARY */
	whichLibIsSelected.addEventListener('input', function(){
		if(this.value == 'neri_alum'){
			langSelectBtn.classList.remove('btn-disabled');
			animCheckBoxBlock.classList.remove('btn-disabled');
		}else{
			langSelectBtn.classList.add('btn-disabled');
			animCheckBoxBlock.classList.add('btn-disabled');

			langSelectBtn.value = 'eng';
			animCheckBoxBtn.checked = false;
		}
	});

	/* ========== SENTENCE GENERATION IN CODE ========== */
	subBtnGenerate.addEventListener('click',function(){
		let resCode; //Variable Responsible For The Value Of The Final Result

		//Data Combinations and Their Processing
		let inpValue = mainField.value.toLowerCase();
		let inpValueInArr = Array.from(inpValue); // Now The Entered Words Are Split Into Letters Of The Array

		if(inpValue.length > 0){ //Is The Field Not Empty
			//Implementation Of The Generator Itself
			let resArr = []; //ResultArray

			//Checks For The Specified Settings
			if(whichLibIsSelected.value == 'org'){ //is Origin/DC or-> Neri_Alum
				resArr += transformInCode(inpValueInArr,engSymbolsIDs);
			}else{
				if(langSelectBtn.value == 'eng'){
					if(animCheckBoxBtn.checked == true){
						resArr += transformInCode(inpValueInArr,engSymbolsIDs,['','','Animated_']);
					}else{
						resArr += transformInCode(inpValueInArr,engSymbolsIDs,['eng_','_double']);	
					}
				}else{
					if(animCheckBoxBtn.checked == true){
						resArr += transformInCode(inpValueInArr,cyrSymbolsIDs,['','','Сyrillic_Animated_']);
					}else{
						resArr += transformInCode(inpValueInArr,cyrSymbolsIDs,['cyrillic_']);
					}
				}
			}

			//Writing The Text Result In An <div>-Element
			resultBox.innerHTML = resArr;
			//Check For Unlocking The Copy Button
			if(resultBox.innerHTML.length > 0){
				copyTheResBtn.classList.remove('btn-disabled');
			}else{
				copyTheResBtn.classList.add('btn-disabled');
			}

			//Copying The Result To The Clipboard
			copyTheResBtn.addEventListener('click',function(){
				navigator.clipboard.writeText(resArr);
			});
		}
	});

	//Settings Block Show Animation.
	let animDuration = 110;
	settingsBtn.addEventListener('click',function(){
		if(additionalSettBlok.classList.contains('showed')){
			let boxHeight = additionalSettBlok.clientHeight;
			let anim = additionalSettBlok.animate(
				[{ height:`${boxHeight}px`,marginTop:'10px' },
				{ height:0,marginTop:0 }],
				{ duration: animDuration });

			anim.addEventListener('finish',function(){
				additionalSettBlok.classList.remove('showed');
			});
		}else{
			additionalSettBlok.classList.add('showed');
			let boxHeight = additionalSettBlok.clientHeight;
			additionalSettBlok.animate(
				[{ height:0,marginTop:0 },
				{ height:`${boxHeight}px`,marginTop:'10px' }],
				{ duration: animDuration });
		}
	});

	/* Since in Discord we can't use cyrillic and some characters in emoji names,
	** we have to make something like an object, where its Key will be the standard
	** character that is written in the input field, and its property will be 
	** some kind of conditional ID that describes the character Latin alphabet, 
	** and then this ID is used in the name of the emoji. */
	let numberIDs = {
		'0':"zero",        '1':"one", '2':"two",  '3':"three",  '4':"four",
		'5':"five",        '6':"six", '7':"seven", '8':"eight", '9':"nine",
		'10':"keycap_ten",
	}
	let justSymbolsIDs = {
		'?':"question", '!':"exclamation", '#':"hashtag"
	}
	let cyrSymbolsIDs = {
		'а':"a",  'б':"b",  'в':"v",  'г':"g",  'ґ':"gg",   'д':"d",    'е':"e", 'ё':"yo",
		'ж':"zh", 'з':"z",  'и':"yy", 'і':"i",  'й':"y",    'к':"k",    'л':"l", 'м':"m",
		'н':"n",  'о':"o",  'п':"p",  'р':"r",  'с':"s",    'т':"t",    'у':"u", 'ф':"f",
		'х':"h",  'ц':"c",  'ч':"ch", 'ш':"sh", 'щ':"shch", 'ъ':"tv_z", 'ы':"yyy",
		'ї':"yi", 'э':"ee", 'є':"ye", 'ю':"yu", 'я':"ya",   'ь':"mk_z", 'ў':"uwy"
	}
	let engSymbolsIDs = {
		'a':"a", 'b':"b", 'c':"c", 'd':"d", 'e':"e", 'f':"f", 'g':"g", 'h':"h",
		'i':"i", 'j':"j", 'k':"k", 'l':"l", 'm':"m", 'n':"n", 'o':"o", 'p':"p", 'q':"q",
		'r':"r", 's':"s", 't':"t", 'u':"u", 'v':"v", 'w':"w", 'x':"x", 'y':"y", 'z':"z"
	}


	/*A FUNCTION THAT CONVERTS THE ENTERED LETTERS INTO THEIR CODE*/
	function transformInCode( word,symbolsLibArray,resLine=[] ){
		let _resArr = []; //ResultArray { _PROTECTED } (yeah,yeah 'protected' without oop)

		//parameters { __PRIVATE }
		let __libArr   = symbolsLibArray;                     //Library Of Symbols IDs
		let __startL   = resLine[0] || '';                    //startOfTheLine
		let __endL     = resLine[1] || '';                    //endOfTheLine
		let __middleL  = resLine[2] || 'regional_indicator_'; //middleOfTheLine

		//We Go Through The Array Of Entered Letters
		word.forEach(function(userLetter){
			let isLetter = false;//This Variable Is Responsible For Whether The Letter Was Found

			//Now On Each Iteration Through The Array Of Letters, We Will Go Through The Array Of The Alphabet
			for(let libKey in symbolsLibArray){
				if(libKey == userLetter){ //To Check The Letter We Entered Against The Letter Of The Array
					isLetter = true;//The Required Letter Was Found!

					if(animCheckBoxBtn.checked == true){
						_resArr += `:${__startL}${__middleL}${__libArr[libKey].toUpperCase()}${__endL}: `;
					}else{
						_resArr += `:${__startL}${__middleL}${__libArr[libKey]}${__endL}: `;
						//expecting smth like :eng_regional_indicator_z_double:
					}
				}
			}
			/*~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=*/

			//Check To See If It Is a Character (!;#;?, num or space)
			if(!isLetter){//Only If The Letter Is Not Found

				//Checking Whether The Entered Character Is A Space
				if(userLetter == ' '){
					_resArr += spacesBetweenWords;
				}
				/*=---=---=---=---=---=---=---=---=*/

				//Checking Whether The Entered Character Is A Number
				let isNumber = false;
				for(key in numberIDs){
					if(key == userLetter){
						isNumber = true; //This Symbol Is A Number!
						_resArr += `:${numberIDs[key]}: `;
					}
				}
				/*=---=---=---=---=---=---=---=---=*/

				//Checking Whether The Entered Character Is Just a Simple Character (!;#;?)
				if(!isNumber){ //Enter the loop only if it is not a number
					for(key in justSymbolsIDs){
						if(key == userLetter){
							_resArr += `:regional_indicator_${justSymbolsIDs[key]}: `;
						}
					}
				}
			}
			/*~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=*/
		});

		return _resArr;
	}
});