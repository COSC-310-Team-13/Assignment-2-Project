console.log('loading render file.');
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log("page Refereshed @ " + time);
const questions = require('./json_files/questions.json'); // we basically loaded in our questions as a dictionary.
const responses =  require('./json_files/responses.json'); 
const main_message = "Welcome to psych chatbot";
let chat_history = "";
let score = 0;

let name = "";






window.onload = function () {

	function loadFirstQuestion() {
		print("Hello There, may i ask what your name is.");
		name = await input();
		
	}
	loadFirstQuestion();

	document.getElementById('accept_response').innerHTML = main_message;

	var submit_button = document.getElementById('accept_response');
	
	var start_button = document.getElementById('start_button');

	start_button.onclick = function () {
		recordPatientInfo();
		returnResp();
	}

	submit_button.onclick = function () {
		// run this function, on click , and the input is recorded as resp.
		try {
			var resp = document.getElementById("user_response");
			var system_response = document.getElementById("system_response");
			system_response.innerHTML = returnResp(resp);
			console.log(main_message);
		} catch (err) {
			document.getElementById("err").innerHTML = (err.line+";"+err);
		}
	}

	print = function (str) {
		// everytime we want to print something , we will just change the output message.
		let output_message = "system_resp : " + str;
		console.log(output_message);
		document.getElementById("system_response").innerHTML = str;
	}
	
	input =  async function () {
		/*
		So there is a problem with this function, i want it to wait until the user has entered an input response. But currently it does not , and ends up return null regardless.
		 */
		
			let userResp = document.getElementById("user_response").value;
			let message = "input response : " + userResp;
			console.log(message);
		document.getElementById("user_response").value = null; // clear out the value in the field.
			let returnans = new Promise((resole) => {
				if (userResp != null || userResp.length() >= 2) {
					resolve('got Input');
					return returnans;
				} else {
					return await input();
				}
			});
			
	}

	returnResp = function () {

		print("What can I help you with");
		let inputresp = input()
		if (checkInput(inputresp)) {
			proccessInput(inputresp);
			while (input().includes("yes")) { // fix this
				newQuestion();
			}
		} else {
			print("I am not sure I understand your issue, please try rephrasing it in a different way\n");
			return helper();
		}
	return
	}
	// Function to proccess user input
	function proccessInput(inputresp) {
		for (var x in responses) {
			if (inputresp.includes(x)) { // if response key in string
				resp = responses[x];
				if (x == "suffering" || x == "depression") {
					print(resp); score = recordMentalHist();
					print("Do you have any other question regarding your diagnostics?(yes/no)")
					resp = input()
					if (resp.includes("no"))
						return ("Your Mental Score is" + score + ".")
					else {
						try {
							answerRestQuestions();
						} catch (err) {
							print("Unfortunately I do not have the response for that. Anything Else?")
							answerRestQuestions();
						}
						finally {
							print("Your Mental Score is" + score + ".")
						}
					}
				}
				else
					print(resp);
			}
		}
		return
	}
	
	function recordPatientInfo() {
		//This method records the patient information, and can be further modified to collect any other information that we may be interested in collecting in the future.
		print("Welcome to a virtual psychatrist.\nWhat is your name ?");
		let name = input(); // wait for user response, rather returning null
		print("Welcome "+name+", what is your age ?");
		let age = input();  // wait for user response, rather returning null
		info = [name, age]
		return info
	}
	// Check if user input has response
	function checkInput(input) {
		let found = false;
		for (var x in responses) {
			if (input.includes(x)) // if response key in string
				found = true;
		}
		return found
	}

	// Lets the user enter a follow up question
	function newQuestion() {
		print("What can I help you with");
		let inputresp = input()
		if (checkInput(inputresp))
			proccessInput(inputresp);
		else {
			print("I am not sure I understand your issue, please try rephrasing it in a different way\n");
			return helper();
		}
		return
	}
	// prints a help message when user input has no response
	function helper() {
		let inputresp = input();
		if (checkInput(inputresp)){
			proccessInput(inputresp);
			while (input().includes("yes")) {
				newQuestion();
			}
		}
		else {
			print("I still cannot understand, try using keywords like symptoms, medication, treatment, etc");
			inputresp = input()
		}
		if (checkInput(inputresp)) {
			proccessInput(inputresp);
			while (input().includes("yes"))
				newQuestion();
		}
		else {
			print("I'm sorry, I am not able to help you with that");
			return
		}
	}


	function recordMentalHist() {
		// ask all the questions from the questions.json, file.
		print("Ok, for these questions reply with a score from 1-4 (1 meaning a little of the time, 2 meaning some of the time, 3 meaning good part of the time, and 4 meaning most of the time) Do you understand the scoring?")
		let resp = input()
		if (resp().includes("no"))
			return
		print("Let me ask you a few questions, to asses your condition.");
		let score = 0;
		for(var ques in dict) {
				print(questions[ques])
				score += int(input())
			}
		if (score < 25)
			print("You do not have any mental disorder.")
		else if(score < 50)
			print("You have mild depression")
		else
			print("You have a serious case of depression please see a doctor")
	
		return score;
	}
	function answerRestQuestions() {
		/*
		A recursion method that will try to answer any questions the user might have regarding his/her diagnostics.
	
		The method will stop when the user enters no.
	
		Here the base call is user entering 'No'
		*/
		print("What do you want to know regarding your diagnostics.")
		let resp = input()
		let hasResp = false
		for (x in responses) {
			if (resp.includes(x)) {
				print(responses[x])
				hasResp = true
			}
		}
		if (!hasResp)
			print("Unfortunately I do not have the response for that.")

		print("Do you have any other questions ?")
		resp = input()
		if (resp.includes("no"))
			return
		else
			answerRestQuestions();
	}
}

