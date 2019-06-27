/**
 * Async function to create or update a option choice answer .
 * @param optionsAnswer //Contains answer field and option choice answer field
 */
const storeChoices = async function (optionsAnswer) {
  //Variable which is used to store the created answers in database
  let optionChoiceAnswers = [];
  if (optionsAnswer) {
    for (let i = 0; i < optionsAnswer.length; i++) {
      if (optionsAnswer[i]) {
        //Check if answer table have row with given reportId and questionId.
        //If exists,It is return an array containing the object that was found and false 
        //If not,Create the object and return an array containing the object that was created and true
        if (optionsAnswer[i].Id !== undefined && optionsAnswer[i].Id !== null && optionsAnswer[i].mode) {
          if (optionsAnswer[i].mode === 'D') {
            [err, updatedAnswer] = await to(Answers.destroy({
              where: {
                Id: optionsAnswer.answerId
              }
            }));
            if (err) return TE(err.message);
            answers.push(updatedAnswer);
          } else if (body.answers[i].mode === 'U') {
            [err, updatedChoiceAnswer] = await to(OptionChoiceAnswers.update({
              optionChoiceId: optionsAnswer[i].optionChoiceId
            }, {
                where: {
                  answerId: body.answers[i].Id
                }
              }));
            if (err) return TE(err.message);
            answers.push(updatedAnswer);
          }
        } else {
          [err, answer] = await to(Answers.findOrCreate({
            where: {
              reportId: optionsAnswer[i].reportId,
              questionId: optionsAnswer[i].questionId,
              elementArray: {
                [Sequelize.Op.eq]: optionsAnswer[i].elementArray
              }
            },
            defaults: optionsAnswer[i]
          }));
          if (err) TE(err.message);

          if (answer[0] && answer[1]) {
            const data = {
              answerId: answer[0].Id,
              optionChoiceId: optionsAnswer[i].optionChoiceId
            };
            //If answer is created,then we create optionChoiceanswers 
            [err, choiceAnswer] = await to(OptionChoiceAnswers.create(data));
            if (err) TE(err.message);

            if (choiceAnswer) {
              optionChoiceAnswers.push({ answer: answer[0], choiceAnswer: choiceAnswer });
            }
          } else if (answer[0]) {

            const data = {
              answerId: answer[0].Id,
              optionChoiceId: optionsAnswer[i].optionChoiceId
            };
            //If answer is found,then we check the optionChoiceanswer is exist or not
            [err, choiceAnswer] = await to(OptionChoiceAnswers.findOrCreate({
              where: { answerId: answer[0].Id },
              defaults: data
            }));
            if (err) TE(err.message);

            if (choiceAnswer[0] && choiceAnswer[1]) {
              //If optionChoiceanswer is created, then store these details into optionChoiceAnswers
              optionChoiceAnswers.push({ answer: answer[0], choiceAnswer: choiceAnswer[0] });
            } else {
              //If optionChoiceanswer is found, then update these details with given optionChoiceId
              [err, updatedChoiceAnswer] = await to(OptionChoiceAnswers.update({
                optionChoiceId: optionsAnswer[i].optionChoiceId
              }, {
                  where: { answerId: answer[0].Id }
                }));
              if (err) TE(err.message);
              optionChoiceAnswers.push({ answer: answer[0], choiceAnswer: updatedChoiceAnswer });
            }
          }
        }
      }
    }
    return optionChoiceAnswers;
  }

}
module.exports.storeChoices = storeChoices;

const storeDynamicFieldAnswers = async function (answers) {
  let updatedAnswers = [];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    if (answer.mode === 'D' && answer.Id !== undefined && answer.Id !== null) {
      [err, updatedAnswer] = await to(Answers.destroy({
        where: {
          Id: answer.Id
        }
      }));
      if (err) return TE(err.message);
      updatedAnswers.push(updatedAnswer);
    } else if (answer.mode === 'U' && answer.Id !== undefined && answer.Id !== null) {
      answer.elementArray = answer.changedElementArray;
      [err, updatedAnswer] = await to(Answers.update(answer, {
        where: {
          Id: answer.Id
        }
      }));
      if (err) return TE(err.message);
      updatedAnswers.push(updatedAnswer);
    } else if (answer.Id === undefined || answer.Id === null) {
      answer.elementArray = answer.changedElementArray;
      [err, updatedAnswer] = await to(Answers.create(answer));
      if (err) return TE(err.message);
      updatedAnswers.push(updatedAnswer);
    }
  }

  return updatedAnswers;
};
module.exports.storeDynamicFieldAnswers = storeDynamicFieldAnswers;

