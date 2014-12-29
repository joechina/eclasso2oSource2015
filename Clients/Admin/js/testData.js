QUIZ_TYPE = {};
QUIZ_TYPE.TRUE_FALSE = '1';
QUIZ_TYPE.SINGLE_CHOICE = '2';
QUIZ_TYPE.MULTIPLE_CHOICE = '3';
QUIZ_TYPE.FILL_BLANK = '4';

var testDataStore = {
};

testDataStore.Quiz = function(type, content, score, challenge, key) {
	this.type = type;
	this.content = content;
	this.score = score;
	this.challenge = challenge;
	this.key = key;

	this.remove = function() {
		var quizs = this.problem.quizs;
		var n = quizs.length;
		for (var i = 0; i < n; ++i) {
			if (quizs[i].seq == this.seq) {
				quizs.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	this.moveUp = function() {
		var quizs = this.problem.quizs;
		var n = quizs.length;
		for (var i = 0; i < n; ++i) {
			if (quizs[i].seq == this.seq) {
				if (i > 0) {
					var quiz = quizs[i];
					quizs[i] = quizs[i - 1];
					quizs[i - 1] = quiz;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.moveDown = function() {
		var quizs = this.problem.quizs;
		var n = quizs.length;
		for (var i = 0; i < n; ++i) {
			if (quizs[i].seq == this.seq) {
				if (i < n - 1) {
					var quiz = quizs[i];
					quizs[i] = quizs[i + 1];
					quizs[i + 1] = quiz;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.toJson = function() {
		return {
			type: this.type,
			content: this.content,
			score: this.score,
			challenge: this.challenge,
			key: this.key
		};
	};
};

testDataStore.Problem = function(name, content) {
	this.name = name;
	this.content = content;
	this.quizs = [];

	this.addQuiz = function(quiz) {
		this.quizs.push(quiz);
	};

	this.remove = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				problems.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	this.moveUp = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				if (i > 0) {
					var problem = problems[i];
					problems[i] = problems[i - 1];
					problems[i - 1] = problem;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.moveDown = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				if (i < n - 1) {
					var problem = problems[i];
					problems[i] = problems[i + 1];
					problems[i + 1] = problem;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.toJson = function() {
		var quizs = [];
		for (var i = 0; i < this.quizs.length; ++i) {
			quizs.push(this.quizs[i].toJson());
		}

		return {
			name: this.name,
			content: this.content,
			quizs: quizs
		};
	};
};

testDataStore.Section = function(name) {
	this.name = name;
	this.problems = [];

	this.addProblem = function(problem) {
		this.problems.push(problem);
	};

	this.remove = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				sections.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	this.moveUp = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				if (i > 0) {
					var section = sections[i];
					sections[i] = sections[i - 1];
					sections[i - 1] = section;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.moveDown = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				if (i < n - 1) {
					var section = sections[i];
					sections[i] = sections[i + 1];
					sections[i + 1] = section;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.toJson = function() {
		var problems = [];
		for (var i = 0; i < this.problems.length; ++i) {
			problems.push(this.problems[i].toJson());
		}

		return {
			name: this.name,
			problems: problems
		};
	};
};

testDataStore.Exercise = function(name, clazz, isExam) {
	this.name = name;
	this.clazz = clazz;
	this.isExam = isExam;
	this.sections = [];

	this.addSection = function(section) {
		this.sections.push(section);
	};

	var list = [];
	this.refreshSeq = function() {
		list.length = 0;
		var n = this.sections.length;
		for (var i = 0; i < n; ++i) {
			var sec = this.sections[i];
			sec.seq = i + 1;
			sec.exercise = this;
			list.push(sec);

			var m = sec.problems.length;
			for (var j = 0; j < m; ++j) {
				var prob = sec.problems[j];
				prob.seq = sec.seq + '.' + (j + 1);
				prob.section = sec;
				list.push(prob);

				var p = prob.quizs.length;
				for (var k = 0; k < p; ++k) {
					var quiz = prob.quizs[k];
					quiz.seq = prob.seq + '.' + (k + 1);
					quiz.problem = prob;
					list.push(quiz);
				}
			}
		}

		return list;
	};

	this.asList = function() {
		return list;
	};

	this.toJson = function() {
		var sections = [];
		for (var i = 0; i < this.sections.length; ++i) {
			sections.push(this.sections[i].toJson());
		}

		return {
			name: this.name,
			clazz: this.clazz,
			isExam: this.isExam,
			sections: sections
		};
	};

	this.submit = function(okFunc, errFunc) {
	    console.log(JSON.stringify(this.toJson()));
	    //Save to database
	    var dbExercise = dataContext.create('Exersize');
	    dataContext.attach(dbExercise);
	    dbExercise.Name = this.name;
	    dbExercise.Description = this.clazz;
	    dbExercise.isExam = this.isExam;
	    for (i = 0; i < this.sections.length; i++)
	    {
	        var sec = this.sections[i];
	        var dbSection = dataContext.create('ExersizeSection');
	        dataContext.attach(dbSection);
	        dbSection.Name = sec.name;
	        for (j = 0; j < sec.problems.length; j++)
	        {
	            var pro = sec.problems[j];
	            var dbProblem = dataContext.create('Problem');
	            dataContext.attach(dbProblem);
	            dbProblem.GeneralInfo = pro.name;
	            var dbMedia = dataContext.create('Media');
	            dataContext.attach(dbMedia);
	            dbMedia.Type = 'Text';
	            dbMedia.Content = pro.content;
	            dbProblem.Media = dbMedia;
	            for(q=0; q< pro.quizs.length; q++)
	            {
	                var qz = pro.quizs[q];
	                var dbQuiz = dataContext.create('Quiz');
	                dataContext.attach(dbQuiz);
	                dbQuiz.seq = q;
	                dbQuiz.QuizType = parseInt(qz.type);
	                dbQuiz.Score = qz.score;
	                dbQuiz.Key = JSON.stringify(qz.key);
	                dbQuiz.QuizDetail = qz.content;
	                dbQuiz.Challenge = JSON.stringify(qz.challenge);
	                dbQuiz.Problem = dbProblem;
	                dbProblem.Quizzes.push(dbQuiz);
	            }
	            dbProblem.Section = dbSection;
	            dbSection.Problems.push(dbProblem);
	        }
	        dbSection.Exercise = dbExercise;
	        dbExercise.Sections.push(dbSection);
	    }

	    dataContext.save(dbExercise)
	    .then(okFunc).fail(function(err) {
			errFunc(err);
	    })
	};
};

testDataStore.getExercise = function(name, okFunc, errFunc) {
	dataContext.getExercise(name).then(function (result) {
		var exercise = result.results[0];
		var sections = exercise.Sections;
		exercise = new testDataStore.Exercise(exercise.Name, exercise.Description, exercise.IsExam);
		exercise.id = exercise.Id;
		for (var i = 0; i < sections.length; ++i) {
			var sec = sections[i];
			var problems = sec.Problems;
			sec = new testDataStore.Section(sec.Name);
			exercise.addSection(sec);
			for (var j = 0; j < problems.length; ++j) {
				var prob = problems[j];
				var quizzes = prob.Quizzes;
				prob = new testDataStore.Problem(prob.GeneralInfo, prob.Media.Content);
				sec.addProblem(prob);
				for (var k = 0; k < quizzes.length; ++k) {
					var quiz = quizzes[k];
					var challenge = [];
					try{
						challenge = JSON.parse(quiz.Challenge)
					} catch(ex) {
						console.log(quiz.Challenge, ex);
					}
					var key = [];
					try{
						key = JSON.parse(quiz.Key)
					} catch(ex) {
						console.log(quiz.Key, ex);
					}
					quiz = new testDataStore.Quiz(
						quiz.QuizType,
						quiz.QuizDetail,
						quiz.Score,
						challenge,
						key
					);
					prob.addQuiz(quiz);
				}
			}
		}
		exercise.refreshSeq();
		console.log(result, JSON.stringify(exercise.toJson()));
		okFunc(exercise);
	}).fail(function(err) {
		errFunc(err);
	});
};