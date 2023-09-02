
window.onload = domReady;

function domReady(){
     
    //getting the messages blocks to show/hide
    var message = document.getElementById("message");

    //hide the message 
    message.style.display = "none";

    //getting form object 
    var formHandle = document.forms.chart_form;
    formHandle.onsubmit = processForm;

    //getting the stored arrays from local storage 
    //added hard coded values so if string is empty when fetched, 
    //it should have these values 
    var anx_list = JSON.parse(localStorage.getItem('anx_list')) || ["0","7","8"];
    var caf_list  = JSON.parse(localStorage.getItem('caf_list')) || ["0","10","9"];
    var med_list = JSON.parse(localStorage.getItem('med_list')) || ["0","5","6"];
    var today = JSON.parse(localStorage.getItem('today')) || ["0", "Tue Apr 18 2023", "Wed Apr 19 2023"];

    //on form submit, the values from form fields are saved in the (above) arrays, and stored back to local storage
    function processForm(){

        //getting todays date (Date will be added on x-axis for each entry made)
        var dateVar = new Date();
        dateVar = dateVar.toDateString();

        //if todays date is not in the list (that means todays entry has not been made)
        if( today[today.length-1] !== dateVar)
            {
            //getting values from form
            var anx_value = document.getElementById("anx_value");
            var caf_value = document.getElementById("caf_value");
            var med_value = document.getElementById("med_value");

            //adding those values to the arrays we fetched from storage
            anx_list.push(anx_value.value);
            caf_list.push(caf_value.value);
            med_list.push(med_value.value);

            //storing arrays with new values back to local storage
            localStorage.setItem('anx_list', JSON.stringify(anx_list));
            localStorage.setItem('caf_list', JSON.stringify(caf_list));
            localStorage.setItem('med_list', JSON.stringify(med_list));

            //storing todays date to local storage
            today.push(dateVar);
            localStorage.setItem('today', JSON.stringify(today));

            linechart.update();
            return false;
            }

        else{
            //if todays entry has been made, the message shows
            message.style.display="block";
            return false;
        }
    }




    //creating a chart and adding all arrays from local storage to the chart

    var chart = document.getElementById("myChart");
    let linechart = new Chart(chart, {
        type:'line',
        data: {
            labels: today, //array from Local storage
            datasets: [
                {
                    label: "Anxiety",
                    data: anx_list, //array from Local storage
                    fill: false,
                    borderColor: "rgb(255, 99, 132)",
                    lineTension: 0.1
                },
                {
                    label: "Caffiene",
                    data: caf_list, //array from Local storage
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                },
                {
                    label: "Meditation",
                    data: med_list, //array from Local storage
                    fill: false,
                    borderColor: "rgb(0, 150, 255)",
                    lineTension: 0.1
                }
            ]
        },

        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, //to make y-axis scal from 0 -10
                        max: 10,
                        stepSize: 1
                    }
                }]
            }
        }
    });

    //resetting the chart by deleting local storage

    var reset= document.getElementById("reset");
    reset.onclick = resetFunction;
    
        function resetFunction(){
        localStorage.removeItem('anx_list');
        localStorage.removeItem('caf_list');
        localStorage.removeItem('med_list');
        localStorage.removeItem('today');
        location.reload();
    }


    //delete today's entry when yes button is pressed
    var yes = document.getElementById("yes");
    yes.onclick= delEntry;

    function delEntry(){
        //deleting the last entry from the array 
        anx_list.pop();
        caf_list.pop();
        med_list.pop();
        today.pop()

        //storing arrays back to local storage after deleting last entry 
        localStorage.setItem('anx_list', JSON.stringify(anx_list));
        localStorage.setItem('caf_list', JSON.stringify(caf_list));
        localStorage.setItem('med_list', JSON.stringify(med_list));
        localStorage.setItem('today', JSON.stringify(today));

        //refreshing the page 
        location.reload();
        message.style.display="none";
    }

    //hide the message when no is pressed
    var no = document.getElementById("no");
    no.onclick= hideMessage;

    function hideMessage(){
        message.style.display="none";
    }

  
    //Quote of the day section 

    var quote = document.getElementById("Quote");
    var author = document.getElementById("Author");

    //getting data from zenquotes API
    const api_url = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/today");

    async function getQuote() {
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        const result = JSON.parse(data.contents)[0];
       
        //putting the data on html
    
        quote.innerHTML=result.q;
        author.innerHTML=result.a;
        
    } 
    catch(error) {
        console.error(error);
        quote.innerHTML="No Quote Today";
    }
    }

    getQuote();


    //To show the value of the range 
    var sliderValue = document.getElementsByClassName("sliderValue");

    anx_value.onchange= function(){
        sliderValue[0].innerHTML = anx_value.value;
    }

    caf_value.onchange= function(){
        sliderValue[1].innerHTML = caf_value.value;
    }

    med_value.onchange= function(){
        sliderValue[2].innerHTML = med_value.value;
    }

}