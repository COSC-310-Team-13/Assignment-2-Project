## Import the libraries
import json;

## Load the data
responses = 0
questions = 0
score = 0;			## initially ever user starts with a mental score of zero.
## at the end a higher score means, a user most likely has depression.
total_questions = 3	## How many questions from the json file, we want to ask.

## These 2 files below have the questions stored as a dictionary.
with open('./responses.json',encoding='utf-8') as json_file:
	responses = json.load(json_file)
with open('./questions.json',encoding='utf-8') as json_file:
	questions = json.load(json_file)


"""This function below is our main , function which makes use of the other helper functions to keep the app running. 
It does the following tasks first :
1. Collect user info 
2. Take the user through a questionare to see if he can possibly have depression.
"""
def returnResp():
	recordPatientInfo()
	print("What can i help you with");
	inputresp = input()
	if checkInput(inputresp):
			proccessInput(inputresp);
			while ('yes' in input()):
    				newQuestion();
	else:
		print("I am not sure I understand your issue, please try rephrasing it in a different way\n");
		return helper();
	return

# Function to proccess user input
def proccessInput(inputresp):
	for x in responses:
		if x in inputresp: ## if response key  in string 
			resp =  responses[x];
			if (x == "suffering" or x == "depression"):
				print(resp); score = recordMentalHist();
				print("Do you have any other question regarding your diagnostics ?(yes/no)")
				resp = input()
				if("no" in resp):
    					return f"Your Mental Score is {score}."
				else:
					try:
						answerRestQuestions();
					except KeyError:
						print("Unfortunately i do not have the response for that. Anything Else ?")
						answerRestQuestions();
					finally:
							print(f"Your Mental Score is {score}.")
			else:
				print(resp);
				return
	return

# Check if user input has answer
def checkInput(input):
		found = False;
		for x in responses:
			if x in input: ## if response key  in string 
				found = True;
		return found

def newQuestion():
		print("What can i help you with");
		inputresp = input()
		if checkInput(inputresp):
			proccessInput(inputresp);
		else:
			print("I am not sure I understand your issue, please try rephrasing it in a different way\n");
			return helper();
		return

# Provide help message when user input has no response
def helper():
	inputresp = input();
	if checkInput(inputresp):
		proccessInput(inputresp);
		while ('yes' in input()):
    				newQuestion();
	else:
		print("I still canno't understand, try using keywords like symptoms, medication, treatment, etc");
		inputresp = input()
	if checkInput(inputresp):	
		proccessInput(inputresp);
		while ('yes' in input()):
    				newQuestion();
	else:
		print("I'm sorry, I am not able to help you with that");
		return

def recordPatientInfo():
	## This method records the patient information, and can be further modified to collect any other information that we may be interested in collecting in the future.
	print("Welcome to a virtual psychatrist.\nWhat is your name ?");
	name = input()
	print(f"Welcome {name}, what is your age ?");
	age = input()
	
	info = [name, age]

	return info
	
def recordMentalHist():
	## ask all the questions from the questions.json, file.
	print("Ok, for these questions reply with a score from 1-4 (1 meaning a little of the time, 2 meaning some of the time, 3 meaning good part of the time, and 4 meaning most of the time) Do you understand the scoring?")
	resp = input()
	if("no" in resp):
		return
	print("Let me ask you a few questions, to asses your condition.");
	score = 0;
	for i in range(1,(total_questions+1)): ## this is where the variables control how many questions are asked.
		ques = str(i);
		print(questions[ques])
		score+= int(input())
	if(score < 25):
		print("You do not have any mental disorder.")
	elif(score < 50):
		print("You have mild depression")
	elif(score<100):
		print("You have a serious case of depression please see a doctor")
	
	return score;

def answerRestQuestions():
	"""
	A recursion method that will try to answer any questions the user might have regarding his/her diagnostics.

	The method will stop when the user enters no.

	Here the base call is user entering 'No'
	"""
	print("What do you want to know regarding your diagnostics.")
	resp = input()
	hasResp = False
	for x in responses:
		if x in resp:
			print(questions[x])
			hasResp = True

	if(not hasResp):
		print("Unfortunately i do not have the response for that.")

	print("Do you have any other questions ?")
	resp = input()
	if("no" in resp):
		return
	else:
		answerRestQuestions();