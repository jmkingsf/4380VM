import sys
import re

sentenceDictionary = []
query = dict()
newRules = list()
unifiedPreviously = []

def negateWord(aWord):
	if "~" in aWord:
		return aWord[1::]
	return "~" + aWord

def parsefile():
	with open(sys.argv[1]) as f:
		for line in f:
			sentences =[word for word in line.split("|")]
			if isQuery(sentences[0]):
				query["query"] = sentences[0].replace("?", "").replace("\n", "")
			else:
				newSentence = []
				for item in sentences:
					item = item.replace(".", "").replace("\n", "").strip()
					if not item.isspace() and item:
						newSentence.append(item)
				if len(newSentence) > 0:
					sentenceDictionary.append(newSentence)
		sentenceDictionary.append([negateWord(query["query"]),])

def isVariable(word):
	if not isinstance(word, (list,)) and "(" not in word and not word[0].isupper():
		return True
	return False

def isCompound(word):
	if not isinstance(word, (list,)) and "(" in word:
		return True
	return False

def isConst(word):
	if not isinstance(word, (list,)) and word[0].isupper() and not "(" in word:
		return True
	return False

def isList(value):
	if isinstance(value, (list,)):
		return True
	return False

def isQuery(word):
	if not isinstance(word, (list,)) and "?" in word:
		return True
	return False

def getOp(currentComp):
	op = currentComp.split("(")[0]
	return op

def getNegOp(currentComp):
	op = currentComp.split("(")[0]
	if op[0] == "~":
		return op[1::]
	return "~" + op

def createNewSentence(unification, nextSent, nextSent2, nextItem, nextItem2):
	firstSent = nextSent[::]
	secondSent = nextSent2[::]
	firstSent.remove(nextItem)
	secondSent.remove(nextItem2)
	newUnifiedSentences = []
	if len(firstSent) > 0:
		newUnifiedSentences.append(firstSent)
	if len(secondSent) > 0:
		newUnifiedSentences.append(secondSent)
	if unification != dict():
		for key, val in unification.items():
			if len(firstSent) > 0:
				newFirstSent = []
				for word in firstSent:
					if key in word:
						word = word.split(key)
						word = val.join(word)
						newFirstSent.append(word)
				newUnifiedSentences.append(newFirstSent)
			if len(secondSent) > 0:
				newSecondSent = []
				for word in secondSent:
					if key in word:
						word = word.split(key)
						word = val.join(word)
						newSecondSent.append(word)
				newUnifiedSentences.append(newSecondSent)
	return newUnifiedSentences

def GetArgs(compound):
	index1 = compound.index("(")
	index2 = compound.rfind(")")
	insidePredicate = compound[index1 + 1: index2]
	argsList = [x.strip() for x in insidePredicate.split(",")]
	#print("FoundArgs: ", argsList)
	if len(argsList) == 1:
		return argsList[0]
	return argsList

def GetPredicate(compound):
	compound = compound.split("(")
	if "~" in compound[0]:
		return compound[0][1::]
	return compound[0]

def varExistsInX(var, x):
	if isCompound(var) and isCompound(x):
		if x in getArgs(var):
			return True
	return False

def UnifyVar(var, x, dictionary):
	if var in dictionary:
		return Unify(dictionary[var], x, dictionary)
	elif x in dictionary:
		return Unify(var, dictionary[x], dictionary)
	elif varExistsInX(var, x):
		return "Failure"
	else:
		dictionary[var] = x
		return dictionary

def Unify(x, y, dictionary):
	if dictionary == "Failure":
		return dictionary
	elif x == y:
		return dictionary
	elif isVariable(x):
		return UnifyVar(x, y, dictionary)
	elif isVariable(y):
		return UnifyVar(y, x, dictionary)
	elif isCompound(x) and isCompound(y):
		return Unify(GetArgs(x), GetArgs(y), Unify(GetPredicate(x), GetPredicate(y), dictionary))
	elif isList(x) and isList(y):
		return Unify(x[1::], y[1::], Unify(x[0], y[0], dictionary))
	else:
		return "Failure"

def resolutionRecursive(_origDictionary, parentPath, theta):
	origDictionary = _origDictionary[::]
	print("----------------New state-----------------\nCurrentDictionary")
	for thing in origDictionary:
		print(thing)

	print("\nTHETA:", theta)
	#everything's unified
	if origDictionary == list():
		return True
	#go through unification, if value unified, update dictionary, call recursively
	#if no values can be unified, then it is false
	else:
		for sent in origDictionary:
			for item in sent:
				for sent2 in origDictionary:
					if sent == sent2:
						continue
					for item2 in sent2:
						if getOp(item) == getNegOp(item2):
							print("\nEvaluating:", item, item2)
							afterUnify = Unify(item, item2, theta)
							print("Unified To:", afterUnify)
							if afterUnify != "Failure":
								sent.remove(item)
								sent2.remove(item2)
								
								for key, val in afterUnify.items():
									wordsToAdd = []
									for word in sent:
										if key in word:
											newWord = word.split(key)
											newWord = val.join(newWord)
											wordsToAdd.append(newWord)
										else:
											wordsToAdd.append(word)
									origDictionary.append(wordsToAdd)
									if sent:
										origDictionary.remove(sent)

									wordsToAdd = []
									for word in sent2:
										if key in word:
											newWord = word.split(key)
											newWord = val.join(newWord)
											wordsToAdd.append(newWord)
										else:
											wordsToAdd.append(word)
									origDictionary.append(wordsToAdd)
									if sent2:
										origDictionary.remove(sent2)

								newDictionary = [x for x in origDictionary if x]
								parentPath.append([item, item2])
								if resolutionRecursive(newDictionary, parentPath, dict()) == False:
									origDictionary = _origDictionary[::]
									continue;
								return resolutionRecursive(newDictionary, parentPath, dict())
		return False
								
def main():
	parsefile()
	print("Query:\n", query.values())
	for thing in sentenceDictionary:
		print(thing)
	print("First Dictionary^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")

	Path = []
	Theta = dict()
	print(resolutionRecursive(sentenceDictionary, Path, Theta))

if __name__ == "__main__":
	if len(sys.argv) != 2:
			error = "No file specified. BASH: python resolutions.py filename.txt"
			raise ValueError(error)
	main()