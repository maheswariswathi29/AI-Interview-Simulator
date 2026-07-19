let recognition = null;

let currentQuestion = 0;

let score = 0;


const questions = [

    "Tell me about yourself",

    "What are your strengths?",

    "Why should we hire you?"

];




// PAGE LOAD

window.onload = function(){

    if(document.getElementById("questionBox")){

        loadQuestion();

    }

};





// LOAD QUESTION

function loadQuestion(){


    let questionBox =
    document.getElementById("questionBox");


    if(!questionBox)
        return;



    questionBox.innerText =
    "Q" + (currentQuestion+1) +
    ": " +
    questions[currentQuestion];



    document.getElementById("userInput").value="";



    let aiResponse =
    document.getElementById("aiResponse");


    if(aiResponse){

        aiResponse.innerText="";

    }



    let status =
    document.getElementById("status");


    if(status){

        status.innerText="Ready";

    }


}






// START VOICE


function startVoice(){


const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;



if(!SpeechRecognition){

alert(
"Your browser does not support voice recognition"
);

return;

}



recognition = new SpeechRecognition();



recognition.lang="en-US";


recognition.continuous=false;


recognition.interimResults=true;



let voiceStatus =
document.getElementById("voiceStatus");


if(voiceStatus){

voiceStatus.innerHTML=
"🎤 Listening...";

}




recognition.onstart=function(){

console.log("Voice started");

};






recognition.onresult=function(event){


let transcript="";



for(
let i=event.resultIndex;
i<event.results.length;
i++
){

transcript +=
event.results[i][0].transcript;


}



document.getElementById("userInput").value =
transcript;


};






recognition.onerror=function(event){


console.log(
"Voice Error:",
event.error
);



if(voiceStatus){

voiceStatus.innerHTML=
"❌ "+event.error;

}


};







recognition.onend=function(){


if(voiceStatus){

voiceStatus.innerHTML=
"✅ Voice stopped";

}


};





recognition.start();



}







// STOP VOICE


function stopVoice(){


if(recognition){


recognition.stop();


}


}









// SEND ANSWER


function sendAnswer(){



let inputBox =
document.getElementById("userInput");



let answer =
inputBox.value.trim();




if(answer===""){


alert(
"Please speak or type your answer"
);


return;


}






fetch("/process_answer",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


question:
questions[currentQuestion],


answer:answer


})


})



.then(res=>res.json())



.then(data=>{



document.getElementById("aiResponse").innerHTML =

"🤖 AI Feedback:<br>"+

data.reply;






let feedback =
data.reply.toLowerCase();





if(
feedback.includes("good") ||
feedback.includes("excellent") ||
feedback.includes("strong")
){


score +=10;


}





currentQuestion++;






if(currentQuestion < questions.length){



setTimeout(()=>{


loadQuestion();



},2000);



}

else{



setTimeout(()=>{


showFinalResult();



},2000);



}



})



.catch(error=>{


console.log(error);


alert(
"Server connection failed"
);


});



}









// FINAL RESULT


function showFinalResult(){



document.getElementById("questionBox").innerHTML=

"🎉 Interview Completed";




document.getElementById("finalResult").innerHTML=


"Final Score : "+

score+

" / "+

(questions.length*10);




document.getElementById("aiResponse").innerHTML=

"Thank you for attending AI Interview";


}









// TEST MICROPHONE


function testMic(){



navigator.mediaDevices
.getUserMedia({

audio:true

})


.then(stream=>{


alert(
"✅ Microphone working"
);



stream.getTracks()
.forEach(track=>track.stop());


})



.catch(err=>{


alert(
"❌ Microphone error : "+
err.message
);


});


}
