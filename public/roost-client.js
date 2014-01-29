var humidifierEnabled;
var fanHighEnabled;


$(document).on("click", ".tempControlDialog", function () {
     var id = $(this).data('id');
	 var val = $(this).data('value');
     $(".modal-title").html( "<b>"+id+"</b>" );
	 $(".modal-body-text").text(val);
});

function fanClick()
{

	data={fanHigh:!fanHighEnabled};
	$.ajax({
    url: "/apps/hvac",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
});

};
function humidifierClick(){
	console.log("humidifierClick");
	data={enabled:!humidifierEnabled};
	$.ajax({
    url: "/apps/humidifier",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
});

};


$( document ).ready(function() {

/*
	var intervalGarageID =setInterval(queryGarage,2000);
	var intervalMotionID =setInterval(queryMotion,2000);
	var intervalTempID =setInterval(queryTemperatures,60000);
	var queryHumidifierID =setInterval(queryHumidifier,2000);
	var queryHVACID =setInterval(queryHVAC,2000);
	
	*/
	dataFeedInit();
	/*
	queryTemperatures();
	queryGarage();
	queryHumidifier();
	queryMotion();
	queryHVAC();
	*/ 
});


function queryHVAC(){
  jQuery.get("/apps/hvac",function(data,status){
  fanHighEnabled=data.fanHigh;
  console.log("fan " +fanHighEnabled);
  });
};

function queryGarage(){
  jQuery.get("/apps/garage",function(data,status){
  console.log( data);
   if(data.doorOpen !== false){
	$('#garage').removeClass("btn-success");
	$('#garage').addClass("btn-danger");
    $('#garage').text("Garage Open");
  }
  else{
    $('#garage').removeClass("btn-danger");
	$('#garage').addClass("btn-success",1000,"swing");
	$('#garage').text("Garage Closed");
  }  
  });
};

function queryMotion(){
  jQuery.get("/apps/motion",function(data,status){
  console.log( data);
   if(data.motionDetected !== false){
	$('#motion').removeClass("btn-default");
	$('#motion').addClass("btn-info");
	$('#motion').text("Motion Detected");
  }
  else{
    $('#motion').removeClass("btn-info");
	$('#motion').addClass("btn-default");
	$('#motion').text("No Motion");
  }  
  });
};

function queryTemperatures(){
  jQuery.get("/devices/ow/28.7E9A2B040000/temperature",function(data,status){
  console.log( data);
  temp=parseFloat(data.temperature);
  temp=Math.round( temp * 10) / 10
  $('#KitchenTemp').text(temp + "\xB0 Celcius");
 
  });
};


function queryHumidifier(){
  jQuery.get("/apps/humidifier",function(data,status){
  console.log( data);
  humidifierEnabled=data.enabled;
   if(data.enabled !== true){
	$('#humidifier').removeClass("btn-success");
	$('#humidifier').addClass("btn-danger");
    $('#humidifier').text("Humidifier Off");
  }
  else{
    $('#humidifier').removeClass("btn-danger");
	$('#humidifier').addClass("btn-success",1000,"swing");
	$('#humidifier').text("Humidifier On");
  }  
  });
}; 

function processGarageUpdate(updateObject){
	console.log("processGarageUpdate: " + updateObject.doorOpen);
  if(updateObject.doorOpen !== false){
	$('#garage').removeClass("btn-success");
	$('#garage').addClass("btn-danger");
    $('#garage').text("Garage Open");
  }
  else{
    $('#garage').removeClass("btn-danger");
	$('#garage').addClass("btn-success",1000,"swing");
	$('#garage').text("Garage Closed");
  }  	
}

function processMotionUpdate(updateObject){

 if(updateObject.motionDetected !== false){
	$('#motion').removeClass("btn-default");
	$('#motion').addClass("btn-info");
	$('#motion').text("Motion Detected");
  }
  else{
    $('#motion').removeClass("btn-info");
	$('#motion').addClass("btn-default");
	$('#motion').text("No Motion");
  }  
}

function processHVACUpdate(updateObject){

 var obj = updateObject;
  
 fanHighEnabled=obj.fanHigh;
 if(obj.fanHigh !== false){
	$('#fanHigh').removeClass("btn-default");
	$('#fanHigh').addClass("btn-info");
	$('#fanHigh').text("Fan On");
  }
  else{
    $('#fanHigh').removeClass("btn-info");
	$('#fanHigh').addClass("btn-default");
	$('#fanHigh').text("Fan Off");
  }
 if(obj.heatOn !== false){
	$('#heat').removeClass("btn-default");
	$('#heat').addClass("btn-danger");
	$('#heat').text("Heat On");
  }
  else{
    $('#heat').removeClass("btn-danger");
	$('#heat').addClass("btn-default");
	$('#heat').text("Heat Off");
  }
  
  console.log("processHVACUpdate");
  var temperatureObjs=obj.currentTemperatures;
  console.log(temperatureObjs);
  for (var i in temperatureObjs){
	console.log(temperatureObjs[i]);
	processTemperatureUpdate(temperatureObjs[i]);
  }

}
function processHumidifierUpdate(updateObject){
  console.log(updateObject);
  humidifierEnabled=updateObject.enabled;
  if(humidifierEnabled!== true){
	$('#humidifier').removeClass("btn-success");
	$('#humidifier').addClass("btn-danger");
    $('#humidifier').text("Humidifier Off");
  }
  else{
    $('#humidifier').removeClass("btn-danger");
	$('#humidifier').addClass("btn-success",1000,"swing");
	$('#humidifier').text("Humidifier On");
  }  
}

function processTemperatureUpdate(updateObject){
    console.log(updateObject);
	var temp=parseFloat(updateObject.value);
	temp=Math.round( temp * 100) / 100
	var updateTime= new Date(updateObject.updateTime);
	var hours=updateTime.getHours();
	var am_pm="am"
	
	if(hours>=12){
		am_pm="pm";
		if(hours > 12){
			hours= hours- 12;
		}
	}
	
	var tempMin = updateTime.getMinutes();
	var minString;
	if(tempMin<10){
		minString = "0"+tempMin;
	}
	else{
		minString = tempMin;
	}
	
	var timeStr=hours + ":"+minString + " " +am_pm;

	$('#'+updateObject.key).html('<p ALIGN="left"><b>'+updateObject.name+'</b></p><p ALIGN="right"> '+temp + '\xB0 C @' + timeStr+'</p>');
	
	if(updateObject.callingForHeat !== undefined){
		if(updateObject.callingForHeat){
			$('#'+updateObject.key).removeClass("btn-default");
			$('#'+updateObject.key).addClass("btn-danger");
		}
		else{
			$('#'+updateObject.key).removeClass("btn-danger");
			$('#'+updateObject.key).addClass("btn-default");
		}
	}
}

function dataFeedInit(){
  var socket = io.connect();
    socket.on('connected', function (data) {
    console.log(data);
	processGarageUpdate(data.garage);
	processMotionUpdate(data.motion);
	processHVACUpdate(data.hvac);
	processHumidifierUpdate(data.humidifier);
  });
  
  
  socket.on('motionUpdate',function(data){
	processMotionUpdate(JSON.parse(data));
  });
  
  socket.on('garageDoorUpdate',function(data){
	processGarageUpdate(JSON.parse(data));
  });
  
  socket.on('temperatureUpdate', function (data) {
    console.log("processTemperatureUpdate" + data);
	processTemperatureUpdate(JSON.parse(data));
  });
  
   socket.on('humidifierUpdate', function (data) {
    console.log("humidifierUpdate " + data);
	processHumidifierUpdate(JSON.parse(data));
  });
  
  socket.on('hvacUpdate', function (data) {
    console.log("hvacUpdate " + data);
	processHVACUpdate(JSON.parse(data));
  });
  
  socket.on('connect', function () {console.log("connect: server is online")
	$('#connectingAlert').hide();
	$('#offlineAlert').hide();
  })
    socket.on('connect_failed', function () {console.log("connect_failed")})
  socket.on('connecting', function () {console.log("connecting")
	$('#connectingAlert').show();
  })
  socket.on('error', function () {console.log("error")})
  socket.on('reconnect_failed', function () { console.log("reconnect_failed")})
  socket.on('disconnect', function () {console.log("disconnect: server is offline")
	$('#offlineAlert').show();
  })
  socket.on('reconnecting', function () {console.log("reconnecting'")})
  socket.on('reconnect', function () {console.log("reconnect'")}) 
};